/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.itec.portaladministration.pojo;

/**
 *
 * @author iTech-Pc
 */
import com.fasterxml.jackson.annotation.JsonProperty;

public class HashMapKeyValue {
    @JsonProperty
    private String key;
    @JsonProperty
    private String value;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
