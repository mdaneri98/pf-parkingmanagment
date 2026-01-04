/**
 * Root Navigator
 * Main navigation container that switches between Auth and Main stacks
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '@hooks/useRedux';
import { selectIsAuthenticated } from '@features/auth/slice';
import type { RootStackParamList } from './types';

// Navigators
import AuthNavigator from './AuthNavigator';
// import MainNavigator from './MainNavigator'; // To be created

// ============================================================================
// Stack Navigator
// ============================================================================

const Stack = createNativeStackNavigator<RootStackParamList>();

// ============================================================================
// Temporary Main Screen (placeholder)
// ============================================================================

import { View, Text, Button, StyleSheet } from 'react-native';
import { useAppDispatch } from '@hooks/useRedux';
import { logoutUser } from '@features/auth/slice';

function TemporaryMainScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Parking Management!</Text>
      <Text style={styles.subtitle}>
        Logged in as: {user?.firstName} {user?.lastName}
      </Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

// ============================================================================
// Root Navigator Component
// ============================================================================

export function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={TemporaryMainScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
