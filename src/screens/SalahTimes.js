import React, { useState, useEffect, useRef } from 'react';
import {
  Vibration, View, Text, StyleSheet, Image, TouchableOpacity,
  Switch, FlatList, Dimensions, ImageBackground, StatusBar, Modal,
  Animated, PanResponder, Platform, AppState
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SlideButton from 'rn-slide-button';
import notifee, { EventType, TriggerType, AndroidImportance } from '@notifee/react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { FONTS, SIZES, COLORS } from '../theme/fonts';
const { width } = Dimensions.get('window');
const LONG_VIBRATION_PATTERN = [0, 1000, 500, 1000, 500, 1000];

export default function SalahTimes() {
  const navigation = useNavigation();
  const vibrationIntervalRef = useRef(null);
  const [isAlarmTriggered, setIsAlarmTriggered] = useState(false);
  const [lastTriggered, setLastTriggered] = useState({});
  const [masterSwitch, setMasterSwitch] = useState(true);
  const [count, setCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPrayer, setCurrentPrayer] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [tempTime, setTempTime] = useState(new Date());

  const [namazList, setNamazList] = useState([
    { id: '1', name: 'Fajr', time: '10:11 AM', dateObj: new Date() },
    { id: '2', name: 'Dhuhr', time: '10:13 AM', dateObj: new Date() },
    { id: '3', name: 'Asr', time: '04:15 PM', dateObj: new Date() },
    { id: '4', name: 'Maghrib', time: '04:19 PM', dateObj: new Date() },
    { id: '5', name: 'Isha', time: '05:22 PM', dateObj: new Date() },
  ]);

  // Load saved prayer times when component mounts
  useEffect(() => {
    loadSavedPrayerTimes();
  }, []);

  // Save prayer times whenever they change
  useEffect(() => {
    savePrayerTimes();
  }, [namazList]);

  const loadSavedPrayerTimes = async () => {
    try {
      const savedTimes = await AsyncStorage.getItem('prayerTimes');
      if (savedTimes) {
        const parsedTimes = JSON.parse(savedTimes);
        // Convert string dates back to Date objects
        const updatedTimes = parsedTimes.map(prayer => ({
          ...prayer,
          dateObj: new Date(prayer.dateObj)
        }));
        setNamazList(updatedTimes);
      }
    } catch (error) {
      console.error('Error loading prayer times:', error);
    }
  };

  const savePrayerTimes = async () => {
    try {
      await AsyncStorage.setItem('prayerTimes', JSON.stringify(namazList));
    } catch (error) {
      console.error('Error saving prayer times:', error);
    }
  };
  // Initialize prayer times as Date objects
  useEffect(() => {
    const updatedList = namazList.map(prayer => {
      const [time, meridiem] = prayer.time.split(' ');
      const [hours, minutes] = time.split(':');
      const dateObj = new Date();
      let hour = parseInt(hours);
      
      if (meridiem === 'PM' && hour !== 12) {
        hour += 12;
      } else if (meridiem === 'AM' && hour === 12) {
        hour = 0;
      }
      
      dateObj.setHours(hour);
      dateObj.setMinutes(parseInt(minutes));
      return { ...prayer, dateObj };
    });
    setNamazList(updatedList);
  }, []);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.max(0, Math.min(width * 0.7, gestureState.dx));
        slideAnim.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsDragging(false);
        if (gestureState.dx >= width * 0.5) {
          Animated.timing(slideAnim, {
            toValue: width * 0.7,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            stopAlarm();
          });
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

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

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    
    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${meridiem}`;
  };

  const handleTimePress = (prayer) => {
    setSelectedPrayer(prayer);
    setTempTime(prayer.dateObj);
    setShowTimePicker(true);
  };

  const handleTimeChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (selectedDate && selectedPrayer) {
      const updatedList = namazList.map(prayer => {
        if (prayer.id === selectedPrayer.id) {
          return {
            ...prayer,
            time: formatTime(selectedDate),
            dateObj: selectedDate
          };
        }
        return prayer;
      });
      setNamazList(updatedList);
      // Schedule new notifications after time change
      if (masterSwitch) {
        scheduleNotifications();
      }
    }
  };

  const triggerAlarm = (prayerName, today) => {
    setIsAlarmTriggered(true);
    setCurrentPrayer(prayerName);
    setLastTriggered(prev => ({ ...prev, [prayerName]: today }));
    setIsModalVisible(true);

    // Start vibration pattern
    Vibration.vibrate(LONG_VIBRATION_PATTERN, true);
  };

  const stopAlarm = () => {
    setIsAlarmTriggered(false);
    setIsModalVisible(false);
    Vibration.cancel();
  };

  const toggleMasterSwitch = () => {
    const newState = !masterSwitch;
    setMasterSwitch(newState);
    const updatedSwitches = {};
    namazList.forEach((item) => {
      updatedSwitches[item.id] = newState;
    });
    setSwitchStates(updatedSwitches);
    
    // Cancel or schedule notifications based on master switch
    if (newState) {
      scheduleNotifications();
    } else {
      notifee.cancelAllNotifications();
    }
  };

  const toggleSwitch = (id) => {
    const newSwitchStates = { ...switchStates, [id]: !switchStates[id] };
    setSwitchStates(newSwitchStates);
    
    // Update notifications when individual prayer switch is toggled
    if (masterSwitch) {
      scheduleNotifications();
    }
  };

  // Handle notification events
  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        // When notification is pressed, navigate to SalahTimes screen
        navigation.navigate('SalahTimes');
      }
    });

    // Handle background events
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.TRIGGER_NOTIFICATION_CREATED) {
        // Start vibration when notification is triggered
        Vibration.vibrate(LONG_VIBRATION_PATTERN, true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Schedule notifications for all enabled prayers
  const scheduleNotifications = async () => {
    // Cancel all existing notifications first
    await notifee.cancelAllNotifications();

    const now = new Date();
    enabledPrayers.forEach(async (prayer) => {
      const [time, meridiem] = prayer.time.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      
      if (meridiem === 'PM' && hour !== 12) {
        hour += 12;
      } else if (meridiem === 'AM' && hour === 12) {
        hour = 0;
      }

      const triggerDate = new Date();
      triggerDate.setHours(hour);
      triggerDate.setMinutes(parseInt(minutes));
      triggerDate.setSeconds(0);

      // If the time has already passed today, schedule for tomorrow
      if (triggerDate <= now) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }

      await notifee.createTriggerNotification(
        {
          title: 'Prayer Time',
          body: `It's time for ${prayer.name} prayer`,
          android: {
            channelId: 'prayer-times',
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
            },
            vibration: true,
            vibrationPattern: LONG_VIBRATION_PATTERN,
          },
          ios: {
            sound: 'default',
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: triggerDate.getTime(),
          repeatFrequency: TriggerType.DAILY,
        }
      );
    });
  };

  // Create notification channel for Android
  const createNotificationChannel = async () => {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'prayer-times',
        name: 'Prayer Times',
        importance: AndroidImportance.HIGH,
        vibration: true,
        vibrationPattern: LONG_VIBRATION_PATTERN,
        sound: 'default',
      });
    }
  };

  // Update notifications when prayer times or switch states change
  useEffect(() => {
    if (masterSwitch) {
      scheduleNotifications();
    } else {
      notifee.cancelAllNotifications();
    }
  }, [namazList, switchStates, masterSwitch]);

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
              <TouchableOpacity onPress={() => handleTimePress(item)}>
                <Text style={[styles.namazTime, { color: '#0384cc' }]}>{item.time}</Text>
              </TouchableOpacity>
              <Switch
                value={switchStates[item.id]}
                onValueChange={() => toggleSwitch(item.id)}
              />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        {showTimePicker && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Prayer Time</Text>
              <Text style={styles.modalText}>It's time to pray {currentPrayer}!</Text>
              
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <Text style={[
                    styles.sliderText,
                    isDragging && styles.sliderTextActive
                  ]}>
                    {isDragging ? "Release to dismiss..." : "← Slide to dismiss"}
                  </Text>
                  <Animated.View
                    style={[
                      styles.sliderThumb,
                      {
                        transform: [{ translateX: slideAnim }],
                      },
                    ]}
                    {...panResponder.panHandlers}
                  >
                    <Image source={require('../assets/images/whiteforward.png')} style={{width:20,height:20}} />
                  </Animated.View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
    backgroundColor: COLORS.primary,
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
    color: COLORS.background,
    fontSize: SIZES.xxLarge,
    fontFamily: FONTS.bold,
    marginTop: 10,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginTop: 10,
  },
  Arrowicon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    marginTop: 10,
  },
  backgroundImage: {
    width: '100%',
    height: 240,
    paddingVertical: 10,
  },
  salahView: {
    flexDirection: "row"
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  timeStyle: {
    color: COLORS.background,
    // fontSize: SIZES.large,
    // fontFamily: FONTS.style,


    fontSize: SIZES.medium,
    // textAlign: 'center',
    // color: COLORS.text,
    fontFamily: FONTS.style,
  },
  settingsIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  bottomRow: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
    resizeMode: 'contain',
  },
  locationText: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    fontFamily: FONTS.style,
  },
  masterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical: 30,
  },
  masterLabel: {
    fontSize: SIZES.xxLarge,
    fontFamily: FONTS.style,
    position: 'absolute',
    right: 36,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    width: '95%',
    alignSelf: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 5,
  },
  leftRow: {
    width: 80,
  },
  namazName: {
    fontSize: SIZES.large,
    fontFamily: FONTS.style,
    color: COLORS.text,
  },
  namazTime: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.regular,
    width: 80,
    textAlign: 'center',
  },
  switchStle: {
    position: "absolute",
    left: 120,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: SIZES.xxxLarge,
    fontFamily: FONTS.bold,
    marginBottom: 10,
    color: COLORS.primary,
  },
  modalText: {
    fontSize: SIZES.xLarge,
    fontFamily: FONTS.medium,
    marginBottom: 20,
    textAlign: 'center',
  },
  sliderContainer: {
    width: '100%',
    marginTop: 10,
  },
  sliderTrack: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.lightGray,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  sliderText: {
    color: COLORS.textLight,
    fontSize: SIZES.large,
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  sliderTextActive: {
    color: COLORS.primary,
  },
  sliderThumb: {
    position: 'absolute',
    left: 0,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
