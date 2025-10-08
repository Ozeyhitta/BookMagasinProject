package com.bookmagasin.service.impl;

import com.bookmagasin.service.TokenBlacklistService;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.HashSet;


@Service
public class TokenBlacklistServiceImpl implements TokenBlacklistService {
    private final Set<String> blacklist=new HashSet<>();

    @Override
    public void addToken(String token) {
        blacklist.add(token);
    }

    @Override
    public boolean isBlacklisted(String token) {
        return blacklist.contains(token);
    }
}
