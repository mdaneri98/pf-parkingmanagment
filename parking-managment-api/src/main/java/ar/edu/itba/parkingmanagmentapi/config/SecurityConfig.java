package ar.edu.itba.parkingmanagmentapi.config;

import ar.edu.itba.parkingmanagmentapi.security.JwtAuthorizationFilter;
import ar.edu.itba.parkingmanagmentapi.util.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, 
                                         CorsConfigurationSource corsConfigurationSource,
                                         JwtUtil jwtUtil) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll() 
                
                .requestMatchers("GET", "/users/**").authenticated()
                .requestMatchers("GET", "/parking-lots/**").authenticated()
                .requestMatchers("GET", "/vehicles/**").authenticated()
                .requestMatchers("GET", "/spots/**").authenticated()
                .requestMatchers("GET", "/reservations/**").authenticated()
                .requestMatchers("GET", "/reviews/**").authenticated()
                .requestMatchers("GET", "/incidents/**").authenticated()
                .requestMatchers("GET", "/actuator/**").authenticated()
                
                .requestMatchers("POST", "/users/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("PUT", "/users/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("DELETE", "/users/**").hasRole("ADMIN")
                
                .requestMatchers("POST", "/parking-lots/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("PUT", "/parking-lots/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("DELETE", "/parking-lots/**").hasRole("ADMIN")
                
                .requestMatchers("POST", "/vehicles/**").hasAnyRole("ADMIN", "MANAGER", "USER")
                .requestMatchers("PUT", "/vehicles/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("DELETE", "/vehicles/**").hasRole("ADMIN")
                
                .requestMatchers("POST", "/spots/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("PUT", "/spots/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("DELETE", "/spots/**").hasRole("ADMIN")
                
                .requestMatchers("POST", "/reservations/**").hasAnyRole("ADMIN", "MANAGER", "USER")
                .requestMatchers("PUT", "/reservations/**").hasAnyRole("ADMIN", "MANAGER", "USER")
                .requestMatchers("DELETE", "/reservations/**").hasAnyRole("ADMIN", "MANAGER", "USER")
                
                .requestMatchers("POST", "/reviews/**").hasAnyRole("ADMIN", "MANAGER", "USER")
                .requestMatchers("PUT", "/reviews/**").hasAnyRole("ADMIN", "MANAGER", "USER")
                .requestMatchers("DELETE", "/reviews/**").hasAnyRole("ADMIN", "MANAGER")
                
                .requestMatchers("POST", "/incidents/**").hasAnyRole("ADMIN", "MANAGER", "USER")
                .requestMatchers("PUT", "/incidents/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("DELETE", "/incidents/**").hasRole("ADMIN")
                
                .requestMatchers("POST", "/actuator/**").hasRole("ADMIN")
                .requestMatchers("PUT", "/actuator/**").hasRole("ADMIN")
                .requestMatchers("DELETE", "/actuator/**").hasRole("ADMIN")
                
                .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtAuthorizationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class)
            .headers(headers -> headers.frameOptions().disable()); // For H2 Console
        
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    

} 
