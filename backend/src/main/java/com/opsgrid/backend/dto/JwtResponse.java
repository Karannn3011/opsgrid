package com.opsgrid.backend.dto;

import java.util.List;

public record JwtResponse(
    String token, 
    String username, 
    List<String> roles, 
    String companyName 
){}