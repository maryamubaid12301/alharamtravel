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
          backgroundColor: 'gray',
          position: 'absolute',
          bottom: 0,
          left: 10,
          right: 10,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          height: 50,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarBackground: () => (
  <View style={{ flex: 1, backgroundColor: 'lightgray', borderRadius: 0 }} />
),

        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = focused
              ? require('../assets/images/homeorange.png')
              : require('../assets/images/homegray.png');
          } else if (route.name === 'Messages') {
            iconSource = focused
              ? require('../assets/images/messageorange.png')
              : require('../assets/images/messagegray.png');
          } else if (route.name === 'Social') {
            iconSource = focused
              ? require('../assets/images/socialyellow.png')
              : require('../assets/images/socialgray.png');
          } else if (route.name === 'Profile') {
            iconSource = focused
              ? require('../assets/images/profileorange.png')
              : require('../assets/images/profilegray.png');
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
