package com.yahik.campaignapp.services;

import com.yahik.campaignapp.dtos.CampaignDTO;
import com.yahik.campaignapp.dtos.user.UserInfoDTO;
import com.yahik.campaignapp.entities.Campaign;
import com.yahik.campaignapp.entities.User;
import com.yahik.campaignapp.repositories.CampaignRepository;
import com.yahik.campaignapp.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserInfoDTO getUserInfoByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email).stream().findFirst();
        return user.map(value -> new UserInfoDTO(
                value.getId(),
                value.getEmail(),
                value.getCurrentFunds(),
                value.getUserType()
        )).orElse(null);
    }
}
