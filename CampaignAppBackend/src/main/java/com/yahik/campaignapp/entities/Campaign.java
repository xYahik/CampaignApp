package com.yahik.campaignapp.entities;

import com.yahik.campaignapp.enums.CampaignStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Builder
@Table(name = "campaign")
@Entity
@AllArgsConstructor
@NoArgsConstructor

public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private Set<String> keywords = new HashSet<>();;

    @Column(nullable = false)
    private Double bidAmount;

    @Column(nullable = false)
    private Double campaignFund;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CampaignStatus status = CampaignStatus.ON;

    @Column(nullable = false)
    private String town;

    @Column(nullable = false)
    private int radius;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @PrePersist
    @PreUpdate
    private void validateKeywords() {
        if (keywords.isEmpty()) {
            throw new IllegalArgumentException("Keywords cannot be empty.");
        }
    }

    public void UserCheckedCampaign(){
        if(campaignFund - bidAmount >= 0){
            campaignFund -= bidAmount;
        }
        UpdateCampaignStatus();

    }
    private void UpdateCampaignStatus(){
        if(campaignFund - bidAmount < 0){
            status = CampaignStatus.OFF;
        }
    }
}
