package com.sysaccessos.backend.visitor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class VisitorRequest {

    @NotBlank(message = "O nome completo é obrigatório.")
    @Size(max = 120, message = "O nome completo deve ter no máximo 120 caracteres.")
    private String fullName;

    @NotBlank(message = "O documento é obrigatório.")
    @Size(min = 5, max = 20, message = "O documento deve ter entre 5 e 20 caracteres.")
    private String documentId;

    @NotBlank(message = "O email é obrigatório.")
    @Email(message = "Formato de email inválido.")
    @Size(max = 120, message = "O email deve ter no máximo 120 caracteres.")
    private String email;

    @NotBlank(message = "O telefone é obrigatório.")
    @Pattern(regexp = "^[0-9()+\\-\\s]{8,20}$", message = "Telefone inválido.")
    private String phone;

    @NotBlank(message = "A empresa é obrigatória.")
    @Size(max = 100, message = "A empresa deve ter no máximo 100 caracteres.")
    private String company;

    @Size(max = 255, message = "As observações devem ter no máximo 255 caracteres.")
    private String notes;

    private boolean active = true;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
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

