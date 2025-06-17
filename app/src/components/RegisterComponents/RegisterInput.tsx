import React from 'react';
import {TextInput, Text, StyleSheet} from 'react-native';

const RegisterInput = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}: any) => {
  return (
    <>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={handleChange('email')}
        onBlur={handleBlur('email')}
        value={values.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {touched.email && errors.email && (
        <Text style={styles.error}>{errors.email}</Text>
      )}

      <TextInput
        placeholder="Kullanıcı Adı"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={handleChange('username')}
        onBlur={handleBlur('username')}
        value={values.username}
        autoCapitalize="none"
      />
      {touched.username && errors.username && (
        <Text style={styles.error}>{errors.username}</Text>
      )}

      <TextInput
        placeholder="Şifre"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={handleChange('password')}
        onBlur={handleBlur('password')}
        value={values.password}
        secureTextEntry
      />
      {touched.password && errors.password && (
        <Text style={styles.error}>{errors.password}</Text>
      )}
    </>
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

export default RegisterInput;
