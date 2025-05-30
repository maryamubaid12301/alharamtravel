import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions,ImageBackground ,StatusBar} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

export default function TasbeehCounter() {
      const navigation = useNavigation();
  const [count, setCount] = useState(0);

  return (
    <>
     <StatusBar backgroundColor="#00008B" barStyle="light-content" />
    <View style={styles.container}>
      {/* App Header */}
<View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
<Image source={require('../assets/images/whitebackarrow.png')} style={styles.Arrowicon} />
  
    </TouchableOpacity>
  <View style={styles.headerCenter}>
    <Text style={styles.headerText}>Tasbeeh</Text>
  </View>

  <Image source={require('../assets/images/whitemesageicon.png')} style={styles.icon} />
</View>
      {/* Count Display */}
      {/* <Text style={styles.countLabel}>Count</Text> */}
   <Image
    source={require('../assets/images/alharram.jpg')}
    style={styles.backgroundImage}
    resizeMode="cover"/>
    {/* <View style={{ height: 180 }} /> */}
      <View style={styles.countView}>
 <Text style={styles.count}>{count}</Text>

      {/* Clickable Circle */}
      <View style={styles.circle}>
     <TouchableOpacity style={styles.circle} onPress={() => setCount(count + 1)}>
        <Image source={require('../assets/images/thumbup.png')} style={styles.circleImage} />
      </TouchableOpacity>
      </View>
   

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={() => setCount(0)}>
        <Text style={styles.resetText}>RESET</Text>
      </TouchableOpacity>
      </View>
   
    </View>
    
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
 header: {
  backgroundColor: '#0384cc',
  width: '100%',
  paddingVertical: 15,
  paddingHorizontal: 10,
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
},
icon: {
  width: 24,
  height: 24,
  resizeMode: 'contain',
},
Arrowicon:{
 width: 35,
  height: 35,
  resizeMode: 'contain',
},

  countLabel: {
    fontSize: 22,
    marginTop: 30,
    color: '#000',
    fontWeight:"bold"
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 25,
    color: '#000',
  },

  circleImage: {
  height:'60%',
  width:130,
    resizeMode: 'contain',
  },
  resetButton: {
    backgroundColor: '#f26522',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  resetText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
     backgroundImage: {
  width: '100%',
  height: 340,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 10,
  alignSelf:'center'
  },
  countView:{
    
    justifyContent:"center",
    alignItems:'center'
  },
  circle: {
  width: width * 0.3,
  height: width * 0.3,
  borderRadius: (width * 0.4) / 2,
  borderWidth: 6,                  // Bold border
  borderColor: '#000',             // Black border
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 20,
  backgroundColor: '#fff',         // Optional, makes the border stand out
},

// circleImage: {
//   width: '80%',
//   height: '80%',
//   resizeMode: 'contain',
// },

});
