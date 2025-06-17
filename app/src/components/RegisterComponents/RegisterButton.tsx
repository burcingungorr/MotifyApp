import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {RegisterButtonProps} from '../../types/auth';

const RegisterButton: React.FC<RegisterButtonProps> = ({onPress, disabled}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button]}>
      <Text style={styles.buttonText}>Kayıt Ol</Text>
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterButton;
