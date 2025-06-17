import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

import logo from '../assets/logo/motify.png';

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image source={logo} style={styles.logo} />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: '50%',
    height: 160,
    borderRadius: 50,
    marginBottom: 20,
  },
});
