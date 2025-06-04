
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './src/navigation/TabNavigator';
import TasbeehCounter from './src/screens/TasbeehCounter';
import Qibla from './src/screens/Qibla';
import SalahTimes from './src/screens/SalahTimes';
import HajjUmrah from './src/screens/HajjUmrah';
import LiveStreaming from './src/screens/LiveStreaming';
import Quran from './src/screens/Quran';
import HomeScreen from './src/screens/HomeScreen';
import WebViewScreen from './src/screens/WebViewScreen';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="Qibla" component={Qibla} />
        <Stack.Screen name="SalahTimes" component={SalahTimes} />
        <Stack.Screen name="HajjUmrah" component={HajjUmrah} />
        <Stack.Screen name="LiveStreaming" component={LiveStreaming} />
        <Stack.Screen name="Quran" component={Quran} />
        <Stack.Screen name="TasbeehCounter" component={TasbeehCounter} />
        <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
