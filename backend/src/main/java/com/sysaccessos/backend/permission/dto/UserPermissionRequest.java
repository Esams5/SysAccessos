package com.sysaccessos.backend.permission.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class UserPermissionRequest {

    @NotNull(message = "O usuário é obrigatório.")
    @Min(value = 1, message = "Usuário inválido.")
    private Long userId;

    @NotNull(message = "A área é obrigatória.")
    @Min(value = 1, message = "Área inválida.")
    private Long areaId;

    @NotBlank(message = "O nível de acesso é obrigatório.")
    @Size(max = 40, message = "O nível de acesso deve ter no máximo 40 caracteres.")
    private String accessLevel;

    @NotNull(message = "A data de início é obrigatória.")
    private LocalDate validFrom;

    @NotNull(message = "A data de término é obrigatória.")
    private LocalDate validUntil;

    @NotBlank(message = "O status é obrigatório.")
    @Size(max = 20, message = "O status deve ter no máximo 20 caracteres.")
    private String status;

    @Size(max = 160, message = "As observações devem ter no máximo 160 caracteres.")
    private String notes;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(String accessLevel) {
        this.accessLevel = accessLevel;
    }

    public LocalDate getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDate validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
