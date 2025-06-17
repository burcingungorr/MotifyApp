import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {LoginInputProps} from '../../types/auth';

const LoginInput = ({
  email,
  password,
  error,
  setEmail,
  setPassword,
}: LoginInputProps) => {
  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        placeholderTextColor="#ccc"
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#ccc"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    color: 'white',
    borderColor: 'white',
    fontSize: 17,
  },
  error: {
    color: '#fa7720',
    marginBottom: 8,
  },
});

export default LoginInput;
