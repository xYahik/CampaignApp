package com.yahik.campaignapp.commands;

import com.yahik.campaignapp.enums.UserType;
import lombok.Getter;

@Getter
public final class RegisterUser {
    private String email;
    private String password;
}
