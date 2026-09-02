import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './src/navigation/navigationRef';
import { UserProvider } from './src/Context/Auth';
import { ChatProvider } from './src/Context/chatContext';
import { SocketProvider } from './src/Context/socketContext';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CreateGroupScreen from './src/screens/CreateGroupScreen';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
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
              </Stack.Navigator>
            </NavigationContainer>
          </SocketProvider>
        </ChatProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
};

export default App;