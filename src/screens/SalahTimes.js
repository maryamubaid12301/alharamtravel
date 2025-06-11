// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, FlatList, Dimensions, ImageBackground, StatusBar, Vibration, Platform, Alert, PermissionsAndroid, ToastAndroid, Linking } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Header from '../components/Header';

// const { width } = Dimensions.get('window');

// // Simple vibration pattern that works reliably on Android
// const VIBRATION_PATTERN = [0, 1000, 500, 1000, 500, 1000];

// // Strong vibration pattern
// const STRONG_VIBRATION = [
//   0,     // Start immediately
//   2000,  // Vibrate for 2 seconds
//   1000,  // Pause for 1 second
//   2000,  // Vibrate for 2 seconds
//   1000,  // Pause for 1 second
//   2000   // Final vibration
// ];

// // Clock style vibration pattern (like an alarm clock)
// const CLOCK_VIBRATION = [
//   0,      // Start immediately
//   500,    // Vibrate
//   200,    // Pause
//   500,    // Vibrate
//   200,    // Pause
//   500,    // Vibrate
//   1000    // Longer pause before repeating
// ];

// export default function SalahTimes() {
//   const navigation = useNavigation();
//   const [masterSwitch, setMasterSwitch] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [isVibrating, setIsVibrating] = useState(false);
//   const [vibrationInterval, setVibrationInterval] = useState(null);
//   const [location, setLocation] = useState({ latitude: null, longitude: null });
//   const [locationName, setLocationName] = useState('Loading...');
//   const [lastAlertTimes, setLastAlertTimes] = useState({});
//   const [isAlertShowing, setIsAlertShowing] = useState(false);
//   const alertTimeoutRef = useRef(null);
//   const lastAlertTimeRef = useRef({});
//   const [currentPrayer, setCurrentPrayer] = useState(null);

//   const namazList = [
//     { id: '1', name: 'Fajr', time: '09:30 AM' },
//     { id: '2', name: 'Dhuhr', time: '12:07 PM' },
//     { id: '3', name: 'Asr', time: '05:39 PM' },
//     { id: '4', name: 'Maghrib', time: '02:36 PM' },
//     { id: '5', name: 'Isha', time: '05:45 PM' },
//   ];
//   const [switchStates, setSwitchStates] = useState(
//     namazList.reduce((acc, item) => {
//       acc[item.id] = true;
//       return acc;
//     }, {})
//   );
//   const testVibrationPattern = () => {
//     Vibration.cancel();
//     Vibration.vibrate(CLOCK_VIBRATION, true);
//     setTimeout(() => {
//       Vibration.cancel();
//     }, 10000);
//   };
//   // Request location permission
//   const requestLocationPermission = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'Prayer Times needs access to your location to show accurate prayer times.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       }
//       return true;
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   };

//   // Get current location
//   const getCurrentLocation = async () => {
//     try {
//       const hasPermission = await requestLocationPermission();
//       if (!hasPermission) {
//         setLocationName('Location permission denied');
//         return;
//       }

//       // Using the built-in Geolocation API
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ latitude, longitude });
          
//           // Reverse geocoding using a free API
//           try {
//             const response = await fetch(
//               `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
//             );
//             const data = await response.json();
//             setLocationName(data.address.city || data.address.town || data.address.state || 'Unknown');
//           } catch (error) {
//             console.error('Error getting location name:', error);
//             setLocationName('Location error');
//           }
//         },
//         (error) => {
//           console.error('Location error:', error);
//           setLocationName('Location error');
//         },
//         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//       );
//     } catch (error) {
//       console.error('Location permission error:', error);
//       setLocationName('Location error');
//     }
//   };

//   // Initialize location on component mount
//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   // Convert 12-hour format to 24-hour format
//   const convertTo24Hour = (timeStr) => {
//     const [time, meridian] = timeStr.split(' ');
//     const [hours, minutes] = time.split(':');
//     let hour = parseInt(hours);
    
