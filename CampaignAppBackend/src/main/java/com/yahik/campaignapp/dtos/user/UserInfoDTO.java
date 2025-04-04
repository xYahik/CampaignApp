package com.yahik.campaignapp.dtos.user;

import com.yahik.campaignapp.enums.UserType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(force = true)
@Getter
@AllArgsConstructor
public class UserInfoDTO {
    private final Long id;
    private final String email;
    private final Double currentFunds;
    private final UserType userType;
}
