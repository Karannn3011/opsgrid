package com.opsgrid.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import java.util.Collection;
import java.util.UUID;

public class UserPrincipal extends User {
    private final Integer companyId;
    private final UUID id; 

    public UserPrincipal(UUID id, String username, String password, Integer companyId, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.companyId = companyId;
        this.id = id; 
    }

    public UUID getId() { 
        return id;
    }

    public Integer getCompanyId() {
        return companyId;
    }
}