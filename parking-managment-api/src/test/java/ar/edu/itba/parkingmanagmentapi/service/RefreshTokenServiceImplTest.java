package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.BaseIntegrationTest;
import ar.edu.itba.parkingmanagmentapi.builder.TestDataBuilder;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.model.RefreshToken;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceImplTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks
    private RefreshTokenServiceImpl refreshTokenService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(refreshTokenService, "refreshTokenTtlMillis", 10_000L);
    }

    @Test
    void createRefreshToken_withRotateTrue_revokesPreviousAndSavesNew() {
        // 1. Arrange
        User user = TestDataBuilder.createValidUser();

        when(refreshTokenRepository.save(any(RefreshToken.class)))
                .thenAnswer(invocation -> {
                    RefreshToken token = invocation.getArgument(0);
                    token.setId(1L);
                    return token;
                });

        // 2. Act
        RefreshToken created = refreshTokenService.createRefreshToken(user, true);

        // 3. Assert
        assertNotNull(created);
        assertEquals(user, created.getUser());
        assertNotNull(created.getToken());
        assertFalse(created.isRevoked());
        assertNotNull(created.getExpiresAt());

        verify(refreshTokenRepository, times(1)).deleteByUser(eq(user));
        verify(refreshTokenRepository, times(1)).save(any(RefreshToken.class));
    }

    @Test
    void createRefreshToken_withoutRotate_doesNotRevokeAndSavesNew() {
        // 1. Arrange
        User user = TestDataBuilder.createValidUser();

        when(refreshTokenRepository.save(any(RefreshToken.class)))
                .thenAnswer(invocation -> {
                    RefreshToken token = invocation.getArgument(0);
                    token.setId(1L);
                    return token;
                });

        // 2. Act
        RefreshToken created = refreshTokenService.createRefreshToken(user, false);

        // 3. Assert
        assertNotNull(created);
        assertEquals(user, created.getUser());
        assertNotNull(created.getToken());
        assertFalse(created.isRevoked());
        assertNotNull(created.getExpiresAt());

        verify(refreshTokenRepository, never()).deleteByUser(any(User.class));
        verify(refreshTokenRepository, times(1)).save(any(RefreshToken.class));
    }

    @Test
    void validateAndRotate_withValidToken_revokesOldAndReturnsNew() {
        // 1. Arrange
        User user = TestDataBuilder.createValidUser();
        RefreshToken existing = new RefreshToken();
        existing.setId(1L);
        existing.setUser(user);
        existing.setToken("old-token");
        existing.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        existing.setRevoked(false);

        when(refreshTokenRepository.findByToken("old-token")).thenReturn(Optional.of(existing));
        
        when(refreshTokenRepository.save(any(RefreshToken.class)))
                .thenAnswer(invocation -> {
                    RefreshToken token = invocation.getArgument(0);
                    if (token.getId() == null) {
                        token.setId(2L);
                    }
                    return token;
                });

        // 2. Act
        RefreshToken result = refreshTokenService.validateAndRotate("old-token");

        // 3. Assert
        assertNotNull(result);
        assertEquals(user, result.getUser());
        assertNotNull(result.getToken());
        assertFalse(result.isRevoked());
        assertNotNull(result.getExpiresAt());

        ArgumentCaptor<RefreshToken> savedCaptor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository, times(2)).save(savedCaptor.capture());
        List<RefreshToken> saved = savedCaptor.getAllValues();
        RefreshToken savedOld = saved.get(0);
        RefreshToken savedNew = saved.get(1);

        assertTrue(savedOld.isRevoked());
        assertNotNull(savedOld.getReplacedByToken());
        assertEquals(savedNew.getToken(), savedOld.getReplacedByToken());

        verify(refreshTokenRepository, times(1)).findByToken("old-token");
    }

    @Test
    void validateAndRotate_withExpiredToken_throwsBadRequestException() {
        // 1. Arrange
        User user = TestDataBuilder.createValidUser();
        RefreshToken expired = new RefreshToken();
        expired.setId(1L);
        expired.setUser(user);
        expired.setToken("expired-token");
        expired.setExpiresAt(LocalDateTime.now().minusSeconds(1));
        expired.setRevoked(false);

        when(refreshTokenRepository.findByToken("expired-token")).thenReturn(Optional.of(expired));

        // 2. Act & 3. Assert
        assertThrows(BadRequestException.class, () -> refreshTokenService.validateAndRotate("expired-token"));

        verify(refreshTokenRepository, times(1)).findByToken("expired-token");
        verify(refreshTokenRepository, never()).save(any(RefreshToken.class));
        verifyNoMoreInteractions(refreshTokenRepository);
    }
}


