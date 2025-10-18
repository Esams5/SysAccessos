package com.sysaccessos.backend.history;

import com.sysaccessos.backend.area.AccessArea;
import com.sysaccessos.backend.area.AccessAreaRepository;
import com.sysaccessos.backend.history.dto.AccessHistoryDto;
import com.sysaccessos.backend.history.dto.AccessHistoryRequest;
import com.sysaccessos.backend.user.User;
import com.sysaccessos.backend.user.UserRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AccessHistoryService {

    private final AccessHistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final AccessAreaRepository areaRepository;

    public AccessHistoryService(AccessHistoryRepository historyRepository, UserRepository userRepository,
                                AccessAreaRepository areaRepository) {
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
        this.areaRepository = areaRepository;
    }

    @Transactional(readOnly = true)
    public List<AccessHistoryDto> findAll() {
        return historyRepository.findAllByOrderByRecordedAtDesc().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AccessHistoryDto> findBetween(OffsetDateTime start, OffsetDateTime end) {
        return historyRepository.findByRecordedAtBetweenOrderByRecordedAtDesc(start, end).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public AccessHistoryDto create(AccessHistoryRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário informado não existe."));
        AccessArea area = areaRepository.findById(request.getAreaId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Área informada não existe."));

        AccessHistory history = new AccessHistory();
        history.setUser(user);
        history.setArea(area);
        history.setEventType(request.getEventType());
        history.setResult(request.getResult());
        history.setCardIdentifier(request.getCardIdentifier());
        history.setNotes(request.getNotes());
        AccessHistory saved = historyRepository.save(history);
        return toDto(saved);
    }

    private AccessHistoryDto toDto(AccessHistory history) {
        AccessHistoryDto dto = new AccessHistoryDto();
        dto.setId(history.getId());
        dto.setUserId(history.getUser().getId());
        dto.setUserName(history.getUser().getName());
        dto.setAreaId(history.getArea().getId());
        dto.setAreaName(history.getArea().getName());
        dto.setEventType(history.getEventType());
        dto.setResult(history.getResult());
        dto.setCardIdentifier(history.getCardIdentifier());
        dto.setNotes(history.getNotes());
        dto.setRecordedAt(history.getRecordedAt());
        return dto;
    }
}

