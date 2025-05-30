import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');
export default function LiveStreaming() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#0384cc" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/whitebackarrow.png')} style={styles.Arrowicon} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Live Streaming</Text>
        </View>

        <Image source={require('../assets/images/whitemesageicon.png')} style={styles.icon} />
      </View>

      {/* Content */}
      <View style={styles.mainView}>
        <View style={styles.liveBlock}>
          <Text style={styles.cityText}>MAKKAH</Text>
          <Image
            source={require('../assets/images/streaming.jpg')}
            style={styles.streamImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.liveBlock}>
          <Text style={styles.cityText}>MADINA</Text>
          <Image
            source={require('../assets/images/streaming.jpg')}
            style={styles.streamImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#213A7C',
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
    marginTop: 40,
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
  Arrowicon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  mainView: {
    marginTop:12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:180
  },
  liveBlock: {
    marginBottom: 30,
    alignItems: 'center',
  },
  cityText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  streamImage: {
    width: width * 0.6,
    height: width * 0.3,
    borderRadius: 10,
  },
});
