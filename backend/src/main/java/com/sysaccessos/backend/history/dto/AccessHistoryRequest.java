package com.sysaccessos.backend.history.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AccessHistoryRequest {

    @NotNull(message = "O usuário é obrigatório.")
    @Min(value = 1, message = "Usuário inválido.")
    private Long userId;

    @NotNull(message = "A área é obrigatória.")
    @Min(value = 1, message = "Área inválida.")
    private Long areaId;

    @NotBlank(message = "O tipo de evento é obrigatório.")
    @Size(max = 10, message = "O tipo de evento deve ter no máximo 10 caracteres.")
    private String eventType;

    @NotBlank(message = "O resultado é obrigatório.")
    @Size(max = 12, message = "O resultado deve ter no máximo 12 caracteres.")
    private String result;

    @NotBlank(message = "O identificador do cartão é obrigatório.")
    @Size(max = 120, message = "O identificador deve ter no máximo 120 caracteres.")
    @Pattern(regexp = "\\d+", message = "O identificador do cartão deve conter apenas números.")
    private String cardIdentifier;

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

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getCardIdentifier() {
        return cardIdentifier;
    }

    public void setCardIdentifier(String cardIdentifier) {
        this.cardIdentifier = cardIdentifier;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
