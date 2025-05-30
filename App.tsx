// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from './src/screens/HomeScreen';
// import DetailsScreen from './src/screens/DetailsScreen';

// export type RootStackParamList = {
//   Home: undefined;
//   Details: undefined;
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="Details" component={DetailsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import TabNavigator from './src/navigation/TabNavigator';

// export type RootStackParamList = {
//   Home: undefined;
//   Profile: undefined;
//   Settings: undefined;
// };

// export default function App() {
//   return (
//     <NavigationContainer>
//       <TabNavigator />
//     </NavigationContainer>
//   );
// }
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './src/navigation/TabNavigator';
import TasbeehCounter from './src/screens/TasbeehCounter'; // Adjust path if needed
import Qibla from './src/screens/Qibla';
import SalahTimes from './src/screens/SalahTimes';
import HajjUmrah from './src/screens/HajjUmrah';
import LiveStreaming from './src/screens/LiveStreaming';
import Quran from './src/screens/Quran';
import HomeScreen from './src/screens/HomeScreen';
export type RootStackParamList = {
  Tabs: undefined;
  Qibla: undefined;
  SalahTimes: undefined;
  HajjUmrah: undefined;
  LiveStreaming: undefined;
  Quran: undefined;
  TasbeehCounter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
     
        <Stack.Screen name="Tabs" component={TabNavigator} />
           <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Qibla" component={Qibla} />
        <Stack.Screen name="SalahTimes" component={SalahTimes} />
        <Stack.Screen name="HajjUmrah" component={HajjUmrah} />
        <Stack.Screen name="LiveStreaming" component={LiveStreaming} />
        <Stack.Screen name="Quran" component={Quran} />
        <Stack.Screen name="TasbeehCounter" component={TasbeehCounter} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
