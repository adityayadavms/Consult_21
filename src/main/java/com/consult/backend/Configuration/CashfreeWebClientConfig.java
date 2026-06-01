package com.consult.backend.Configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@RequiredArgsConstructor
public class CashfreeWebClientConfig {

    private final CashFreeConfig cashFreeConfig;

    @Bean
    public WebClient cashfreeWebClient(){

        return WebClient.builder()
                .baseUrl(cashFreeConfig.getBaseUrl())
                .build();
    }
}
