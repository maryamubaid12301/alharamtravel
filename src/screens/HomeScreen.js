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
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { FONTS, SIZES, COLORS } from '../theme/fonts';
// import AppIntroSlider from 'react-native-app-intro-slider';
export default function HomeScreen() {
  const navigation = useNavigation();
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const[currentDate,setCurrentDate]=useState('')
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef(null);

useEffect(() => {
  const updateDateTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }); // e.g. "11-Jun-2025"
    setCurrentTime(formattedTime);
    setCurrentDate(formattedDate);
  };
  updateDateTime(); // Set immediately on mount
  const interval = setInterval(updateDateTime, 60000); // Update every 60s
  return () => clearInterval(interval); // Cleanup
}, []);
 useEffect(() => {
  const fetchWeather = async () => {
    try {
      // Using the free tier API (2.5) and getting weather for Makkah coordinates
      const response = await fetch(
        'https://api.openweathermap.org/data/2.5/weather?lat=21.4225&lon=39.8262&appid=2c1bb544e9d8f98fd791d5c8084c22e1&units=metric'
      );
      const data = await response.json();
      console.log("Weather API data:", data);

      if (data?.main && data?.weather && data.weather.length > 0) {
        setWeather({
          temp: data.main.temp,
          description: data.weather[0].description,
        });
      } else {
        console.warn("Unexpected weather API response:", data);
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    }
  };
  fetchWeather();
}, []);
  const features = [
    { title: 'Qibla', icon: require('../assets/images/compass.png') },
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
  return (
    <View style={styles.container}>
    <StatusBar backgroundColor="#003366" barStyle="light-content" />
      {/* Status bar background (only for Android) */}
      {Platform.OS === 'android' && <View style={styles.statusBarBackground} />}
      <Header  
      logo={require('../assets/images/AlhrmLogo.png')}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ImageBackground
          source={require('../assets/images/kaabaa.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover">
          <View style={{ height: 10 }} />
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
              }} >
              <Image source={item.icon} style={styles.cardIcon} />
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Weather Section */}
        {[1, 2].map((_, i) => (
          <View style={styles.weatherBox} key={i}>
            <View style={styles.weatherLeft}>
              <Text style={styles.dateText}>{currentDate}</Text>
              <View style={styles.timeRow}>
            <Text style={styles.dateText}>{currentTime}</Text>
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
              <View style={styles.weatherInfoContainer}>
                <Image
                  source={require('../assets/images/icons8-sun-30.png')}
                  style={styles.redsun}
                />
                <View>
                  <Text style={styles.tempText}>
                    {weather ? `${weather.temp.toFixed(1)}°C` : 'Loading...'}
                  </Text>
                  <Text style={styles.tempText}>
                    {weather ? weather.description : ''}
                  </Text>

                  {/* <Text style={styles.locationText}>Makkah al Mukarramah</Text> */}
                </View>
              </View>
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
    backgroundColor: COLORS.background,
    paddingTop: 0,
  },
  backgroundImage: {
    width: '100%',
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: COLORS.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginTop: 5,
    marginBottom: 0,
  },
  card: {
    width: '28%',
    aspectRatio: 1,
    backgroundColor: COLORS.background,
    elevation: 3,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.lightGray,
    borderWidth: 0.4,
  },
  cardIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  cardText: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    color: COLORS.text,
    fontFamily: FONTS.bold,
  },
  weatherBox: {
    // flexDirection: 'row',
    // backgroundColor: COLORS.blue,
    // margin: 8,
    // marginBottom: 5,
    // padding: 15,
    // borderRadius: 10,
    // elevation: 3,
    // shadowColor: COLORS.text,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // paddingHorizontal:40
     // height: '7%',
    flexDirection: 'row',
    // alignItems: 'flex-start',
    // justifyContent: 'space-between',
    backgroundColor: '#213A7C',
    marginHorizontal: 10,
    padding: 8,
    marginBottom: 10,
    paddingVertical:14
  },
  weatherLeft: {
    flex: 1,
      justifyContent: 'flex-start',
  },
  dateText: {
    
    lineHeight: 12,
    fontSize: SIZES.medium,
    color: COLORS.background,
    fontFamily: FONTS.regular,
    // marginBottom: 5,
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
    marginLeft: 10,
  },
  sunIcon: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  weatherRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  weatherInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  redsun: {
    width: 25,
    height: 25,
    marginRight: 12,
    marginTop: 8,

  },
  tempText: {
    fontSize: SIZES.large,
    color: COLORS.background,
    fontFamily: FONTS.medium,
  },
  locationText: {
    fontSize: SIZES.medium,
    color: COLORS.background,
    fontFamily: FONTS.regular,
    position: 'absolute',
  },
  statusBarBackground: {
    height: StatusBar.currentHeight,
    backgroundColor: COLORS.primary,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 50,
  }
});
