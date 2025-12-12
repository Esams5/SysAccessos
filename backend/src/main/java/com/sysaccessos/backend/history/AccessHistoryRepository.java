package com.sysaccessos.backend.history;

import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessHistoryRepository extends JpaRepository<AccessHistory, Long> {

    List<AccessHistory> findByRecordedAtBetweenOrderByRecordedAtDesc(OffsetDateTime start, OffsetDateTime end);

    List<AccessHistory> findAllByOrderByRecordedAtDesc();

    List<AccessHistory> findByUserIdOrderByRecordedAtDesc(Long userId);
}
