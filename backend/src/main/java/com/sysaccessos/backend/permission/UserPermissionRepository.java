package com.sysaccessos.backend.permission;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPermissionRepository extends JpaRepository<UserPermission, Long> {

    List<UserPermission> findByUserId(Long userId);

    boolean existsByUserIdAndAreaIdAndStatus(Long userId, Long areaId, String status);

    List<UserPermission> findByUserIdAndAreaId(Long userId, Long areaId);
}
