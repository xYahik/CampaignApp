package com.yahik.campaignapp.controllers;

import com.yahik.campaignapp.annotations.CheckAuth;
import com.yahik.campaignapp.aspects.context.AuthContext;
import com.yahik.campaignapp.commands.CreateCampaign;
import com.yahik.campaignapp.commands.UpdateCampaign;
import com.yahik.campaignapp.dtos.CampaignDTO;
import com.yahik.campaignapp.entities.Campaign;
import com.yahik.campaignapp.entities.User;
import com.yahik.campaignapp.enums.CampaignStatus;
import com.yahik.campaignapp.enums.UserType;
import com.yahik.campaignapp.repositories.CampaignRepository;
import com.yahik.campaignapp.repositories.UserRepository;
import com.yahik.campaignapp.services.CampaignService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/campaign")
@CrossOrigin(origins = "*")
public class CampaignController {

    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;
    private final CampaignService campaignService;

    @Transactional
    @GetMapping("/")
    public ResponseEntity<Object> campaignGetEndPoint() {
        try {
            List<CampaignDTO> campaigns = campaignService.getAllAvailableCampaigns();
            return ResponseEntity.ok(campaigns);

        } catch (Exception ex) {
            return ResponseEntity.status(500).body(ex.getMessage());
        }
    }
    @Transactional
    @GetMapping("/my")
    @CheckAuth
    public ResponseEntity<Object> myCampaignGetEndPoint() {
        try {
            List<CampaignDTO> campaigns = campaignService.getAllAvailableCampaignsByUserId(AuthContext.getUserId());
            return ResponseEntity.ok(campaigns);

        } catch (Exception ex) {
            return ResponseEntity.status(500).body(ex.getMessage());
        }
    }
    @Transactional
    @GetMapping("/{id}")
    public ResponseEntity<Object> myCampaignGetEndPoint(@PathVariable("id") Long id) {
        try {
            CampaignDTO campaign = campaignService.getCampaignById(id);
            return ResponseEntity.ok(campaign);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(ex.getMessage());
        }
    }
    @Transactional
    @PostMapping("/")
    @CheckAuth
    public ResponseEntity<Object> campaignCreateEndPoint(@RequestBody CreateCampaign command) {
        try{
            Optional<User> user = userRepository.findById(AuthContext.getUserId());
            if(user.isPresent()) {
                if(user.get().getUserType() != UserType.EMERALD_USER)
                    return ResponseEntity.status(403).body("User is not emerald");

                if(user.get().getCurrentFunds() < command.getCampaignFund()){
                    return ResponseEntity.status(401).body("You don't have enough funds");
                }

                Campaign campaign = Campaign.builder()
                        .name(command.getName())
                        .campaignFund(command.getCampaignFund())
                        .town(command.getTown())
                        .bidAmount(command.getBidAmount())
                        .radius(command.getRadius())
                        .owner(user.get()).build();
                for (var keyword : command.getKeywords()) {
                    campaign.getKeywords().add(keyword);
                }
                user.get().RemoveFunds(command.getCampaignFund());
                campaignRepository.save(campaign);

                return ResponseEntity.ok("Campaign created successfully");
            }else {
                return ResponseEntity.status(500).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @Transactional
    @PutMapping("/{id}")
    @CheckAuth
    public ResponseEntity<Object> campaignUpdateEndPoint(@PathVariable("id") Long id,@RequestBody UpdateCampaign command){
            Optional<Campaign> campaign = campaignRepository.findById(id);
            if(campaign.isPresent()){
                if(!campaign.get().getOwner().getId().equals(AuthContext.getUserId())) {
                    return ResponseEntity.status(401).body("Unauthorized");
                }
                if(command.getName() != null){
                    campaign.get().setName(command.getName());
                }
                if(command.getKeywords() != null){
                    if(!command.getKeywords().isEmpty()){
                        campaign.get().setKeywords(command.getKeywords());
                    }else{
                        return ResponseEntity.status(401).body("Keywords cannot be empty");
                    }
                }
                if(command.getBidAmount() != null){
                    if(command.getBidAmount() > 0){
                        campaign.get().setBidAmount(command.getBidAmount());
                    }else{
                        return ResponseEntity.status(401).body("BidAmount cannot be less or equal 0");
                    }
                }
                if(command.getCampaignFund() != null){
                    Double differenceFund = command.getCampaignFund() - campaign.get().getCampaignFund();
                    if(differenceFund > 0){
                        campaign.get().getOwner().RemoveFunds(differenceFund);
                    }else{
                        campaign.get().getOwner().AddFunds(differenceFund*-1);
                    }
                    campaign.get().setCampaignFund(command.getCampaignFund());
                }
                if(command.getStatus() != null){
                    if(command.getStatus() == CampaignStatus.ON && campaign.get().getCampaignFund()-campaign.get().getBidAmount()<=0){
                        return ResponseEntity.status(401).body("Campaign funds cannot be less than bid amount");
                    }
                    campaign.get().setStatus(command.getStatus());
                }
                if(command.getTown() != null){
                    campaign.get().setTown(command.getTown());
                }
                if(command.getRadius() != null){
                    if(command.getRadius() >= 0){
                        campaign.get().setRadius(command.getRadius());
                    }else{
                        return ResponseEntity.status(401).body("Radius cannot be less than 0");
                    }
                }
                campaignRepository.save(campaign.get());
                return ResponseEntity.ok("Campaign updated successfully");
            }
        return ResponseEntity.status(500).body("Internal Server Error");
    }

    @Transactional
    @DeleteMapping("/{id}")
    @CheckAuth
    public ResponseEntity<Object> campaignDeleteEndPoint(@PathVariable("id") Long id) {
        Optional<Campaign> campaign = campaignRepository.findById(id);
        if (campaign.isPresent()) {
            if(!campaign.get().getOwner().getId().equals(AuthContext.getUserId())) {
                return ResponseEntity.status(401).body("Unauthorized");
            }
            campaign.get().getOwner().AddFunds(campaign.get().getCampaignFund());
            campaignRepository.delete(campaign.get());
            return ResponseEntity.ok("Campaign deleted successfully");
        }
        return ResponseEntity.status(400).body("Could not find Campaign");
    }

    @Transactional
    @PostMapping("/{id}/check")
    public ResponseEntity<Object> campaignCheckEndPoint(@PathVariable("id") Long id) {
        Optional<Campaign> campaign = campaignRepository.findById(id);
        if(campaign.isPresent()) {
            if(campaign.get().getStatus() == CampaignStatus.ON) {
                campaign.get().UserCheckedCampaign();
                return ResponseEntity.ok("Campaign checked successfully");
            }else{
                return ResponseEntity.status(400).body("Campaign already ended");
            }
        }
        return ResponseEntity.status(500).body("Campaign check failed");
    }
}