//     if (meridian === 'PM' && hour !== 12) hour += 12;
//     if (meridian === 'AM' && hour === 12) hour = 0;
    
//     return { hour, minutes: parseInt(minutes) };
//   };

//   // Check if app has notification permission
//   const checkNotificationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         // Define permissions based on Android version
//         const permissions = [];
        
//         // Add VIBRATE permission
//         if (PermissionsAndroid.PERMISSIONS.VIBRATE) {
//           permissions.push(PermissionsAndroid.PERMISSIONS.VIBRATE);
//         }
        
//         // Add POST_NOTIFICATIONS permission for Android 13+ (API level 33+)
//         if (Platform.Version >= 33 && PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
//           permissions.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
//         }

//         // If no permissions needed, return true
//         if (permissions.length === 0) {
//           return true;
//         }

//         // Request permissions one by one to avoid null permission errors
//         for (const permission of permissions) {
//           try {
//             const granted = await PermissionsAndroid.request(permission, {
//               title: 'Prayer Times Permission',
//               message: 'Prayer Times needs permission for alerts and vibration.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             });

//             if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//               console.log('Permission denied:', permission);
//               showSettingsDialog();
//               return false;
//             }
//           } catch (permError) {
//             console.log('Error requesting permission:', permission, permError);
//           }
//         }

//         return true;
//       } catch (err) {
//         console.log('Permission check failed:', err);
//         // If permission check fails, we'll try to continue without permissions
//         return true;
//       }
//     }
//     return true;
//   };

//   // Function to open app settings
//   const openAppSettings = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         await Linking.openSettings();
//         ToastAndroid.show('Please enable required permissions', ToastAndroid.LONG);
//       }
//     } catch (err) {
//       console.log('Could not open settings:', err);
//       // If we can't open settings, show manual instructions
//       Alert.alert(
//         'Unable to Open Settings',
//         'Please manually enable notifications and vibration permissions in your phone settings:\n\n' +
//         '1. Go to Phone Settings\n' +
//         '2. Find "Apps" or "Applications"\n' +
//         '3. Find "Prayer Times"\n' +
//         '4. Enable all permissions',
//         [{ text: 'OK' }]
//       );
//     }
//   };

//   // Show settings dialog
//   const showSettingsDialog = () => {
//     Alert.alert(
//       'Permissions Required',
//       'Please enable required permissions from settings to receive prayer time alerts.',
//       [
//         {
//           text: 'Open Settings',
//           onPress: openAppSettings
//         },
//         {
//           text: 'Continue Without Permissions',
//           onPress: () => {
//             ToastAndroid.show('Some features may not work without permissions', ToastAndroid.LONG);
//           }
//         }
//       ],
//       { cancelable: false }
//     );
//   };

//   // Function to show prayer alert
//   const showPrayerAlert = (prayerName) => {
//   if (isAlertShowing) return;

//   setIsAlertShowing(true);
//   setCurrentPrayer(prayerName);

//   // Show the alert FIRST, then vibrate in the alert handlers
//   Alert.alert(
//     `Time for ${prayerName} Prayer`,
//     'Prayer time alert',
//     [
//       {
//         text: 'Stop',
//         onPress: () => {
//           Vibration.cancel();
//           setIsVibrating(false);
//           setIsAlertShowing(false);
//           setCurrentPrayer(null);

//           setLastAlertTimes(prev => ({
//             ...prev,
//             [prayerName]: new Date().getTime()
//           }));
//         },
//         style: 'cancel'
//       },
//       {
//         text: 'Snooze (5 min)',
//         onPress: () => {
//           Vibration.cancel();
//           setIsVibrating(false);
//           setIsAlertShowing(false);
//           setCurrentPrayer(null);

//           if (alertTimeoutRef.current) {
//             clearTimeout(alertTimeoutRef.current);
//           }

//           alertTimeoutRef.current = setTimeout(() => {
//             startVibration(prayerName);
//           }, 5 * 60 * 1000);

