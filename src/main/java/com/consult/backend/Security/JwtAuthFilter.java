package com.consult.backend.Security;
import com.consult.backend.service.TokenBlacklistService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    private final TokenBlacklistService blacklistService;

    @Qualifier("handlerExceptionResolver")
    private final HandlerExceptionResolver handlerExceptionResolver;


    /*
     ==========================================
     SKIP FILTER FOR PUBLIC ENDPOINTS
     ==========================================
    */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path =  request.getServletPath();

        return path.startsWith("/auth")
                || path.startsWith("/public")
                || path.startsWith("/error");
    }

    /*
     ==========================================
     MAIN FILTER LOGIC
     ==========================================
    */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {

            final String authHeader = request.getHeader("Authorization");

            // No token → continue
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring(7);

            //  CHECK REDIS BLACKLIST
            if (blacklistService.isBlacklisted(token)) {
                throw new JwtException("Token is blacklisted");
            }

            // Validate token signature & expiry
            if (!jwtUtil.isTokenValid(token)) {
                throw new JwtException("Invalid JWT token");
            }



            // Ensure token is ACCESS token
            String tokenType = jwtUtil.extractTokenType(token);
            if (!"ACCESS".equals(tokenType)) {
                throw new JwtException("Invalid token type");
            }

            // Extract username (email)
            String email = jwtUtil.extractUsername(token);

            // Authenticate only if not already authenticated
            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

            filterChain.doFilter(request, response);

        } catch (Exception ex) {

            log.error("JWT Authentication error: {}", ex.getMessage());

            handlerExceptionResolver.resolveException(
                    request,
                    response,
                    null,
                    ex
            );
        }
    }
}
