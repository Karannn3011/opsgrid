package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CreateIssueRequest;
import com.opsgrid.backend.dto.IssueDTO;
import com.opsgrid.backend.entity.*;
import com.opsgrid.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        private final CompanyRepository companyRepository;

        @Override
        @Transactional
        public IssueDTO createIssue(CreateIssueRequest request, UUID driverId, Integer companyId) {
                Company company = companyRepository.findById(companyId)
                                .orElseThrow(() -> new RuntimeException("Company not found: " + companyId));

                // Ensure driver and truck belong to the same company
                Driver driver = driverRepository.findByIdAndCompanyId(driverId, companyId)
                                .orElseThrow(() -> new RuntimeException("Driver not found in this company"));
                Truck truck = truckRepository.findByIdAndCompanyId(request.relatedTruckId(), companyId)
                                .orElseThrow(() -> new RuntimeException("Truck not found in this company"));

                // Find a manager within the SAME company to assign the issue to.
                User manager = userRepository.findFirstByCompanyIdAndRole_Name(companyId, "ROLE_MANAGER")
                                .orElseThrow(() -> new RuntimeException(
                                                "No manager found in this company to assign the issue to."));

                // 4. Create and save the new issue
                Issue issue = new Issue();
                issue.setTitle(request.title());
                issue.setDescription(request.description());
                issue.setPriority(request.priority());
                issue.setStatus(IssueStatus.OPEN);
                issue.setReportedByDriver(driver);
                issue.setRelatedTruck(truck);
                issue.setAssignedToManager(manager);
                issue.setCompany(company); // Set the company

                Issue savedIssue = issueRepository.save(issue);
                return convertToDto(savedIssue);
        }

        @Override
        public Page<IssueDTO> getAllIssues(Integer companyId, Pageable pageable) {
                Page<Issue> issuePage = issueRepository.findAllByCompanyId(companyId, pageable);
                return issuePage.map(this::convertToDto);
        }

        @Override
        public Page<IssueDTO> getIssuesForDriver(UUID driverId, Pageable pageable) {
                Page<Issue> issuePage = issueRepository.findByReportedByDriver_Id(driverId, pageable);
                return issuePage.map(this::convertToDto);
        }

        @Override
        public IssueDTO getIssueById(Integer issueId, Integer companyId) {
                Issue issue = issueRepository.findByIdAndCompanyId(issueId, companyId)
                        .orElseThrow(() -> new RuntimeException("Issue not found: " + issueId));
                return convertToDto(issue);
        }

        @Override
        @Transactional
        public IssueDTO updateIssueStatus(Integer issueId, IssueStatus status, Integer companyId) {
                Issue issue = issueRepository.findByIdAndCompanyId(issueId, companyId)
                                .orElseThrow(() -> new RuntimeException("Issue not found: " + issueId));
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
                                issue.getCreatedAt(),
                                issue.getCompany().getId(),
                                issue.getCompany().getName());
        }
}