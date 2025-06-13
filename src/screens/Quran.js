// import React from 'react';
// import {
//   ScrollView,
//   Text,
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   StatusBar,
//   FlatList,
// } from 'react-native';
// import quranJson from '../assets/JsonFile/quranfile.json';
// import { useNavigation } from '@react-navigation/native';
// import Header from '../components/Header';
// export default function Quran() {
//   const quranData = quranJson.Quran;
//   const navigation = useNavigation();

//   const surahList = Object.entries(quranData).map(([surahNumber, verses]) => ({
//     surahNumber,
//     verses,
//   }));

//   const renderItem = ({ item }) => (
//     <View style={styles.surahContainer}>
//       <Text style={styles.surahTitle}>Surah {item.surahNumber}</Text>
//       {item.verses.map((verse, index) => (
//         <Text key={index} style={styles.verseText}>
//           {index + 1}. {verse.trim()}
//         </Text>
//       ))}
//     </View>
//   );

//   return (
//     <>
//       <StatusBar backgroundColor="#00008B" barStyle="light-content" />
    
//       <Header
//   title="Quran"
//   onLeftPress={() => navigation.goBack()}
//   leftIcon={require('../assets/images/whitebackarrow.png')}
//   rightIcon={require('../assets/images/whitemesageicon.png')}
// />


//       {/* Quran Content */}
//       <FlatList
//         data={surahList}
//         keyExtractor={(item) => item.surahNumber}
//         renderItem={renderItem}
//         contentContainerStyle={styles.container}
//         initialNumToRender={5}
//         maxToRenderPerBatch={10}
//         windowSize={21}
//         removeClippedSubviews
//       />
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//     padding: 10,
//   },
//   surahContainer: {
//     marginBottom: 30,
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 10,
//     elevation: 3,
//   },
//   surahTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#1e3d59',
//   },
//   verseText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#34495e',
//     marginBottom: 6,
//   },
//   header: {
//     backgroundColor: '#0384cc',
//     width: '100%',
//     paddingVertical: 15,
//     paddingHorizontal: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     position: 'relative',
//     marginTop: 22,
//   },
//   headerCenter: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   icon: {
//     width: 24,
//     height: 24,
//     resizeMode: 'contain',
//   },
//   Arrowicon: {
//     width: 35,
//     height: 35,
//     resizeMode: 'contain',
//   },
// });
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { FONTS, SIZES, COLORS } from '../theme/fonts';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
export default function QuranGrouped() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    fetch('https://quran-api-one-gamma.vercel.app/api/quran')
 // replace with real API
      .then((res) => res.json())
      .then((json) => {
        const grouped = groupBySurah(json);
        setData(grouped);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching Quran data:', err);
        setLoading(false);
      });
  }, []);
  const groupBySurah = (ayahs) => {
    const surahMap = {};
    ayahs.forEach((ayah) => {
      const { sura_no, sura_name_en, sura_name_ar } = ayah;
      if (!surahMap[sura_no]) {
        surahMap[sura_no] = {
          sura_no,
          sura_name_en,
          sura_name_ar,
          ayahs: [],
        };
      }
      surahMap[sura_no].ayahs.push(ayah);
    });
    return Object.values(surahMap);
  };
 const renderSurah = ({ item }) => {
  // Concatenate all Ayahs
  const fullArabic = item.ayahs.map(a => a.aya_text_ar).join(' ');
  const fullEnglish = item.ayahs.map(a => a.aya_text_en).join(' ');
  return (
    <View style={styles.surahContainer}>
      <Text style={styles.surahTitle}>
        {item.sura_no}. {item.sura_name_en} ({item.sura_name_ar})
      </Text>
      <Text style={styles.arabicText}>{fullArabic}</Text>
      {/* <Text style={styles.englishText}>{fullEnglish}</Text> */}
    </View>
  );
};
  return (
    <>
      <StatusBar backgroundColor="#00008B" barStyle="light-content" />
      <Header
        title="Quran"
        onLeftPress={() => navigation.goBack()}
        leftIcon={require('../assets/images/whitebackarrow.png')}
        rightIcon={require('../assets/images/whitemesageicon.png')}
      />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0384cc" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.sura_no.toString()}
          renderItem={renderSurah}
          contentContainerStyle={styles.container}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    paddingBottom: 50,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  surahTitle: {
    fontSize: 20,
    // fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e3d59',
    fontFamily:FONTS.style,
  },
  verseText: {
    fontSize:SIZES.x2xLarge,
    marginBottom: 8,
    lineHeight: 24,
    color: '#333',
    fontFamily: FONTS.style,
  },
  arabicText:{
    //  fontSize: 35,
    marginBottom: 12,
    lineHeight: 54,
    color: '#333',
    justifyContent:'center',
    textAlign:'center',
    // color: COLORS.background,
    fontSize: SIZES.xxxxLarge,
    fontFamily: FONTS.style,
  }
});
