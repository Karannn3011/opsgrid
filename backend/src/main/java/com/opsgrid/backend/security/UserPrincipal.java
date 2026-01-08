package com.opsgrid.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import java.util.Collection;
import java.util.UUID;

public class UserPrincipal extends User {
    private final Integer companyId;
    private final String companyName; // 1. Add this field
    private final UUID id;

    public UserPrincipal(UUID id, String username, String password, Integer companyId, String companyName, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.companyId = companyId;
        this.companyName = companyName; // 2. Set it in constructor
        this.id = id;
    }

    public UUID getId() {
        return id;
    }

    public Integer getCompanyId() {
        return companyId;
    }

    public String getCompanyName() { // 3. Add getter
        return companyName;
    }
}