//           ToastAndroid.show('Alert snoozed for 5 minutes', ToastAndroid.SHORT);
//         }
//       }
//     ],
//     {
//       cancelable: true,
//       onDismiss: () => {
//         Vibration.cancel();
//         setIsVibrating(false);
//         setIsAlertShowing(false);
//         setCurrentPrayer(null);
//       }
//     }
//   );

//   // ⏱ Start vibration immediately AFTER the alert is triggered
//   Vibration.cancel();
//   Vibration.vibrate(CLOCK_VIBRATION, true);
//   setIsVibrating(true);

//   // Optional: Auto-cancel after 5 minutes
//   setTimeout(() => {
//     if (isVibrating) {
//       Vibration.cancel();
//       setIsVibrating(false);
//       setIsAlertShowing(false);
//       setCurrentPrayer(null);
//       ToastAndroid.show('Alert auto-stopped after 5 minutes', ToastAndroid.SHORT);
//     }
//   }, 5 * 60 * 1000);
// };

  
  
//   // Function to start vibration and alert
//   const startVibration = async (prayerName) => {
//     if (isAlertShowing) return;

//     try {
//       showPrayerAlert(prayerName);

//       // Safety timeout - stop after 5 minutes if not stopped manually
//       setTimeout(() => {
//         if (isVibrating) {
//           Vibration.cancel();
//           setIsVibrating(false);
//           setIsAlertShowing(false);
//           setCurrentPrayer(null);
//           ToastAndroid.show('Alert auto-stopped after 5 minutes', ToastAndroid.SHORT);
//         }
//       }, 300000);
//     } catch (error) {
//       console.log('Vibration error:', error);
//       Vibration.cancel();
//       setIsVibrating(false);
//       setIsAlertShowing(false);
//       setCurrentPrayer(null);
//     }
//   };

//   // Check prayer times
//   const checkPrayerTimes = () => {
//     if (!masterSwitch) return;

//     const now = new Date();
//     const currentHour = now.getHours();
//     const currentMinute = now.getMinutes();

//     namazList.forEach(prayer => {
//       if (!switchStates[prayer.id]) return;

//       const { hour: prayerHour, minutes: prayerMinute } = convertTo24Hour(prayer.time);
      
//       if (currentHour === prayerHour && currentMinute === prayerMinute) {
//         const lastAlertTime = lastAlertTimes[prayer.name] || 0;
//         const timeSinceLastAlert = now.getTime() - lastAlertTime;
        
//         // Only show alert if we haven't shown one in the last minute
//         // This prevents multiple alerts for the same prayer
//         if (timeSinceLastAlert > 60000 && !isAlertShowing) {
//           startVibration(prayer.name);
//         }
//       }
//     });
//   };

//   // Test vibration function
//   const testVibration = () => {
//     if (isVibrating) {
//       Vibration.cancel();
//       setIsVibrating(false);
//       return;
//     }

//     try {
//       setIsVibrating(true);
//       Vibration.cancel();
//       Vibration.vibrate(VIBRATION_PATTERN, true);

//       setTimeout(() => {
//         Vibration.cancel();
//         setIsVibrating(false);
//         Alert.alert(
//           'Vibration Test',
//           'Did you feel the vibration?',
//           [
//             {
//               text: 'Yes',
//               onPress: () => ToastAndroid.show('Vibration is working!', ToastAndroid.SHORT)
//             },
//             {
//               text: 'No',
//               onPress: () => {
//                 Alert.alert(
//                   'Troubleshooting',
//                   'Please check:\n\n' +
//                   '1. Make sure vibration is enabled in system settings\n' +
//                   '2. Turn off battery saver mode\n' +
//                   '3. Try restarting your phone\n' +
//                   '4. Check if vibration works in other apps',
//                   [
//                     {
//                       text: 'Open Settings',
//                       onPress: () => {
//                         Linking.openSettings();
//                       }
//                     },
//                     { text: 'OK' }
//                   ]
//                 );
//               }
//             }
//           ]
//         );
//       }, 5000);
//     } catch (error) {
//       console.log('Test vibration error:', error);
//       Alert.alert('Error', 'Failed to start vibration. Please check your device settings.');
//     }
//   };

