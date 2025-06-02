// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   PermissionsAndroid,
//   Platform,
//   Image,
//   Animated,
// } from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
// import {
//   magnetometer,
//   SensorTypes,
//   setUpdateIntervalForType,
// } from 'react-native-sensors';
// import Header from '../components/Header';
// import { useNavigation } from '@react-navigation/native';
// setUpdateIntervalForType(SensorTypes.magnetometer, 100);
// const KAABA_LAT = 21.4225;
// const KAABA_LON = 39.8262;
// export default function Qibla() {
//   const navigation = useNavigation();
//   const [heading, setHeading] = useState(0);
//   const [qiblahAngle, setQiblahAngle] = useState(0);
//   const rotationAnim = useState(new Animated.Value(0))[0];
//   useEffect(() => {
//     requestLocationPermission();
//     const magnetoSubscription = magnetometer.subscribe(({ x, y }) => {
//       const angle = Math.atan2(y, x) * (180 / Math.PI);
//       const headingDeg = (angle + 360) % 360;
//       setHeading(headingDeg);
//       rotationAnim.setValue(headingDeg);
//     });
//     return () => magnetoSubscription.unsubscribe();
//   }, []);
//   const requestLocationPermission = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           getCurrentLocation();
//         } else {
//           console.warn('Location permission denied');
//         }
//       } else {
//         getCurrentLocation();
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   };

//   const getCurrentLocation = () => {
//     Geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         const angle = calculateQiblah(latitude, longitude);
//         setQiblahAngle(angle);
//       },
//       (error) => {
//         console.warn(error.message);
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//     );
//   };

//   const calculateQiblah = (lat, lon) => {
//     const φ1 = (lat * Math.PI) / 180;
//     const φ2 = (KAABA_LAT * Math.PI) / 180;
//     const Δλ = ((KAABA_LON - lon) * Math.PI) / 180;

//     const x = Math.sin(Δλ) * Math.cos(φ2);
//     const y =
//       Math.cos(φ1) * Math.sin(φ2) -
//       Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

//     const θ = Math.atan2(x, y);
//     const bearing = (θ * 180) / Math.PI;
//     return (bearing + 360) % 360;
//   };

//   const compassRotation = rotationAnim.interpolate({
//     inputRange: [0, 360],
//     outputRange: ['0deg', '360deg'],
//   });

//   const qiblaRelativeAngle = (qiblahAngle - heading + 360) % 360;

//   return (
//     <View style={styles.container}>
//            <Header
//   title="Qiblah"
//   onLeftPress={() => navigation.goBack()}
//   leftIcon={require('../assets/images/whitebackarrow.png')}
//   rightIcon={require('../assets/images/whitemesageicon.png')}
// />
// <View style={styles.mainContainer}>
//  <Text style={styles.title}>Qibla Direction</Text>
//       <View style={styles.compassContainer}>
//         <Animated.Image
//           source={require('../assets/images/compass-bg.png')}
//           style={[styles.compass, { transform: [{ rotate: compassRotation }] }]}
//         />
//         <View
//           style={[
//             styles.qiblaMarker,
//             { transform: [{ rotate: `${qiblaRelativeAngle}deg` }] },
//           ]} >
//           <Image
//             source={require('../assets/images/qibla-direction.png')}
//             style={styles.qiblaImage}
//           />
//         </View>
//       </View>
//       <Text style={styles.angleText}>Qibla: {qiblahAngle.toFixed(2)}°</Text>
    
// </View>
//      </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#e1ecf4',
   
//   },
//   title: {
//     fontSize: 24,
//     color: '#003366',
//     marginBottom: 20,
//     fontWeight: 'bold',
//   },
//   compassContainer: {
//     width: 250,
//     height: 250,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   compass: {
//     width: 250,
//     height: 250,
//     position: 'absolute',
//     resizeMode: 'contain',
//   },
//   qiblaMarker: {
//     position: 'absolute',
//     top: 10,
//     width: 40,
//     height: 100,
//     alignItems: 'center',
//   },
//   qiblaImage: {
//     width: 40,
//     height: 40,
//     resizeMode: 'contain',
//   },
//   angleText: {
//     color: '#000',
//     marginTop: 20,
//     fontSize: 18,
//     fontWeight: '500',
//   },
//   mainContainer:{
//      alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical:90
//   },
// });
import React, {
    useState,
    useEffect,
    useCallback,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { SensorTypes, setUpdateIntervalForType, magnetometer } from 'react-native-sensors';
import PropTypes from 'prop-types';
import { moderateScale } from 'react-native-size-matters';
export const useQiblaCompass = () => {
    const [magnetometerValue, setMagnetometerValue] = useState(0);
    const [subscription, setSubscription] = useState(null);
    const [qiblad, setQiblad] = useState(0);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };
    const initCompass = useCallback(async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            setError('Location permission not granted');
            setIsLoading(false);
            return;
        }
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                calculate(latitude, longitude);
                subscribe();
                setIsLoading(false);
            },
            (error) => {
                setError('Failed to get location');
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }, []);
    useEffect(() => {
        initCompass();
        return () => unsubscribe();
    }, []);

    const subscribe = () => {
        setUpdateIntervalForType(SensorTypes.magnetometer, 100);
        const sub = magnetometer.subscribe(({ x, y }) => {
            setMagnetometerValue(angle({ x, y }));
        });
        setSubscription(sub);
    };
