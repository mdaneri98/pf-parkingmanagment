package ar.edu.itba.parkingmanagmentapi.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;


/**
 * Utility class for generating, parsing, and validating JWT tokens.
 * <p>
 * This class provides methods to:
 * <ul>
 *     <li>Generate JWT tokens with email and role claims</li>
 *     <li>Extract the email (subject) and custom claims like role from a token</li>
 *     <li>Validate the token's integrity and expiration</li>
 * </ul>
 * <p>
 * The secret key and expiration time are configured through application properties:
 * <ul>
 *     <li>{@code jwt.secret}</li>
 *     <li>{@code jwt.expiration}</li>
 * </ul>
 */
@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Generates a JWT token with the provided email and multiple roles.
     *
     * @param email the user's email (used as subject)
     * @param roles the list of user roles to include as a custom claim
     * @return the generated JWT token
     */
    public String generateTokenWithRoles(String email, List<String> roles) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpiration);

        return Jwts.builder()
                .setSubject(email)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extracts the email (subject) from the token.
     *
     * @param token the JWT token
     * @return the email contained in the token
     */
    public String getEmailFromToken(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Extracts all user roles from the token.
     *
     * @param token the JWT token
     * @return the list of roles contained in the token
     */
    public List<String> getRolesFromToken(String token) {
        Claims claims = extractAllClaims(token);
        Object rolesClaim = claims.get("roles");
        if (rolesClaim instanceof List<?>) {
            List<?> rawList = (List<?>) rolesClaim;
            return rawList.stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .toList();
        }
        String singleRole = claims.get("role", String.class);
        if (singleRole != null) {
            return List.of(singleRole);
        }
        return List.of();
    }

    /**
     * Checks if a user has a specific role based on the token.
     *
     * @param token the JWT token
     * @param role the role to check for
     * @return true if the user has the specified role, false otherwise
     */
    public boolean hasRole(String token, String role) {
        List<String> roles = getRolesFromToken(token);
        return roles.contains(role);
    }

    /**
     * Validates the JWT token for integrity and expiration.
     *
     * @param token the JWT token
     * @return true if the token is valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            logger.error("Token JWT expirado: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            logger.error("Token JWT no soportado: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            logger.error("Token JWT malformado: {}", ex.getMessage());
        } catch (SignatureException ex) {
            logger.error("Firma del token JWT inválida: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            logger.error("Token JWT vacío o nulo: {}", ex.getMessage());
        }
        return false;
    }

    /**
     * Parses and returns all claims from the token.
     *
     * @param token the JWT token
     * @return the claims contained in the token
     */
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Builds the secret key used for signing the token.
     *
     * @return the HMAC SHA key
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
}