//   // Toggle master switch
//   const toggleMasterSwitch = () => {
//     const newState = !masterSwitch;
//     setMasterSwitch(newState);
//     if (!newState) {
//       Vibration.cancel();
//     }
//   };

//   // Toggle individual prayer switches
//   const toggleSwitch = (id) => {
//     setSwitchStates(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };

//   // Format time for display
//   const formatTime = (date) => {
//     return date.toLocaleTimeString('en-US', {
//       weekday: 'short',
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   // Timer to check prayer times
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//       checkPrayerTimes();
//     }, 1000);

//     return () => {
//       clearInterval(timer);
//       if (alertTimeoutRef.current) {
//         clearTimeout(alertTimeoutRef.current);
//       }
//       Vibration.cancel();
//       setIsAlertShowing(false);
//     };
//   }, [masterSwitch, switchStates, isVibrating]);

//   // Clean up function
//   const cleanup = () => {
//     if (alertTimeoutRef.current) {
//       clearTimeout(alertTimeoutRef.current);
//     }
//     Vibration.cancel();
//   };

//   // Clean up on unmount
//   useEffect(() => {
//     return cleanup;
//   }, []);

//   // Clean up when master switch is turned off
//   useEffect(() => {
//     if (!masterSwitch) {
//       cleanup();
//     }
//   }, [masterSwitch]);

//   return (
//     <>
//      <StatusBar backgroundColor="#00008B" barStyle="light-content" />
//     <View style={styles.container}>
//       {/* App Header */}
//       <Header
//        title="Salah Times"
//        onLeftPress={() => navigation.goBack()}
//        leftIcon={require('../assets/images/whitebackarrow.png')}
//        rightIcon={require('../assets/images/whitemesageicon.png')}
//        />
         
//     <ImageBackground
//       source={require('../assets/images/salahtimes.jpg')}
//       style={styles.backgroundImage}
//       resizeMode="cover"
//       >
//   <View style={styles.topRow}>
   
//     <TouchableOpacity 
//       onPress={testVibration}
//       style={[
//         styles.testButton,
//         isVibrating && styles.testButtonActive
//       ]}
//     >
//       <Image
//         source={require('../assets/images/setting.png')}
//         style={styles.settingsIcon}
//       />
//     </TouchableOpacity>
//      <Text style={styles.timeStyle}>{formatTime(currentTime)}</Text>
//   </View>
//   <View style={styles.bottomRow}>
//   <Image
//     source={require('../assets/images/location.png')}
//     style={styles.locationIcon}
//   />
//   <Text style={styles.locationText}>{locationName}</Text>
// </View>
// </ImageBackground>
//        <View style={styles.masterRow}>
//         <Text style={styles.masterLabel}>Turn on Alarms</Text>
//         <Switch 
//           value={masterSwitch} 
//           onValueChange={toggleMasterSwitch}
//         />
//       </View>
//       <FlatList
//         data={namazList}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//         <View style={styles.row}>
//   <View style={styles.leftRow}>
  
//     <Text style={styles.namazName}>{item.name}</Text>
//   </View>
//   <Text style={styles.namazTime}>{item.time}</Text>
//     <Switch
//       value={switchStates[item.id]}
//       onValueChange={() => toggleSwitch(item.id)}
//       disabled={!masterSwitch}
//     />
// </View>
//         )}
//         ItemSeparatorComponent={() => <View style={styles.separator} />}
//       />
//     </View>
//   </>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     backgroundColor: 'lightgray',
//   },
//  header: {
//   backgroundColor: '#0384cc',
//   width: '100%',
//   paddingVertical: 32,
//   paddingHorizontal: 12,
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   position: 'relative',
// },
// headerCenter: {
//   position: 'absolute',
//   left: 0,
//   right: 0,
//   alignItems: 'center',
// },
// headerText: {
//   color: '#fff',
//   fontSize: 20,
//   fontWeight: 'bold',
//      marginTop:10,
// },
// icon: {
//   width: 24,
//   height: 24,
//   resizeMode: 'contain',
//      marginTop:10,
// },
// Arrowicon:{
//  width: 35,
//   height: 35,
//   resizeMode: 'contain',
//      marginTop:10,
// },

