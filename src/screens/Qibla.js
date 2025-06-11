import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import CompassHeading from 'react-native-compass-heading';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

const KAABA_COORDS = {
  latitude: 21.4225,
  longitude: 39.8262,
};

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.6;

export default function Qibla() {
  const navigation = useNavigation();
  const [compassHeading, setCompassHeading] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationFound, setLocationFound] = useState(false);
  const [compassReady, setCompassReady] = useState(false);

  useEffect(() => {
    let compassSubscription = null;
    let locationWatchId = null;

    const setupCompass = () => {
      // Start compass updates with higher frequency
      CompassHeading.start(1, ({ heading }) => {
        // Normalize the heading to 0-360 range
        const normalizedHeading = (heading + 360) % 360;
        setCompassHeading(normalizedHeading);
        setCompassReady(true);
      });
    };
    
    const getLocation = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "This app needs access to your location to show Qibla direction",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Error', 'Location permission denied');
            setLoading(false);
            return;
          }
        }

        // Get initial position
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const qiblaAngle = calculateQiblaDirection(latitude, longitude);
            setQiblaDirection(qiblaAngle);
            setLocationFound(true);
            setLoading(false);
          },
          (error) => {
            console.error('Initial position error:', error);
            Alert.alert('Error', 'Failed to get your location. Please check your GPS settings.');
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000
          }
        );

        // Start watching position for updates
        locationWatchId = Geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const qiblaAngle = calculateQiblaDirection(latitude, longitude);
            setQiblaDirection(qiblaAngle);
            setLocationFound(true);
          },
          (error) => {
            console.error('Watch position error:', error);
            Alert.alert('Error', 'Failed to update location. Please check your GPS settings.');
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 10,
            interval: 5000,
            fastestInterval: 2000
          }
        );

      } catch (error) {
        console.error('Permission error:', error);
        Alert.alert('Error', 'Failed to get location permission');
        setLoading(false);
      }
    };

    // Start both compass and location services
    setupCompass();
    getLocation();

    return () => {
      if (compassSubscription) {
        CompassHeading.stop();
      }
      if (locationWatchId !== null) {
        Geolocation.clearWatch(locationWatchId);
      }
    };
  }, []);

  const calculateQiblaDirection = (latitude, longitude) => {
    try {
      // Convert coordinates to radians
      const latK = (KAABA_COORDS.latitude * Math.PI) / 180;
      const lonK = (KAABA_COORDS.longitude * Math.PI) / 180;
      const lat = (latitude * Math.PI) / 180;
      const lon = (longitude * Math.PI) / 180;

      // Calculate the angle using Spherical Law of Cosines
      const numerator = Math.sin(lonK - lon);
      const denominator = (Math.cos(lat) * Math.tan(latK)) - (Math.sin(lat) * Math.cos(lonK - lon));
      
      // Calculate initial bearing
      let qibla = Math.atan2(numerator, denominator);
      
      // Convert to degrees and normalize
      qibla = (qibla * 180 / Math.PI);
      return (qibla + 360) % 360;
    } catch (error) {
      console.error('Qibla calculation error:', error);
      return null;
    }
  };

  // Show loading state until both compass and location are ready
  if (loading || !locationFound || !compassReady || compassHeading === null || qiblaDirection === null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={styles.loadingText}>Finding Qibla direction...</Text>
        <Text style={styles.subLoadingText}>Please make sure your GPS is enabled</Text>
      </View>
    );
  }

  // Calculate the rotation for the compass
  const compassRotation = {
    transform: [{ rotate: `${-compassHeading}deg` }]
  };

  // Calculate the rotation for the Qibla pointer
  const kaabaRotation = {
    transform: [{ rotate: `${(qiblaDirection - compassHeading + 270)}deg` }]
  };

  return (
    <View style={styles.container}>
      <Header
        title="Qibla Direction"
        onLeftPress={() => navigation.goBack()}
        leftIcon={require('../assets/images/whitebackarrow.png')}
        rightIcon={require('../assets/images/whitemesageicon.png')}
      />
      <ImageBackground
        source={require('../assets/images/kaababack.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.compassWrapper}>
              <View style={styles.compassContainer}>
                <View style={styles.compassCircle}>
                  <Image
                    source={require('../assets/images/compass.png')}
                    style={[styles.compass, compassRotation]}
                  />
                </View>
                <View style={[styles.kaabaContainer, kaabaRotation]}>
                  <Image
                    source={require('../assets/images/kabaaicon.png')}
                    style={styles.kaabaImage}
                  />
                </View>
              </View>
              <Text style={styles.directionText}>
                {Math.round(qiblaDirection)}°
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(230, 223, 223, 0.85)',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  compassContainer: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compassCircle: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 7,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  compass: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    position: 'absolute',
  },
  kaabaContainer: {
    position: 'absolute',
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    transformOrigin: 'center',
  },
  kaabaImage: {
    width: 40,
    height: 40,
    position: 'absolute',
    right: -20,
    top: COMPASS_SIZE / 2 - 20,
  },
  directionText: {
    fontSize: 48,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#003366',
  },
  subLoadingText: {
    marginTop: 5,
    fontSize: 14,
    color: '#666',
  },
});
