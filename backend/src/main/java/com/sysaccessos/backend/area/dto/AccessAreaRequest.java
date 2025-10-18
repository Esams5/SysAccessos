package com.sysaccessos.backend.area.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AccessAreaRequest {

    @NotBlank(message = "O nome da área é obrigatório.")
    @Size(max = 80, message = "O nome deve ter no máximo 80 caracteres.")
    private String name;

    @NotBlank(message = "A descrição é obrigatória.")
    @Size(max = 160, message = "A descrição deve ter no máximo 160 caracteres.")
    private String description;

    @NotBlank(message = "A localização é obrigatória.")
    @Size(max = 120, message = "A localização deve ter no máximo 120 caracteres.")
    private String location;

    @NotBlank(message = "O nível de segurança é obrigatório.")
    @Size(max = 40, message = "O nível de segurança deve ter no máximo 40 caracteres.")
    private String securityLevel;

    @Size(max = 255, message = "As observações devem ter no máximo 255 caracteres.")
    private String notes;

    private boolean active = true;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSecurityLevel() {
        return securityLevel;
    }

    public void setSecurityLevel(String securityLevel) {
        this.securityLevel = securityLevel;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

