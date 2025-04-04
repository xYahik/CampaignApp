package com.yahik.campaignapp.commands;

import com.yahik.campaignapp.enums.CampaignStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Getter
public class CreateCampaign {
    private String name;
    private Set<String> keywords;
    private Double bidAmount;
    private Double campaignFund;
    private CampaignStatus status;
    private String town;
    private int radius;

}
