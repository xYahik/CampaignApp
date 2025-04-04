package com.yahik.campaignapp.commands;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.yahik.campaignapp.enums.CampaignStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateCampaign {
    private String name;
    private Set<String> keywords;
    private Double bidAmount;
    private Double campaignFund;
    private CampaignStatus status;
    private String town;
    private Integer radius;
}
