package com.opsgrid.backend.dto;


public record InviteUserRequest(
        String username,
        String email,
        String employeeId,
        Integer roleId 
) {}