//   backgroundImage: {
//   width: '100%',
//   height: 240,
//   paddingVertical:10

 
//   },
// salahView:{
//   flexDirection:"row"
// },
// topRow: {
//   width: '100%',
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   paddingHorizontal: 20,
// },

// timeStyle: {
//   color: 'white',
//   fontSize: 16,
//   fontWeight:"600"
// },
// settingsIcon: {
//   width: 24,
//   height: 24,
//   resizeMode: 'contain',
// },
// bottomRow: {
//   position: 'absolute',
//   bottom: 10,              // Pushes to bottom
//   right: 10,                // Aligns to left corner
//   flexDirection: 'row',
//   alignItems: 'center',
// },

// locationIcon: {
//   width: 20,
//   height: 20,
//   marginRight: 6,          // Space between icon and text
//   resizeMode: 'contain',
// },

// locationText: {
//   color: 'white',
//   fontSize: 14,
//   fontWeight: '600',
// },
// masterRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     alignItems: 'center',
//     paddingVertical:30,
//   },
//   masterLabel: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     position:'absolute',
//     right:36

//   },
// row: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   paddingVertical: 12,
//   paddingHorizontal: 20,
//   backgroundColor: 'white',
//   width: '95%',
//   alignSelf: 'center',
// },

//   separator: {
//     height: 1,
//     backgroundColor: '#eee',
//     marginVertical: 5,
//   },
// leftRow: {
//   width: 80, // Fixed width for name column
// },
// namazName: {
//   fontSize: 16,
//   fontWeight: '600',
//   color: '#000',
// },

