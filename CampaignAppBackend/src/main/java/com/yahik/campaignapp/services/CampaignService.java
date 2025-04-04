package com.yahik.campaignapp.services;

import com.yahik.campaignapp.dtos.CampaignDTO;
import com.yahik.campaignapp.entities.Campaign;
import com.yahik.campaignapp.enums.CampaignStatus;
import com.yahik.campaignapp.repositories.CampaignRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;

    public List<CampaignDTO> getAllAvailableCampaigns() {
        List<Campaign> campaigns = campaignRepository.findByStatus(CampaignStatus.ON);
        return campaigns.stream().map(campaign -> {
            return new CampaignDTO(
                    campaign.getId(),
                    campaign.getName(),
                    campaign.getKeywords(),
                    campaign.getBidAmount(),
                    campaign.getCampaignFund(),
                    campaign.getStatus(),
                    campaign.getTown(),
                    campaign.getRadius()
            );
        }).collect(Collectors.toList());
    }

    public List<CampaignDTO> getAllAvailableCampaignsByUserId(Long userId) {
        List<Campaign> campaigns = campaignRepository.findByOwnerId(userId);
        return campaigns.stream().map(campaign -> {
            return new CampaignDTO(
                    campaign.getId(),
                    campaign.getName(),
                    campaign.getKeywords(),
                    campaign.getBidAmount(),
                    campaign.getCampaignFund(),
                    campaign.getStatus(),
                    campaign.getTown(),
                    campaign.getRadius()
            );
        }).collect(Collectors.toList());
    }

    public CampaignDTO getCampaignById(Long id) {
        Optional<Campaign> campaign = campaignRepository.findById(id);
        return campaign.map(value -> new CampaignDTO(
                value.getId(),
                value.getName(),
                value.getKeywords(),
                value.getBidAmount(),
                value.getCampaignFund(),
                value.getStatus(),
                value.getTown(),
                value.getRadius()
        )).orElse(null);
    }
}
