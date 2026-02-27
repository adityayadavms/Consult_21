package com.consult.backend.Security;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
@EnableMethodSecurity
public class WebSecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    private final HandlerExceptionResolver handlerExceptionResolver;
    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{
           httpSecurity

                   // DAO Authentication Provider
                   .authenticationProvider(authenticationProvider())

                //  Prevent CORS

                   .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                   // Prevent Clickjacking

                   .headers(headers -> headers
                           .frameOptions(frame -> frame.sameOrigin())
                           .contentSecurityPolicy(csp ->
                                   csp.policyDirectives("frame-ancestors 'self'")
                           )
                   )


                   //  CSRF disabled

                   .csrf(csrf-> csrf.disable())

                   //  Stateless session

                   .sessionManagement(sessionConfig->
                           sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                   //  Authorization rules

                   .authorizeHttpRequests(auth->auth
                           .requestMatchers("/auth/**").permitAll()

                           .requestMatchers("/consultations/**").authenticated()

                           .requestMatchers("/user/**").hasRole("USER")

                           .anyRequest().authenticated()
                   )

                   //  JWT filter

               .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                   // Handle unauthorized access

                   .exceptionHandling(exception -> exception

                           //  HANDLE 401 (UNAUTHORIZED)
                           .authenticationEntryPoint((request, response, authException) -> {
                               response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                               response.setContentType("application/json");
                               response.getWriter().write("{\"error\":\"Unauthorized\"}");
                           })

                           //  HANDLE 403 (FORBIDDEN)
                           .accessDeniedHandler((request, response, ex) -> {
                               handlerExceptionResolver.resolveException(request, response, null, ex);
                           })
                   );

           return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173"));
        // Vite frontend port

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE","OPTIONS"));

        config.setAllowedHeaders(List.of("*"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }





    /*
     =============================
     DAO AUTH PROVIDER
     =============================
    */
    @Bean

    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }


}
