package com.yahik.campaignapp.aspects;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yahik.campaignapp.aspects.context.AuthContext;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;


import static com.yahik.campaignapp.utils.JwtUtil.validateToken;

@Aspect
@Component
public class AuthAspect {
    private final HttpServletRequest request;

    public AuthAspect(HttpServletRequest request) {
        this.request = request;
    }

    @Around("@annotation(com.yahik.campaignapp.annotations.CheckAuth)")
    public Object injectAuthorizationHeader(ProceedingJoinPoint joinPoint) throws Throwable {
        String authorizationHeader = request.getHeader("Authorization");
        AuthContext.setAuthorization(authorizationHeader);

        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String claims = validateToken(token);

                if (claims != null) {


                    ObjectMapper objectMapper = new ObjectMapper();
                    try {
                        JsonNode jsonNode = objectMapper.readTree(claims);
                        AuthContext.setUserId(jsonNode.get("id").asLong());
                        AuthContext.setEmail(jsonNode.get("email").asText());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return joinPoint.proceed();
                }
            }else{
                return ResponseEntity.status(401).body("Authorization header is missing");
            }
        } catch(ExpiredJwtException ex){
            return ResponseEntity.status(401).body(ex.getMessage());
        }
        finally {
            AuthContext.clear();//ensure cleanup
        }
        return ResponseEntity.status(500).body("Internal Server Error");
    }
}
