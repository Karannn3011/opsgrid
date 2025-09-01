package com.opsgrid.backend.entity;

public enum UserStatus {
    PENDING, // User has been invited but has not set a password yet
    ACTIVE   // User has set a password and can log in
}