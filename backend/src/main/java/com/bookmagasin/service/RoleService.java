package com.bookmagasin.service;

import com.bookmagasin.entity.Role;
import com.bookmagasin.enums.ERole;

import java.util.Collection;
import java.util.Set;

public interface RoleService {
    Role getOrCreateRole(ERole name);
    Set<Role> getOrCreateRoles(Collection<ERole> names);
}

