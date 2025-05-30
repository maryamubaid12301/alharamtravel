import React, {useState,useEffect} from 'react';
import { View, Text, Button, StyleSheet,ImageBackground,ScrollView,TouchableOpacity,Image,Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import Header from '../components/Header';
import AppIntroSlider from 'react-native-app-intro-slider';

type HomeScreenProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProp>();
const features = [
    { title: 'Qibla', icon: require('../assets/images/compass.jpg') },
    { title: 'Salah Times', icon: require('../assets/images/salah.png') },
    { title: 'Hajj & Umrah', icon: require('../assets/images/hajjoromrah.jpg') },
    { title: 'Live Streaming', icon: require('../assets/images/live.png') },
    { title: 'Quran', icon: require('../assets/images/quran.jpg') },
    { title: 'Tasbeeh counter', icon: require('../assets/images/tasbeehh.jpg') },
  ];
  const slides = [
  {
    key: '1',
    image: require('../assets/images/ho.jpg'),
  },
  {
    key: '2',
    image: require('../assets/images/ht.jpg'),
  },
  {
    key: '3',
    image: require('../assets/images/hth.jpg'),
  },
];
const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
const sliderRef = React.useRef<AppIntroSlider>(null);

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
      <Header
        title="Home"
        // onLeftPress={() => console.log('Left pressed')}
        // onRightPress={() => console.log('Right pressed')}
      />
       <ScrollView>
 <ImageBackground
  source={require('../assets/images/hajji.jpg')}
  style={styles.backgroundImage}
  resizeMode="cover">
  <View style={{ height: 180 }} />
</ImageBackground>
   {/* Feature Grid */}
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

            // <TouchableOpacity key={index} style={styles.card}>
            //   <Image source={item.icon} style={styles.cardIcon} />
            //   <Text style={styles.cardText}>{item.title}</Text>
            // </TouchableOpacity>
          ))}
        </View>
        {/* Weather Section */}
      <View style={styles.weatherBox}>
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
     <View style={styles.weatherRight}>
      <View style={{flexDirection:"row"}}>
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
</View>
<View style={styles.weatherBox}>
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
     <View style={styles.weatherRight}>
      <View style={{flexDirection:"row"}}>
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
</View>
         <View style={styles.section}>
          <Text style={styles.sectionTitle}>Umrah Packages</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>
        <View>
  
      <Image
    source={require('../assets/images/hajji.jpg')}
 style={styles.secfullImage}
  />
        </View>
       <View style={styles.sliderContainer}>
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
</View>
      </ScrollView> 
      {/* <Button title="Go to Details" onPress={() => navigation.navigate('Details')} /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    paddingTop: 20, 
  },
   backgroundImage: {
  width: '100%',
  height: 240,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 10,
  },
    gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  box: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  boxImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  boxText: {
    fontSize: 14,
    textAlign: 'center',
  },
    banner: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 100,
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
    borderColor:'gray',
    borderWidth:0.4
  },
  cardIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    color:'black'
  },
 weatherBox: {
    height:'7%',
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  tabItem: {
    fontSize: 12,
    color: '#555',
  },

  dateRow: {
  flexDirection: 'column',
  gap: 4,
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
  marginTop:-15
},
redsunIcon:{
  width: 16,
  height: 16,
  marginLeft: 23,
  marginTop:-15
},
redsun:{
   width: 25,
  height: 25,
  marginRight: 12,
  marginTop:8

},
secfullImage:{

  width: '94%',
  height: 200,
  alignSelf: 'center',       
  marginVertical: 20,       
  marginHorizontal: 10,      
  borderRadius: 12,         
  overflow: 'hidden',        
  marginBottom:10

},
sliderContainer: {
  width: '94%',
  height: 200,
  alignSelf: 'center',
  borderRadius: 12,
  overflow: 'hidden',
  marginVertical: 20,
  marginBottom:120
},

sliderImage: {
  width: Dimensions.get('window').width * 0.94,
  height: 200,
  resizeMode: 'cover',
},


});
