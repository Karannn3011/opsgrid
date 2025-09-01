package com.opsgrid.backend.service;

import com.opsgrid.backend.dto.InviteUserRequest;
import com.opsgrid.backend.dto.SetPasswordRequest;
import com.opsgrid.backend.entity.User;

public interface UserService {
    User inviteUser(InviteUserRequest inviteRequest);
    void setPassword(SetPasswordRequest setPasswordRequest);
}