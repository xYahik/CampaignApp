package com.yahik.campaignapp.entities;

import com.yahik.campaignapp.enums.UserType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;

    @Builder.Default
    private Double currentFunds = 0D;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;

    @PrePersist
    public void setDefaultUserType() {
        if (userType == null) {
            this.userType = UserType.NORMAL_USER;
        }
    }

    public void AddFunds(Double funds){
        currentFunds += funds;
    }

    public void RemoveFunds(Double funds){
        currentFunds -= funds;
    }
}
