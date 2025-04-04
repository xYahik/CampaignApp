package com.yahik.campaignapp.dtos;

import com.yahik.campaignapp.enums.CampaignStatus;
import lombok.*;

import java.io.Serializable;
import java.util.Set;

@NoArgsConstructor(force = true)
@Getter
@AllArgsConstructor
@Setter
public class CampaignDTO implements Serializable {
    private final Long id;
    private final String name;
    private final Set<String> keywords;
    private final Double bidAmount;
    private final Double campaignFund;
    private final CampaignStatus status;
    private final String town;
    private final int radius;
}