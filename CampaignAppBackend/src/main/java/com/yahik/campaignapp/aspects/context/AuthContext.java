package com.yahik.campaignapp.aspects.context;

public class AuthContext {
    private static final ThreadLocal<String> authorizationHeader = new ThreadLocal<>();
    private static final ThreadLocal<Long> tUserId = new ThreadLocal<>();
    private static final ThreadLocal<String> tEmail = new ThreadLocal<>();

    public static void setAuthorization(String auth) {
        authorizationHeader.set(auth);
    }
    public static String getAuthorization() {
        return authorizationHeader.get();
    }
    public static void setUserId(Long userId) {
        tUserId.set(userId);
    }
    public static void setEmail(String email) {
        tEmail.set(email);
    }
    public static Long getUserId() {
        return tUserId.get();
    }
    public static String getEmail() {
        return tEmail.get();
    }

    public static void clear() {
        authorizationHeader.remove();
        tUserId.remove();
        tEmail.remove();
    }
}