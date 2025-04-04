package com.yahik.campaignapp;

import com.yahik.campaignapp.entities.Campaign;
import com.yahik.campaignapp.entities.User;
import com.yahik.campaignapp.enums.UserType;
import com.yahik.campaignapp.repositories.CampaignRepository;
import com.yahik.campaignapp.repositories.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class CampaignappApplication {

	public static void main(String[] args) {

		ConfigurableApplicationContext context = SpringApplication.run(CampaignappApplication.class, args);
		UserRepository userRepository = context.getBean(UserRepository.class);
		CampaignRepository campaignRepository = context.getBean(CampaignRepository.class);


		User newUser = User.builder().email("email@gmail.com").password("password").currentFunds(100000D).userType(UserType.EMERALD_USER).build();
		userRepository.save(newUser);

		Campaign campaign = Campaign.builder().name("Campaign name").campaignFund(10000D).town("TestTown").bidAmount(20D).radius(200).owner(newUser).build();
		campaign.getKeywords().add("cloths");
		campaignRepository.save(campaign);
	}

}
