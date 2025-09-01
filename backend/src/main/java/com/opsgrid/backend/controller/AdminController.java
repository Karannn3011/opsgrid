package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.InviteUserRequest;
import com.opsgrid.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin") // Base path for all admin-related endpoints
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @PostMapping("/users/invite")
    @PreAuthorize("hasRole('ADMIN')") // Secures the endpoint
    public ResponseEntity<?> inviteUser(@RequestBody InviteUserRequest inviteRequest) {
        try {
            userService.inviteUser(inviteRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("User invited successfully. Invitation email sent.");
        } catch (RuntimeException e) {
            // Catches errors like "User already exists" from the service
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}