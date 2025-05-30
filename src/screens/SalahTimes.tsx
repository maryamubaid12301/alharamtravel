import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Switch, FlatList, Dimensions,ImageBackground ,StatusBar} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

export default function SalahTimes() {
  const navigation = useNavigation();
  const [count, setCount] = useState(0);
  const namazList = [
  { id: '1', name: 'Fajr', time: '04:00 AM' },
  { id: '2', name: 'Dhuhr', time: '12:30 PM' },
  { id: '3', name: 'Asr', time: '04:15 PM' },
  { id: '4', name: 'Maghrib', time: '07:10 PM' },
  { id: '5', name: 'Isha', time: '08:45 PM' },
];
 const [masterSwitch, setMasterSwitch] = useState(true);
  const [switchStates, setSwitchStates] = useState(
    namazList.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {})
  );

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
      {/* App Header */}
<View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={require('../assets/images/whitebackarrow.png')} style={styles.Arrowicon} />
    </TouchableOpacity>
  <View style={styles.headerCenter}>
    <Text style={styles.headerText}>Salah Times</Text>
  </View>
  <Image source={require('../assets/images/whitemesageicon.png')} style={styles.icon} />
</View>
         
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
    paddingTop: 60,
    backgroundColor: 'lightgray',
  },
 header: {
  backgroundColor: '#0384cc',
  width: '100%',
  paddingVertical: 15,
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