// namazTime: {
//   fontSize: 14,
//   color: 'black',
//   width: 80, // Fixed width for time column to align it
//   textAlign: 'center',
// },
// switchStle:{
//   position:"absolute",
//   left:120
// },
// testButton: {
//   padding: 8,
//   borderRadius: 5,
// },
// testButtonActive: {
//   backgroundColor: 'rgba(255, 0, 0, 0.3)',
// },
// });
import React, { useState, useEffect, useRef } from 'react';
import {
  Vibration, View, Text, StyleSheet, Image, TouchableOpacity,
  Switch, FlatList, Dimensions, ImageBackground, StatusBar, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import notifee, { EventType, TriggerType, AndroidImportance } from '@notifee/react-native';

import Header from '../components/Header';

const { width } = Dimensions.get('window');

export default function SalahTimes() {
  const navigation = useNavigation();
  const LONG_VIBRATION_PATTERN = [0, 1000, 500, 1000, 500, 1000];
  const vibrationIntervalRef = useRef(null);
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);
  const [lastTriggered, setLastTriggered] = useState({});
  const [masterSwitch, setMasterSwitch] = useState(true);
  const [count, setCount] = useState(0);

  const namazList = [
    { id: '1', name: 'Fajr', time: '10:11 AM' },
    { id: '2', name: 'Dhuhr', time: '10:13 AM' },
    { id: '3', name: 'Asr', time: '04:15 PM' },
    { id: '4', name: 'Maghrib', time: '07:10 PM' },
    { id: '5', name: 'Isha', time: '08:45 PM' },
  ];

  const [switchStates, setSwitchStates] = useState(
    namazList.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {})
  );

  const enabledPrayers = namazList.filter(
    (prayer) => switchStates[prayer.id] && masterSwitch
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const today = now.toDateString();

      enabledPrayers.forEach(prayer => {
        const alarmTime24 = convertTo24Hour(prayer.time);
        if (
          alarmTime24 === currentTime &&
          (!lastTriggered[prayer.name] || lastTriggered[prayer.name] !== today)
        ) {
          triggerAlarm(prayer.name, today);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [enabledPrayers, lastTriggered]);

  const convertTo24Hour = (time12h) => {
    const [time, meridiem] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const triggerAlarm = (prayerName, today) => {
    setIsAlarmTriggered(true);
    setLastTriggered(prev => ({ ...prev, [prayerName]: today }));

    vibrationIntervalRef.current = setInterval(() => {
      Vibration.vibrate(1000);
    }, 1200);

    Alert.alert(
      'Prayer Time',
      `It's time to pray ${prayerName}!`,
      [
        {
          text: 'Stop',
          onPress: () => stopAlarm(),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const stopAlarm = () => {
    setIsAlarmTriggered(false);
    clearInterval(vibrationIntervalRef.current);
    Vibration.cancel();
  };

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === notifee.EventType.DELIVERED) {
        Vibration.vibrate(LONG_VIBRATION_PATTERN);
      }
    });
  }, []);

  const createNotificationChannel = async () => {
    return await notifee.createChannel({
      id: 'salah_reminder',
      name: 'Salah Reminders',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  };

  const schedulePrayerNotification = async (prayerName, prayerTime) => {
    try {
      const channelId = await createNotificationChannel();
      const [time, meridiem] = prayerTime.split(' ');
      const [hours, minutes] = time.split(':');
      const date = new Date();
      let hour = parseInt(hours);
      if (meridiem === 'PM' && hour !== 12) hour += 12;
      if (meridiem === 'AM' && hour === 12) hour = 0;
      date.setHours(hour, parseInt(minutes), 0);

      if (date < new Date()) {
        date.setDate(date.getDate() + 1);
      }

      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
        repeatFrequency: 'DAILY',
      };

      await notifee.createTriggerNotification(
        {
          title: `Time for ${prayerName}`,
          body: `It's time to pray ${prayerName}`,
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
            sound: 'default',
          },
        },
        trigger
      );
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };

  useEffect(() => {
    namazList.forEach((prayer) => {
      if (switchStates[prayer.id] && masterSwitch) {
        schedulePrayerNotification(prayer.name, prayer.time);
      }
    });
  }, [switchStates, masterSwitch]);

  const toggleMasterSwitch = () => {
    const newState = !masterSwitch;
    setMasterSwitch(newState);
    const updatedSwitches = {};
    namazList.forEach((item) => {
      updatedSwitches[item.id] = newState;
    });
    setSwitchStates(updatedSwitches);
  };

  const toggleSwitch = (id) => {
    setSwitchStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <StatusBar backgroundColor="#00008B" barStyle="light-content" />
      <View style={styles.container}>
        <Header
          title="Salah Times"
          onLeftPress={() => navigation.goBack()}
          leftIcon={require('../assets/images/whitebackarrow.png')}
          rightIcon={require('../assets/images/whitemesageicon.png')}
        />

        <ImageBackground
          source={require('../assets/images/salahtimes.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => console.log('Settings Pressed')}>
              <Image
                source={require('../assets/images/setting.png')}
                style={styles.settingsIcon}
              />
            </TouchableOpacity>
            <Text style={styles.timeStyle}>Fri, 30 May 2025 12:54 PM</Text>
          </View>

          <View style={styles.bottomRow}>
            <Image
              source={require('../assets/images/location.png')}
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>Lahore</Text>
          </View>
        </ImageBackground>

        <View style={styles.masterRow}>
          <Text style={styles.masterLabel}>Turn on Alarms</Text>
          <Switch value={masterSwitch} onValueChange={toggleMasterSwitch} style={styles.switchStle} />
        </View>

        <FlatList
          data={namazList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.leftRow}>
                <Text style={styles.namazName}>{item.name}</Text>
              </View>
              <Text style={styles.namazTime}>{item.time}</Text>
              <Switch
                value={switchStates[item.id]}
                onValueChange={() => toggleSwitch(item.id)}
              />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
 header: {
  backgroundColor: '#0384cc',
  width: '100%',
  paddingVertical: 32,
  paddingHorizontal: 12,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
},
headerCenter: {
  position: 'absolute',
  left: 0,
  right: 0,
  alignItems: 'center',
},
headerText: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
     marginTop:10,
},
icon: {
  width: 24,
  height: 24,
  resizeMode: 'contain',
     marginTop:10,
},
Arrowicon:{
 width: 35,
  height: 35,
  resizeMode: 'contain',
     marginTop:10,
},

  backgroundImage: {
  width: '100%',
  height: 240,
  paddingVertical:10

 
  },
salahView:{
  flexDirection:"row"
},
topRow: {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
},

timeStyle: {
  color: 'white',
  fontSize: 16,
  fontWeight:"600"
},
settingsIcon: {
  width: 24,
  height: 24,
  resizeMode: 'contain',
},
bottomRow: {
  position: 'absolute',
  bottom: 10,              // Pushes to bottom
  right: 10,                // Aligns to left corner
  flexDirection: 'row',
  alignItems: 'center',
},

locationIcon: {
  width: 20,
  height: 20,
  marginRight: 6,          // Space between icon and text
  resizeMode: 'contain',
},

locationText: {
  color: 'white',
  fontSize: 14,
  fontWeight: '600',
},
masterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical:30,
  },
  masterLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    position:'absolute',
    right:36

  },
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 20,
  backgroundColor: 'white',
  width: '95%',
  alignSelf: 'center',
},

  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 5,
  },
leftRow: {
  width: 80, // Fixed width for name column
},
namazName: {
  fontSize: 16,
  fontWeight: '600',
  color: '#000',
},

namazTime: {
  fontSize: 14,
  color: 'black',
  width: 80, // Fixed width for time column to align it
  textAlign: 'center',
},
switchStle:{
  position:"absolute",
  left:120
}
});
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Alert, Vibration, StyleSheet } from 'react-native';

