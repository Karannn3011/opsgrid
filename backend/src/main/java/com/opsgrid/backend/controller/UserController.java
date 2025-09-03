package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.UserDTO; // Import the new DTO
import com.opsgrid.backend.entity.User;
import com.opsgrid.backend.repository.UserRepository;
import com.opsgrid.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors; // Import Collectors

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/unprofiled-drivers")
    public ResponseEntity<List<UserDTO>> getUnprofiledDrivers(@AuthenticationPrincipal UserPrincipal principal) {
        // 1. Fetch the User entities from the database
        List<User> users = userRepository.findUsersWithRoleDriverAndNoDriverProfile(principal.getCompanyId());

        // 2. Convert the list of User entities into a list of UserDTOs
        List<UserDTO> userDTOs = users.stream()
                .map(user -> new UserDTO(user.getId(), user.getUsername(), user.getEmail()))
                .collect(Collectors.toList());

        // 3. Return the DTO list
        return ResponseEntity.ok(userDTOs);
    }
}