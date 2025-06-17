import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {LoginButtonProps} from '../../types/auth';

const LoginButton = ({onPress}: LoginButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Giriş </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fa7720',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginButton;
