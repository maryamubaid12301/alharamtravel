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
    source={require('../assets/images/logo.png')}
    style={styles.logo}
    resizeMode="contain"
  />

  <Text style={styles.count}>{count}</Text>

  <TouchableOpacity style={styles.circle} onPress={() => setCount(count + 1)}>
    <Image
      source={require('../assets/images/thumbpresss.png')}
      style={styles.circleImage}
    />
  </TouchableOpacity>

  {/* <TouchableOpacity style={styles.resetButton} onPress={() => setCount(0)}>
    <Text style={styles.resetText}>RESET</Text>
  </TouchableOpacity> */}
</View>


        {/* Bottom Half with Background Image */}
        <ImageBackground
          source={require('../assets/images/masjid4.png')}
          style={styles.bottomHalf}
          resizeMode="cover"
        >
           <TouchableOpacity style={styles.resetButton} onPress={() => setCount(0)}>
    <Text style={styles.resetText}>RESET</Text>
  </TouchableOpacity>
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
  paddingTop: 30,
  paddingBottom: 20,
  alignItems: 'center',
  justifyContent: 'flex-start',  // important: start from top
  gap: 20,
 
},

logo: {
  width: 160,
  height: 100,
  marginBottom: 20,
  marginTop: 10, // for spacing below header
},

count: {
  fontSize: 48,
  fontWeight: 'bold',
  color: '#000',
  marginBottom: 20,
},

// circle: {
//   width: width * 0.3,
//   height: width * 0.3,
//   borderRadius: (width * 0.3) / 2,
//   borderWidth: 6,
//   borderColor: '#000',
//   justifyContent: 'center',
//   alignItems: 'center',
//   backgroundColor: '#fff',
//   marginBottom: 20,
// },

resetButton: {
  backgroundColor: '#f26522',
  paddingHorizontal: 40,
  paddingVertical: 10,
  borderRadius: 8,
  marginTop: 0,
  position:'absolute',
  top:50
},
 resetText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomHalf: {
    height: height * 0.5,
    width: '100%',
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
