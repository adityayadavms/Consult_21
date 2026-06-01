package com.consult.backend.Configuration;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "cashfree")
@Getter
@Setter
public class CashFreeConfig {
    /*
 =========================================
 CASHFREE APP ID
 =========================================
 */
    private String appId;

    /*
    =========================================
    CASHFREE SECRET KEY
    =========================================
    */
    private String secretKey;

    /*
    =========================================
    CASHFREE BASE URL
    =========================================
    */
    private String baseUrl;
}
