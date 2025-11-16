package com.bookmagasin.service;

public interface TokenBlacklistService {
    void addToken(String token);
    boolean isBlacklisted(String token);
}