console.log('angle',angle)
    const unsubscribe = () => {
        subscription?.unsubscribe();
        setSubscription(null);
    };
    const angle = ({ x, y }) => {
        let angle = Math.atan2(y, x);
        if (angle < 0) angle += 2 * Math.PI;
        return Math.round(angle * (180 / Math.PI));
    };
    const degree = (angle) => (angle - 90 >= 0 ? angle - 90 : angle + 271);
    const direction = (deg) => {
        const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return dirs[Math.round(deg / 45) % 8];
    };
    const calculate = (lat, lon) => {
        const PI = Math.PI;
        const latK = (21.4225 * PI) / 180;
        const lonK = (39.8264 * PI) / 180;
        const phi = (lat * PI) / 180;
        const lambda = (lon * PI) / 180;

        const qiblaDeg = (180 / PI) * Math.atan2(
            Math.sin(lonK - lambda),
            Math.cos(phi) * Math.tan(latK) - Math.sin(phi) * Math.cos(lonK - lambda)
        );
        setQiblad(qiblaDeg);
    };
    const compassDeg = degree(magnetometerValue);
    const compassDir = direction(compassDeg);
    const compassRotate = 360 - compassDeg;
    const kaabaRotate = compassRotate + qiblad;

    return {
        qiblad,
        compassDir,
        compassDeg,
        compassRotate,
        kaabaRotate,
        error,
        isLoading,
        reinitCompass: initCompass,
    };
};

const QiblaCompass = forwardRef(({ backgroundColor = 'transparent', color = '#000', textStyles = {}, compassImage, kaabaImage }, ref) => {
    const {
        qiblad,
        compassDir,
        compassDeg,
        compassRotate,
        kaabaRotate,
        error,
        isLoading,
        reinitCompass,
    } = useQiblaCompass();

    useImperativeHandle(ref, () => ({ reinitCompass }), []);

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor }]}>
                <ActivityIndicator size={50} color={color} />
            </View>
        );
    }
    return (
        <View style={[styles.container, { backgroundColor }]}>
            {error && (
                <Text style={[styles.errorText, textStyles]}>
                    Error: {error}
                </Text>
            )}
            <View style={styles.direction}>
                <Text style={[styles.directionText, { color }, textStyles]}>{compassDir}</Text>
                <Text style={[styles.directionText, { color }, textStyles]}>{compassDeg}°</Text>
            </View>
            <View style={{ width: '100%', height: moderateScale(300), position: 'relative' }}>
                <Image
                    source={compassImage || require('../assets/images/compass.jpg')}
                    style={[
                        styles.image,
                        { transform: [{ rotate: `${compassRotate}deg` }] },
                    ]}
                />
                <View style={[styles.kaabaWrapper, { transform: [{ rotate: `${kaabaRotate}deg` }] }]}>
                    <Image
                        source={kaabaImage || require('../assets/images/compass.jpg')}
                        style={styles.kaabaImage}
                    />
                </View>
            </View>
            <View style={styles.qiblaDirection}>
                <Image source={require('../assets/images/compass.jpg')} style={styles.smallKaaba} />
                <Text style={[styles.directionText, { color }, textStyles]}>
                    {qiblad.toFixed(2)}
                </Text>
            </View>
        </View>
    );
});

QiblaCompass.propTypes = {
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    textStyles: PropTypes.object,
    compassImage: PropTypes.any,
    kaabaImage: PropTypes.any,
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#f00',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 20,
        fontSize: moderateScale(16),
    },
    direction: {
        textAlign: 'center',
    },
    directionText: {
        textAlign: 'center',
        fontSize: 30,
    },
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        position: 'absolute',
        width: moderateScale(300),
        height: moderateScale(300),
    },
    kaabaWrapper: {
        width: moderateScale(300),
        height: moderateScale(300),
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    kaabaImage: {
        resizeMode: 'center',
        height: 100,
        width: 40,
    },
    smallKaaba: {
        width: moderateScale(35),
        height: moderateScale(35),
    },
    qiblaDirection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default QiblaCompass;
