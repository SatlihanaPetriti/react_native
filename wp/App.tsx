import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './src/navigation/navigationRef';
import { UserProvider, useUserContext } from './src/Context/Auth';
import { ChatProvider } from './src/Context/chatContext';
import { SocketProvider } from './src/Context/socketContext';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CreateGroupScreen from './src/screens/CreateGroupScreen';
import NewChatScreen from './src/screens/NewChatScreen';
import { colors } from './src/screens/theme';
const Stack = createNativeStackNavigator();

// Pret derisa te kontrollohet nese ka session te ruajtur ne AsyncStorage
const RootNavigator = () => {
  const { loading } = useUserContext();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
        />

        <Stack.Screen
          name="Chat"
          component={ChatScreen}
        />
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroupScreen}
        />
        <Stack.Screen
          name="NewChat"
          component={NewChatScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <ChatProvider>
          <SocketProvider>
            <RootNavigator />
          </SocketProvider>
        </ChatProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
