import React from 'react';
import {View, StyleSheet, Alert, Text, TouchableOpacity} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RegisterInput from '../../components/RegisterComponents/RegisterInput';
import RegisterButton from '../../components/RegisterComponents/RegisterButton';
import Logo from '../../components/Logo';

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Geçerli bir email girin')
    .required('Email zorunlu'),
  username: Yup.string()
    .min(3, 'En az 3 karakter')
    .required('Kullanıcı adı zorunlu'),
  password: Yup.string().min(6, 'En az 6 karakter').required('Şifre zorunlu'),
});

const RegisterScreen = ({navigation}: any) => {
  const handleRegister = async (
    values: {username: string; email: string; password: string},
    {setSubmitting, setErrors, resetForm}: any,
  ) => {
    try {
      const usernameSnap = await firestore()
        .collection('users')
        .where('username', '==', values.username)
        .get();

      if (!usernameSnap.empty) {
        setErrors({username: 'Bu kullanıcı adı zaten alınmış'});
        setSubmitting(false);
        return;
      }

      const userCredential = await auth().createUserWithEmailAndPassword(
        values.email,
        values.password,
      );

      await firestore().collection('users').doc(userCredential.user.uid).set({
        email: values.email,
        username: values.username,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Başarılı', 'Kayıt başarılı!', [
        {
          text: 'Tamam',
          onPress: () => {
            resetForm();
            navigation.navigate('Login');
          },
        },
      ]);
    } catch (error: any) {
      if (error?.code === 'auth/email-already-in-use') {
        setErrors({email: 'Bu email zaten kullanılıyor'});
      } else {
        Alert.alert('Hata', error?.message || 'Bilinmeyen bir hata oluştu');
      }
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Formik
        initialValues={{email: '', username: '', password: ''}}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            <RegisterInput
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <RegisterButton onPress={handleSubmit} disabled={isSubmitting} />
          </>
        )}
      </Formik>
      <View style={styles.registerContainer}>
        <Text style={styles.registerContainerText}>Hesabın var mı?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.button}>Giriş Yap</Text>
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

export default RegisterScreen;
