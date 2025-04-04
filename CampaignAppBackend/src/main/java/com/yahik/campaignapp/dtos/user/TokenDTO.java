package com.yahik.campaignapp.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor(force = true)
@Getter
@AllArgsConstructor
public class TokenDTO {
    private final Long id;
    private final String email;
}
