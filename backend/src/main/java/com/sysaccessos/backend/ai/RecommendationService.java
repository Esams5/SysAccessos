package com.sysaccessos.backend.ai;

import com.sysaccessos.backend.ai.dto.AreaRecommendationDto;
import com.sysaccessos.backend.history.AccessHistory;
import com.sysaccessos.backend.history.AccessHistoryRepository;
import com.sysaccessos.backend.user.User;
import com.sysaccessos.backend.user.UserRepository;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RecommendationService {

    private final UserRepository userRepository;
    private final AccessHistoryRepository historyRepository;

    public RecommendationService(UserRepository userRepository, AccessHistoryRepository historyRepository) {
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
    }

    @Transactional(readOnly = true)
    public List<AreaRecommendationDto> recommendAreas(String cardIdentifier) {
        if (cardIdentifier == null || cardIdentifier.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o identificador do cartão.");
        }

        User user = userRepository.findByCardIdentifier(cardIdentifier.trim())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cartão não identificado."));

        List<AccessHistory> history = historyRepository.findByUserIdOrderByRecordedAtDesc(user.getId());
        if (history.isEmpty()) {
            return List.of();
        }

        Map<Long, AreaStats> stats = new HashMap<>();
        for (AccessHistory record : history) {
            if (record.getArea() == null) {
                continue;
            }
            Long areaId = record.getArea().getId();
            if (areaId == null) {
                continue;
            }
            AreaStats areaStats = stats.computeIfAbsent(areaId, id -> new AreaStats(
                id,
                record.getArea().getName()
            ));
            areaStats.increment(record.getRecordedAt());
        }

        return stats.values().stream()
            .sorted(Comparator.comparingLong(AreaStats::count).reversed()
                .thenComparing(AreaStats::lastAccess, Comparator.nullsLast(Comparator.reverseOrder())))
            .limit(5)
            .map(AreaStats::toDto)
            .collect(Collectors.toList());
    }

    private static class AreaStats {
        private final Long areaId;
        private final String areaName;
        private long count;
        private OffsetDateTime lastAccess;

        private AreaStats(Long areaId, String areaName) {
            this.areaId = areaId;
            this.areaName = areaName;
        }

        void increment(OffsetDateTime recordedAt) {
            count++;
            if (recordedAt != null) {
                if (lastAccess == null || recordedAt.isAfter(lastAccess)) {
                    lastAccess = recordedAt;
                }
            }
        }

        long count() {
            return count;
        }

        OffsetDateTime lastAccess() {
            return lastAccess;
        }

        AreaRecommendationDto toDto() {
            AreaRecommendationDto dto = new AreaRecommendationDto();
            dto.setAreaId(areaId);
            dto.setAreaName(areaName);
            dto.setAccessCount(count);
            dto.setLastAccessAt(lastAccess);
            dto.setRecommendationReason(String.format("Usuário acessou %s %d vez(es) recentemente.", areaName, count));
            return dto;
        }
    }
}
