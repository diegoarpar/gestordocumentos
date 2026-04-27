package com.itec.utilities.model;

public interface BaseAuthenticationStrategy {
    boolean authenticate(String username, String password);
}