// const ALARM_TIME = '10:02'; // Set your desired alarm time in HH:mm format
// let vibrationInterval;

// export default function AlarmComponent() {
//   const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);
//   const [lastTriggeredDate, setLastTriggeredDate] = useState(null);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = new Date();
//       const currentTime = now.toTimeString().slice(0, 5); // "HH:mm"
//       const today = now.toDateString(); // "Wed Jun 11 2025"

//       // Only trigger if:
//       // - time matches
//       // - it's not triggered already for today
//       if (
//         currentTime === ALARM_TIME &&
//         !isAlarmTriggered &&
//         lastTriggeredDate !== today
//       ) {
//         triggerAlarm(today);
//       }
//     }, 1000); // Check every second

//     return () => clearInterval(interval);
//   }, [isAlarmTriggered, lastTriggeredDate]);

//   const triggerAlarm = (today) => {
//     setIsAlarmTriggered(true);
//     setLastTriggeredDate(today); // Track today's trigger

//     // Start long vibration
//     vibrationInterval = setInterval(() => {
//       Vibration.vibrate(1000);
//     }, 1200);

//     // Show alert
//     Alert.alert(
//       'Alarm!',
//       'It is time to pray!',
//       [
//         {
//           text: 'Stop',
//           onPress: stopAlarm,
//           style: 'destructive',
//         },
//       ],
//       { cancelable: false }
//     );
//   };

//   const stopAlarm = () => {
//     setIsAlarmTriggered(false);
//     clearInterval(vibrationInterval);
//     Vibration.cancel();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Alarm set for {ALARM_TIME}</Text>
//       <Button title="Stop Alarm Manually" onPress={stopAlarm} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, justifyContent: 'center', alignItems: 'center',
//   },
//   text: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
// });
