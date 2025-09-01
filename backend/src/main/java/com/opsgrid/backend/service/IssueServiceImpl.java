package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateIssueRequest;
import com.opsgrid.backend.dto.IssueDTO;
import com.opsgrid.backend.entity.*;
import com.opsgrid.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;
    private final DriverRepository driverRepository;
    private final TruckRepository truckRepository;
    private final UserRepository userRepository; // To find a manager

    @Override
    @Transactional
    public IssueDTO createIssue(CreateIssueRequest request, UUID driverId) {
        // 1. Find the driver reporting the issue
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver profile not found for user id: " + driverId));

        // 2. Find the related truck
        Truck truck = truckRepository.findById(request.relatedTruckId())
                .orElseThrow(() -> new RuntimeException("Truck not found with id: " + request.relatedTruckId()));

        // 3. Business Logic: Find a manager to assign the issue to.
        // (For now, we'll find the first user with ROLE_MANAGER. A real system might have more complex routing logic).
        User manager = userRepository.findFirstByRole_Name("ROLE_MANAGER")
                .orElseThrow(() -> new RuntimeException("No manager found to assign the issue to."));

        // 4. Create and save the new issue
        Issue issue = new Issue();
        issue.setTitle(request.title());
        issue.setDescription(request.description());
        issue.setPriority(request.priority());
        issue.setStatus(IssueStatus.OPEN);
        issue.setReportedByDriver(driver);
        issue.setRelatedTruck(truck);
        issue.setAssignedToManager(manager);

        Issue savedIssue = issueRepository.save(issue);
        return convertToDto(savedIssue);
    }

    @Override
    public List<IssueDTO> getAllIssues() {
        return issueRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public IssueDTO getIssueById(Integer issueId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + issueId));
        return convertToDto(issue);
    }

    @Override
    @Transactional
    public IssueDTO updateIssueStatus(Integer issueId, IssueStatus status) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + issueId));
        issue.setStatus(status);
        Issue updatedIssue = issueRepository.save(issue);
        return convertToDto(updatedIssue);
    }

    // Helper method to convert the complex Issue entity to a DTO
    private IssueDTO convertToDto(Issue issue) {
        return new IssueDTO(
                issue.getId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getStatus(),
                issue.getPriority(),
                issue.getReportedByDriver().getId(),
                issue.getReportedByDriver().getFullName(),
                issue.getAssignedToManager().getId(),
                issue.getAssignedToManager().getUsername(),
                issue.getRelatedTruck().getId(),
                issue.getRelatedTruck().getLicensePlate(),
                issue.getCreatedAt()
        );
    }
}