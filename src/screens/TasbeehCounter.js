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
   <ImageBackground
  source={require('../assets/images/bg-Final.png')}
  style={styles.imageBackground}
  resizeMode="contain">
  {/* Header starts from top as well */}
  <View style={styles.headerWrapper}>
    <Header
      title="Tasbeeh"
      onLeftPress={() => navigation.goBack()}
      leftIcon={require('../assets/images/whitebackarrow.png')}
      rightIcon={require('../assets/images/whitemesageicon.png')}
    />
  </View>
  <View style={styles.logowrapper}> 
  <Image
      source={require('../assets/images/logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
  {/* Centered Content */}
  <View style={styles.topHalf}>
    <Text style={styles.count}>{count}</Text>
    <TouchableOpacity style={styles.circle} onPress={() => setCount(count + 1)}>
      <Image
        source={require('../assets/images/thumbpresss.png')}
        style={styles.circleImage}
      />
    </TouchableOpacity>
    <TouchableOpacity style={styles.resetButton} onPress={() => setCount(0)}>
      <Text style={styles.resetText}>RESET</Text>
    </TouchableOpacity>
  </View>
</ImageBackground>
    </>
  );
}
const styles = StyleSheet.create({
imageBackground: {
  flex: 1,
  width: '100%',
  height:976,
  
},
topHalf: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  gap: 5,
},
logo: {
  width: 180,
  height: 100,
  marginBottom: 50,
},
count: {
  fontSize: 48,
  fontWeight: 'bold',
  color: '#000',
  paddingVertical: 45,
},
resetButton: {
  backgroundColor: '#f26522',
  paddingHorizontal: 40,
  paddingVertical: 10,
  borderRadius: 8,
  marginTop: 60,
},

resetText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
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
logowrapper:{
  justifyContent:'center',
  alignContent:'center',
  alignItems:'center',
  paddingTop:40
}
});
