import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface HeaderProps {
  title: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onLeftPress, onRightPress }) => {
  return (
    <LinearGradient colors={['#007BFF', '#00008B']} style={styles.container}>
      <TouchableOpacity onPress={onLeftPress}>
        <Image
          source={require('../assets/images/phonee.png')} // Update path to your image
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity onPress={onRightPress}>
        <Image
          source={require('../assets/images/emaill.png')}
           style={styles.icon} // Update path to your image          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 15,
    // alignItems: 'center',
    justifyContent: 'space-between',
    width:'100%'
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight:'500',
  },
  icon: {
    width: 24,
    height: 24,
  },
});
