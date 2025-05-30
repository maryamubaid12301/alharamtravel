import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/Messages';
import ProfileScreen from '../screens/ProfileScreen';
import SocialScreen from '../screens/SocialScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: ({ focused }) => {
          let iconSource;

         if (route.name === 'Home') {
            iconSource = focused
              ? require('../assets/images/homeorange.png')
              : require('../assets/images/homewhite.png');
          } else if (route.name === 'Messages') {
            iconSource = focused
              ? require('../assets/images/orangemesage.png')
              : require('../assets/images/whitemesage.png');
          } else if (route.name === 'Social') {
            iconSource = focused
              ? require('../assets/images/socialorange.png')
              : require('../assets/images/socialwhite.png');
          } else if (route.name === 'Profile') {
            iconSource = focused
              ? require('../assets/images/profileorange.png')
              : require('../assets/images/profilewhite.png');
          }

          return (
            <Image
              source={iconSource}
              style={styles.tabIcon}
              resizeMode="contain"
            />
          );
        },
      })}
    >
    <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },
});
