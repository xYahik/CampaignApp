package com.yahik.campaignapp.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.yahik.campaignapp.annotations.CheckAuth;
import com.yahik.campaignapp.aspects.context.AuthContext;
import com.yahik.campaignapp.commands.LoginUser;
import com.yahik.campaignapp.commands.RegisterUser;
import com.yahik.campaignapp.dtos.user.TokenDTO;
import com.yahik.campaignapp.dtos.user.UserInfoDTO;
import com.yahik.campaignapp.entities.User;
import com.yahik.campaignapp.enums.UserType;
import com.yahik.campaignapp.repositories.UserRepository;
import com.yahik.campaignapp.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.NoSuchElementException;

import static com.yahik.campaignapp.utils.JwtUtil.generateAuthToken;

@AllArgsConstructor
@RestController
@RequestMapping("/user/")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserRepository userRepository;
    private final UserService userService;

    @Transactional
    @PostMapping("/register")
    public ResponseEntity<String> usersRegisterEndPoint(@RequestBody RegisterUser command) {
        try {
            // Create a new user and set values
            if(userRepository.findByEmail(command.getEmail()).isEmpty()) {

                User user = User.builder()
                        .email(command.getEmail())
                        .password(command.getPassword())
                        .userType(UserType.EMERALD_USER).build();

                if(user.getUserType() == UserType.EMERALD_USER){
                    user.AddFunds(100000D);
                }

                userRepository.save(user);

                return ResponseEntity.ok("User registered successfully with email: " + user.getPassword());
            }else{
                return ResponseEntity.status(400).body("User already exists");
            }

        } catch (Exception ex) {
            return ResponseEntity.status(500).body(ex.getMessage());
        }
    }

    @Transactional
    @PostMapping("/login")
    public ResponseEntity<Object> usersLoginEndPoint(@RequestBody LoginUser command)  {
        try {
            if(command.getEmail() == null || command.getPassword() == null) {
                return ResponseEntity.status(400).body("Email and Password are required");
            }
            User user = userRepository.findByEmail(command.getEmail()).getFirst();
            if(user.getPassword().equals(command.getPassword())) {
                String authToken = generateAuthToken(user.getId(), user.getEmail());
                return ResponseEntity.ok(authToken);
            }
            return ResponseEntity.status(400).body("Invalid Password");
        }catch (JsonProcessingException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(400).body("Couldn't find user with email: " + command.getEmail());
        }
    }
    @Transactional
    @GetMapping("/me")
    @CheckAuth
    public ResponseEntity<Object> usersLoginEndPoint()  {
        try {
            UserInfoDTO userDTO = userService.getUserInfoByEmail(AuthContext.getEmail());
            return ResponseEntity.ok(userDTO);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(400).body("Couldn't find user with email: " + AuthContext.getEmail());
        }
    }
}
