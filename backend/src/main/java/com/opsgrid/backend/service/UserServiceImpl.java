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
    private final CompanyRepository companyRepository; 
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    @Transactional 
    public User registerCompany(CompanyRegistrationRequest request) {
        
        Company company = new Company();
        company.setName(request.companyName());
        Company savedCompany = companyRepository.save(company);

        
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Error: ADMIN role not found."));

        
        User admin = new User();
        admin.setUsername(request.adminUsername());
        admin.setEmail(request.adminEmail());
        admin.setPassword(passwordEncoder.encode(request.adminPassword())); 
        admin.setEmployeeId(request.adminEmployeeId());
        admin.setRole(adminRole);
        admin.setCompany(savedCompany); 
        admin.setStatus(UserStatus.ACTIVE); 

        return userRepository.save(admin);
    }

    @Override
    public User inviteUser(InviteUserRequest inviteRequest, Integer companyId) {
        
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Error: Company not found."));

        
        Role role = roleRepository.findById(inviteRequest.roleId())
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        
        if (userRepository.existsByUsernameAndCompanyId(inviteRequest.username(), companyId)) {
            throw new RuntimeException("Error: Username is already taken in this company!");
        }
        if (userRepository.existsByEmailAndCompanyId(inviteRequest.email(), companyId)) {
            throw new RuntimeException("Error: Email is already in use in this company!");
        }



        
        User user = new User();
        user.setUsername(inviteRequest.username());
        user.setEmail(inviteRequest.email());
        user.setEmployeeId(inviteRequest.employeeId());
        user.setRole(role);
        user.setStatus(UserStatus.PENDING);
        user.setCompany(company);

        
        String token = UUID.randomUUID().toString();
        user.setInvitationToken(token);
        user.setInvitationTokenExpiry(Instant.now().plus(24, ChronoUnit.HOURS));

        
        userRepository.save(user);

        
        
        emailService.sendInvitationEmail(user.getEmail(), token);

        return user;
    }

    @Override
    public void setPassword(SetPasswordRequest setPasswordRequest) {
        
        User user = userRepository.findByInvitationToken(setPasswordRequest.token())
                .orElseThrow(() -> new RuntimeException("Error: Invalid token!"));

        
        if (user.getInvitationTokenExpiry().isBefore(Instant.now())) {
            throw new RuntimeException("Error: Token has expired!");
        }

        
        user.setPassword(passwordEncoder.encode(setPasswordRequest.password()));
        user.setStatus(UserStatus.ACTIVE);

        
        user.setInvitationToken(null);
        user.setInvitationTokenExpiry(null);

        
        userRepository.save(user);
    }
}