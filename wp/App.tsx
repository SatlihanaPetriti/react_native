import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './src/navigation/navigationRef';
import { UserProvider } from './src/Context/Auth';
import LoginScreen from './src/screens/LoginScreen';
import { ChatProvider } from './src/Context/chatContext';
import { SocketProvider } from './src/Context/socketContext';
import ChatScreen from './src/screens/ChatScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <ChatProvider>
        <SocketProvider>
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
                name="Welcome"
                component={WelcomeScreen}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SocketProvider>
      </ChatProvider>
    </UserProvider>
  );
};

export default App;