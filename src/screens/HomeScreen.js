import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import AppIntroSlider from 'react-native-app-intro-slider';

export default function HomeScreen() {
  const navigation = useNavigation();

  const features = [
    { title: 'Qibla', icon: require('../assets/images/compass.jpg') },
    { title: 'Salah Times', icon: require('../assets/images/salah.png') },
    { title: 'Hajj & Umrah', icon: require('../assets/images/hajjoromrah.jpg') },
    { title: 'Live Streaming', icon: require('../assets/images/live.png') },
    { title: 'Quran', icon: require('../assets/images/quran.jpg') },
    { title: 'Tasbeeh counter', icon: require('../assets/images/tasbeehh.jpg') },
  ];

  const slides = [
    { key: '1', image: require('../assets/images/ho.jpg') },
    { key: '2', image: require('../assets/images/ht.jpg') },
    { key: '3', image: require('../assets/images/hth.jpg') },
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentSlideIndex + 1) % slides.length;
      setCurrentSlideIndex(nextIndex);
      sliderRef.current?.goToSlide(nextIndex, true);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSlideIndex]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#00008B" barStyle="light-content" />
      <Header title="Home" />

      <ScrollView>
        <ImageBackground
          source={require('../assets/images/hajji.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={{ height: 180 }} />
        </ImageBackground>

        <View style={styles.grid}>
          {features.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => {
                switch (item.title) {
                  case 'Qibla':
                    navigation.navigate('Qibla');
                    break;
                  case 'Salah Times':
                    navigation.navigate('SalahTimes');
                    break;
                  case 'Hajj & Umrah':
                    navigation.navigate('HajjUmrah');
                    break;
                  case 'Live Streaming':
                    navigation.navigate('LiveStreaming');
                    break;
                  case 'Quran':
                    navigation.navigate('Quran');
                    break;
                  case 'Tasbeeh counter':
                    navigation.navigate('TasbeehCounter');
                    break;
                  default:
                    break;
                }
              }}
            >
              <Image source={item.icon} style={styles.cardIcon} />
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weather Section */}
        {[1, 2].map((_, i) => (
          <View style={styles.weatherBox} key={i}>
            <View style={styles.weatherLeft}>
              <Text style={styles.dateText}>29-May-2025</Text>
              <View style={styles.timeRow}>
                <Text style={styles.dateText}>10:20 am</Text>
                <Image
                  source={require('../assets/images/icons8-refresh-24.png')}
                  style={styles.refreshIcon}
                />
              </View>
            </View>
            <Image
              source={require('../assets/images/sunnn.png')}
              style={styles.sunIcon}
            />
            <View style={styles.weatherRight}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={require('../assets/images/icons8-sun-30.png')}
                  style={styles.redsun}
                />
                <View>
                  <Text style={styles.tempText}>31.08°C</Text>
                  <Text style={styles.tempText}>clear sky</Text>
                </View>
              </View>
              <Text style={styles.locationText}>Makkah al Mukarramah</Text>
            </View>
          </View>
        ))}

        {/* Umrah Section */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Umrah Packages</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View> */}

        {/* <Image
          source={require('../assets/images/hajji.jpg')}
          style={styles.secfullImage}
        /> */}

        {/* <View style={styles.sliderContainer}>
          <AppIntroSlider
            ref={sliderRef}
            data={slides}
            renderItem={({ item }) => (
              <Image source={item.image} style={styles.sliderImage} />
            )}
            showNextButton={false}
            showDoneButton={false}
            showSkipButton={false}
            dotStyle={{ display: 'none' }}
            activeDotStyle={{ display: 'none' }}
            scrollEnabled={false}
          />
        </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
  },
  backgroundImage: {
    width: '100%',
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: 10,
    marginBottom: 2,
  },
  card: {
    width: '28%',
    aspectRatio: 1,
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
    borderWidth: 0.4,
  },
  cardIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'black',
  },
  weatherBox: {
    // height: '7%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#213A7C',
    marginHorizontal: 15,
    padding: 12,
    marginBottom: 10,
  },
  weatherLeft: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  weatherRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  sunIcon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
  },
  tempText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#007cc0',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 5,
  },
  refreshIcon: {
    width: 16,
    height: 16,
    marginLeft: 23,
    marginTop: -15,
  },
  redsun: {
    width: 25,
    height: 25,
    marginRight: 12,
    marginTop: 8,
  },
  secfullImage: {
    width: '94%',
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  sliderContainer: {
    width: '94%',
    height: 200,
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 20,
    marginBottom: 120,
  },
  sliderImage: {
    width: Dimensions.get('window').width * 0.94,
    height: 200,
    resizeMode: 'cover',
  },
});
