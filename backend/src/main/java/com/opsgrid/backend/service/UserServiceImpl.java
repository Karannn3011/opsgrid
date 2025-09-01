package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.InviteUserRequest;
import com.opsgrid.backend.dto.SetPasswordRequest;
import com.opsgrid.backend.entity.Role;
import com.opsgrid.backend.entity.User;
import com.opsgrid.backend.entity.UserStatus;
import com.opsgrid.backend.repository.RoleRepository;
import com.opsgrid.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder; // To be configured later


    @Override
    public User inviteUser(InviteUserRequest inviteRequest) {
        // 1. Validate the roleId exists
        Role role = roleRepository.findById(inviteRequest.roleId())
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        // 2. Check if user already exists
        if (userRepository.existsByUsername(inviteRequest.username())) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(inviteRequest.email())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // 3. Create a new user object and set its properties
        User user = new User();
        user.setUsername(inviteRequest.username());
        user.setEmail(inviteRequest.email());
        user.setEmployeeId(inviteRequest.employeeId());
        user.setRole(role);
        user.setStatus(UserStatus.PENDING);

        // 4. Generate and set the invitation token and its expiry (e.g., 24 hours)
        String token = UUID.randomUUID().toString();
        user.setInvitationToken(token);
        user.setInvitationTokenExpiry(Instant.now().plus(24, ChronoUnit.HOURS));

        // 5. Save the user to the database
        userRepository.save(user);

        // 6. TODO: Send an email to the user with the invitation link
        // For now, we can log it to the console.
        System.out.println("Invitation Link: http://localhost:3000/set-password?token=" + token);

        return user;
    }

    @Override
    public void setPassword(SetPasswordRequest setPasswordRequest) {
        // 1. Find user by the token
        User user = (User) userRepository.findByInvitationToken(setPasswordRequest.token())
                .orElseThrow(() -> new RuntimeException("Error: Invalid token!"));

        // 2. Check if the token has expired
        if (user.getInvitationTokenExpiry().isBefore(Instant.now())) {
            throw new RuntimeException("Error: Token has expired!");
        }

        // 3. Hash the new password and update the user
        user.setPassword(passwordEncoder.encode(setPasswordRequest.password()));
        user.setStatus(UserStatus.ACTIVE);

        // 4. Invalidate the token
        user.setInvitationToken(null);
        user.setInvitationTokenExpiry(null);

        // 5. Save the updated user
        userRepository.save(user);
    }
}