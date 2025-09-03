package com.opsgrid.backend.service;

import com.opsgrid.backend.entity.User;
import com.opsgrid.backend.repository.UserRepository;
import com.opsgrid.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        return new UserPrincipal(
                user.getId(), // Pass the ID
                user.getUsername(),
                user.getPassword(),
                user.getCompany().getId(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getName())));
    }
}