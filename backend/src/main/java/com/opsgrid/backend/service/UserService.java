package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.CompanyRegistrationRequest;
import com.opsgrid.backend.dto.InviteUserRequest;
import com.opsgrid.backend.dto.SetPasswordRequest;
import com.opsgrid.backend.entity.User;

public interface UserService {
    User registerCompany(CompanyRegistrationRequest registrationRequest);

    
    User inviteUser(InviteUserRequest inviteRequest, Integer companyId);

    void setPassword(SetPasswordRequest setPasswordRequest);
}