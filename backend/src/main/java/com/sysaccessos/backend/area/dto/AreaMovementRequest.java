package com.sysaccessos.backend.area.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AreaMovementRequest {

    @NotBlank(message = "O identificador do cartão é obrigatório.")
    @Size(max = 80, message = "O identificador do cartão deve ter no máximo 80 caracteres.")
    @Pattern(regexp = "\\d+", message = "O identificador do cartão deve conter apenas números.")
    private String cardIdentifier;

    @NotNull(message = "A área é obrigatória.")
    @Min(value = 1, message = "Área inválida.")
    private Long areaId;

    @Size(max = 160, message = "As observações devem ter no máximo 160 caracteres.")
    private String notes;

    public String getCardIdentifier() {
        return cardIdentifier;
    }

    public void setCardIdentifier(String cardIdentifier) {
        this.cardIdentifier = cardIdentifier;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

