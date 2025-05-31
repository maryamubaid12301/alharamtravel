import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const { width, height } = Dimensions.get('window');

export default function TasbeehCounter() {
  const navigation = useNavigation();
  const [count, setCount] = useState(0);

  return (
    <>
      <StatusBar backgroundColor="#00008B" barStyle="light-content" />
      <View style={styles.container}>
        <Header
          title="Tasbeeh"
          onLeftPress={() => navigation.goBack()}
          leftIcon={require('../assets/images/whitebackarrow.png')}
          rightIcon={require('../assets/images/whitemesageicon.png')}
        />

        {/* Top Half */}
        <View style={styles.topHalf}>
          <Image
            source={require('../assets/images/salah.png')} // replace with your actual logo path
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setCount(0)}
          >
            <Text style={styles.resetText}>RESET</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Half with Background Image */}
        <ImageBackground
          source={require('../assets/images/masjid2.jpg')}
          style={styles.bottomHalf}
          resizeMode="cover"
        >
          <View style={styles.overlayContent}>
            <Text style={styles.count}>{count}</Text>

            <TouchableOpacity
              style={styles.circle}
              onPress={() => setCount(count + 1)}
            >
              <Image
                source={require('../assets/images/thumbup.png')}
                style={styles.circleImage}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topHalf: {
    height: height * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 100,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#f26522',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomHalf: {
    height: height * 0.5,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 20,
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  circle: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    borderWidth: 6,
    borderColor: '#000',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  circleImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});
