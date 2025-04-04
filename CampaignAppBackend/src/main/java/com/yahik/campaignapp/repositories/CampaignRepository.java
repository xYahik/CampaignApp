package com.yahik.campaignapp.repositories;

import com.yahik.campaignapp.entities.User;
import com.yahik.campaignapp.enums.CampaignStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import com.yahik.campaignapp.entities.Campaign;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findByStatus(CampaignStatus status);
    List<Campaign> findByOwnerId(Long ownerId);

}
