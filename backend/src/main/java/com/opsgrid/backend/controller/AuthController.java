package com.opsgrid.backend.controller;

import com.opsgrid.backend.dto.JwtResponse;
import com.opsgrid.backend.dto.LoginRequest;
import com.opsgrid.backend.dto.SetPasswordRequest;
import com.opsgrid.backend.service.JwtService;
import com.opsgrid.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/set-password")
    public ResponseEntity<?> setPassword(@RequestBody SetPasswordRequest setPasswordRequest) {
        try {
            userService.setPassword(setPasswordRequest);
            return ResponseEntity.ok("Password set successfully. You can now log in.");
        } catch (RuntimeException e) {
            // Catches errors like "Invalid token" or "Token expired"
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password()));

        // Set the authentication in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate the JWT
        String jwt = jwtService.generateJwtToken(authentication);

        // Get user details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Return the response
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), roles));
    }
}