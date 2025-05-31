import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Image,
  Animated,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
setUpdateIntervalForType(SensorTypes.magnetometer, 100);

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

export default function Qibla() {
   const navigation = useNavigation();
  const [heading, setHeading] = useState(0);
  const [qiblahAngle, setQiblahAngle] = useState(0);
  const rotationAnim = useState(new Animated.Value(0))[0];
  useEffect(() => {
    requestLocationPermission();
    const magnetoSubscription = magnetometer.subscribe(({ x, y }) => {
      const angle = Math.atan2(y, x) * (180 / Math.PI);
      const headingDeg = (angle + 360) % 360;
      setHeading(headingDeg);
      rotationAnim.setValue(headingDeg);
    });
    return () => magnetoSubscription.unsubscribe();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.warn('Location permission denied');
        }
      } else {
        getCurrentLocation();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const angle = calculateQiblah(latitude, longitude);
        setQiblahAngle(angle);
      },
      (error) => {
        console.warn(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const calculateQiblah = (lat, lon) => {
    const φ1 = (lat * Math.PI) / 180;
    const φ2 = (KAABA_LAT * Math.PI) / 180;
    const Δλ = ((KAABA_LON - lon) * Math.PI) / 180;

    const x = Math.sin(Δλ) * Math.cos(φ2);
    const y =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(x, y);
    const bearing = (θ * 180) / Math.PI;
    return (bearing + 360) % 360;
  };

  const compassRotation = rotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const qiblaRelativeAngle = (qiblahAngle - heading + 360) % 360;

  return (
    <View style={styles.container}>
           <Header
  title="Qiblah"
  onLeftPress={() => navigation.goBack()}
  leftIcon={require('../assets/images/whitebackarrow.png')}
  rightIcon={require('../assets/images/whitemesageicon.png')}
/>
<View style={styles.mainContainer}>
 <Text style={styles.title}>Qibla Direction</Text>
      <View style={styles.compassContainer}>
        <Animated.Image
          source={require('../assets/images/compass-bg.png')}
          style={[styles.compass, { transform: [{ rotate: compassRotation }] }]}
        />
        <View
          style={[
            styles.qiblaMarker,
            { transform: [{ rotate: `${qiblaRelativeAngle}deg` }] },
          ]} >
          <Image
            source={require('../assets/images/qibla-direction.png')}
            style={styles.qiblaImage}
          />
        </View>
      </View>
      <Text style={styles.angleText}>Qibla: {qiblahAngle.toFixed(2)}°</Text>
    
</View>
     </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1ecf4',
   
  },
  title: {
    fontSize: 24,
    color: '#003366',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  compassContainer: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compass: {
    width: 250,
    height: 250,
    position: 'absolute',
    resizeMode: 'contain',
  },
  qiblaMarker: {
    position: 'absolute',
    top: 10,
    width: 40,
    height: 100,
    alignItems: 'center',
  },
  qiblaImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  angleText: {
    color: '#000',
    marginTop: 20,
    fontSize: 18,
    fontWeight: '500',
  },
  mainContainer:{
     alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:90
  },
});
