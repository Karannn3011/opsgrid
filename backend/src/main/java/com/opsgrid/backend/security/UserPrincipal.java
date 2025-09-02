package com.opsgrid.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import java.util.Collection;

public class UserPrincipal extends User {
    private final Integer companyId;

    public UserPrincipal(String username, String password, Integer companyId, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.companyId = companyId;
    }

    public Integer getCompanyId() {
        return companyId;
    }
}