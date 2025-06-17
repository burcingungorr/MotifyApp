import React, {useState} from 'react';
import {View, Button, Text, StyleSheet, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '../../redux/slices/authSlice';
import LoginButton from '../../components/LoginComponents/LoginButton';
import LoginInput from '../../components/LoginComponents/LoginInput';
import Logo from '../../components/Logo';

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email ve şifre boş olamaz');
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const {uid, email: userEmail} = userCredential.user;

      const userDoc = await firestore().collection('users').doc(uid).get();
      const firestoreUserData = userDoc.data();

      dispatch(
        loginSuccess({
          uid,
          email: userEmail || '',
          avatar: firestoreUserData?.avatar || 'default.png',
        }),
      );
    } catch (error: any) {
      let message = 'Tekrar deneyin.';

      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        message = 'E-posta veya şifre hatalı';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Geçersiz e-posta formatı';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Çok fazla deneme yapıldı, lütfen sonra tekrar deneyin';
      }

      setError(message);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <LoginInput
        email={email}
        password={password}
        error={error}
        setEmail={setEmail}
        setPassword={setPassword}
      />
      <LoginButton onPress={handleLogin} />

      <View style={styles.registerContainer}>
        <Text style={styles.registerContainerText}>Hesabın yok mu?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.button}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1B2360',
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerContainerText: {
    color: 'white',
  },
  button: {
    color: '#fa7720',
    fontSize: 17,
    margin: 10,
  },
});

export default LoginScreen;
