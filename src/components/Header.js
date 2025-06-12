import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const Header = ({
  title,
    logo = null, // image source like require('../assets/images/logo.png')
  onLeftPress,
  onRightPress,
  leftIcon = require('../assets/images/phonee.png'),
  rightIcon = require('../assets/images/whitemesageicon.png'),
  containerStyle = {},
}) => {
  return (
    <>
      <StatusBar backgroundColor="#00008B" barStyle="light-content" />
      <LinearGradient colors={['#0384cc', '#0384cc']} style={[styles.container, containerStyle]}>
        <View style={styles.side}>
          <TouchableOpacity onPress={onLeftPress}>
            {leftIcon && (
              <Image source={leftIcon} style={styles.icon} resizeMode="contain" />
            )}
          </TouchableOpacity>
        </View>
      <View style={styles.center}>
          {title ? (
            <Text style={styles.title}>{title}</Text>
          ) : logo ? (
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          ) : null}
        </View>
        <View style={styles.side}>
          <TouchableOpacity onPress={onRightPress}>
            {rightIcon && (
              <Image source={rightIcon} style={styles.icon} resizeMode="contain" />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  side: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2
  },
  icon: {
    width: 20,
    height: 20,
    marginTop: 1
  },
  logo: {
    width: 70,
    height: 30,
  },
});
