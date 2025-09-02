package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.InviteUserRequest;
import com.opsgrid.backend.security.UserPrincipal;
import com.opsgrid.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @PostMapping("/users/invite")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> inviteUser(@RequestBody InviteUserRequest inviteRequest, @AuthenticationPrincipal UserPrincipal principal) {
        try {
            // Pass the admin's companyId to the service
            userService.inviteUser(inviteRequest, principal.getCompanyId());
            return ResponseEntity.status(HttpStatus.CREATED).body("User invited successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}