import React from 'react';
import { ScrollView, Text, View, StyleSheet ,TouchableOpacity,Image,StatusBar,FlatList} from 'react-native';
import quranJson from '../assets/JsonFile/quranfile.json';
import { useNavigation } from '@react-navigation/native';
export default function Quran() {
  const quranData = quranJson.Quran;
     const navigation = useNavigation();
     const surahList = Object.entries(quranJson.Quran).map(([surahNumber, verses]) => ({
  surahNumber,
  verses,
}));
      const renderItem = ({ item }: any) => (
    <View style={styles.surahContainer}>
      <Text style={styles.surahTitle}>Surah {item.surahNumber}</Text>
      {item.verses.map((verse: string, index: number) => (
        <Text key={index} style={styles.verseText}>
          {index + 1}. {verse.trim()}
        </Text>
      ))}
    </View>
  );
  return (
    <>
      <StatusBar backgroundColor="#00008B" barStyle="light-content" />
    <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../assets/images/whitebackarrow.png')} style={styles.Arrowicon} />
        </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.headerText}>Quran</Text>
      </View>
      <Image source={require('../assets/images/whitemesageicon.png')} style={styles.icon} />
    </View>
    
   
    {/* Quran Content */}
      <FlatList
        data={surahList}
        keyExtractor={(item) => item.surahNumber}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={21}
        removeClippedSubviews
      />
     </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  surahContainer: {
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  surahTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e3d59',
  },
  verseText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
    marginBottom: 6,
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
  marginTop:40
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

});
