package com.yahik.campaignapp.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.yahik.campaignapp.dtos.user.TokenDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


import javax.xml.crypto.dsig.Transform;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${secretKey.authKey}")
    private String authKey;

    private static String SECRET_AUTH_KEY;

    @PostConstruct
    public void init() {
        SECRET_AUTH_KEY = authKey;
    }

    public static Key getSigningKey(String secretKey) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1h
                .signWith(getSigningKey(SECRET_AUTH_KEY))
                .compact();
    }
    public static String validateToken(String token) {
        Jws<Claims> claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey(SECRET_AUTH_KEY))
                .build()
                .parseClaimsJws(token);
        return claims.getBody().getSubject();
    }

    public static String generateAuthToken(Long id, String email) throws JsonProcessingException {

        TokenDTO tokenDTO = new TokenDTO(id, email);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        String jsonString = objectMapper.writeValueAsString(tokenDTO);
        return generateToken(jsonString);
    }
}