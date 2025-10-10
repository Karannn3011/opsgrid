package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.UserDTO;
import com.opsgrid.backend.dto.UserDetailsDTO; 
import com.opsgrid.backend.entity.User;
import com.opsgrid.backend.repository.UserRepository;
import com.opsgrid.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable; 
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class UserController {

    private final UserRepository userRepository;

    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserDetailsDTO>> getAllUsers(
            @AuthenticationPrincipal UserPrincipal principal,
            Pageable pageable) {
        Page<User> userPage = userRepository.findAllByCompanyId(principal.getCompanyId(), pageable);
        Page<UserDetailsDTO> dtoPage = userPage.map(this::convertToUserDetailsDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/unprofiled-drivers")
    public ResponseEntity<List<UserDTO>> getUnprofiledDrivers(@AuthenticationPrincipal UserPrincipal principal) {
        
        List<User> users = userRepository.findUsersWithRoleDriverAndNoDriverProfile(principal.getCompanyId());
        List<UserDTO> userDTOs = users.stream()
                .map(user -> new UserDTO(user.getId(), user.getUsername(), user.getEmail()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    
    private UserDetailsDTO convertToUserDetailsDTO(User user) {
        return new UserDetailsDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getEmployeeId(),
                user.getRole().getName(),
                user.getStatus(),
                user.getCreatedAt());
    }
}