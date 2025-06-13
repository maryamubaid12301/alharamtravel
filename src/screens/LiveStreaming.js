import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FONTS, SIZES, COLORS } from '../theme/fonts';
import Header from '../components/Header';
const { width } = Dimensions.get('window');
export default function LiveStreaming() {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#0384cc" barStyle="light-content" />
      {/* Header */}
   <Header
  title="Live Streaming"
  onLeftPress={() => navigation.goBack()}
  leftIcon={require('../assets/images/whitebackarrow.png')}
  rightIcon={require('../assets/images/whitemesageicon.png')}
/>
      {/* Content */}
      <View style={styles.mainView}>
        <View style={styles.liveBlock}>
          <Text style={styles.cityText}>MAKKAH</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WebViewScreen', {
                url: 'https://www.youtube.com/watch?v=nKBA6xp5P_k',
              })
            } >
            <Image
              source={require('../assets/images/streaming.jpg')}
              style={styles.streamImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.liveBlock}>
          <Text style={styles.cityText}>MADINA</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('WebViewScreen', {
                url: 'https://www.youtube.com/watch?v=nKBA6xp5P_k',
              })
            } >
            <Image
              source={require('../assets/images/streaming.jpg')}
              style={styles.streamImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
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
    marginTop: 22,
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
    marginTop: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 180,
  },
  liveBlock: {
    marginBottom: 30,
    alignItems: 'center',
  },
  cityText: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay',
    fontSize: SIZES.medium,
  },
  streamImage: {
    width: width * 0.6,
    height: width * 0.3,
    borderRadius: 10,
  },
});
