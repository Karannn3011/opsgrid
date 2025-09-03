package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CompanyRegistrationRequest;
import com.opsgrid.backend.dto.InviteUserRequest;
import com.opsgrid.backend.dto.SetPasswordRequest;
import com.opsgrid.backend.entity.Company;
import com.opsgrid.backend.entity.Role;
import com.opsgrid.backend.entity.User;
import com.opsgrid.backend.entity.UserStatus;
import com.opsgrid.backend.repository.CompanyRepository;
import com.opsgrid.backend.repository.RoleRepository;
import com.opsgrid.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
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
    private final CompanyRepository companyRepository; // Inject CompanyRepository
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    @Transactional // Use transaction to ensure all or nothing is saved
    public User registerCompany(CompanyRegistrationRequest request) {
        // 1. Create and save the new company
        Company company = new Company();
        company.setName(request.companyName());
        Company savedCompany = companyRepository.save(company);

        // 2. Find the ADMIN role
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Error: ADMIN role not found."));

        // 3. Create the new admin user for this company
        User admin = new User();
        admin.setUsername(request.adminUsername());
        admin.setEmail(request.adminEmail());
        admin.setPassword(passwordEncoder.encode(request.adminPassword())); // Hash the password immediately
        admin.setEmployeeId(request.adminEmployeeId());
        admin.setRole(adminRole);
        admin.setCompany(savedCompany); // Link the user to the new company
        admin.setStatus(UserStatus.ACTIVE); // The admin is active immediately

        return userRepository.save(admin);
    }

    @Override
    public User inviteUser(InviteUserRequest inviteRequest, Integer companyId) {
        // 1. Validate the roleId exists
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Error: Company not found."));

        // 2. Validate the roleId exists
        Role role = roleRepository.findById(inviteRequest.roleId())
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        // 3. Check if user already exists (scoped to the company for username/email)
        if (userRepository.existsByUsernameAndCompanyId(inviteRequest.username(), companyId)) {
            throw new RuntimeException("Error: Username is already taken in this company!");
        }
        if (userRepository.existsByEmailAndCompanyId(inviteRequest.email(), companyId)) {
            throw new RuntimeException("Error: Email is already in use in this company!");
        }



        // 3. Create a new user object and set its properties
        User user = new User();
        user.setUsername(inviteRequest.username());
        user.setEmail(inviteRequest.email());
        user.setEmployeeId(inviteRequest.employeeId());
        user.setRole(role);
        user.setStatus(UserStatus.PENDING);
        user.setCompany(company);

        // 4. Generate and set the invitation token and its expiry (e.g., 24 hours)
        String token = UUID.randomUUID().toString();
        user.setInvitationToken(token);
        user.setInvitationTokenExpiry(Instant.now().plus(24, ChronoUnit.HOURS));

        // 5. Save the user to the database
        userRepository.save(user);

        // 6. TODO: Send an email to the user with the invitation link
        // For now, we can log it to the console.
        emailService.sendInvitationEmail(user.getEmail(), token);
        System.out.println("Invitation Link: http://localhost:3000/set-password?token=" + token);

        return user;
    }

    @Override
    public void setPassword(SetPasswordRequest setPasswordRequest) {
        // 1. Find user by the token
        User user = userRepository.findByInvitationToken(setPasswordRequest.token())
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