package com.bookmagasin.service.impl;

import com.bookmagasin.entity.Role;
import com.bookmagasin.enums.ERole;
import com.bookmagasin.repository.RoleRepository;
import com.bookmagasin.service.RoleService;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public Role getOrCreateRole(ERole name) {
        return roleRepository.findByRole(name)
                .orElseGet(() -> roleRepository.save(new Role(null, name, new HashSet<>())));
    }

    @Override
    public Set<Role> getOrCreateRoles(Collection<ERole> names) {
        if (names == null || names.isEmpty()) {
            return Set.of(getOrCreateRole(ERole.CUSTOMER));
        }
        return names.stream()
                .map(this::getOrCreateRole)
                .collect(Collectors.toSet());
    }
}
