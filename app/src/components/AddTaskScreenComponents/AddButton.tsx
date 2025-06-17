import React from 'react';
import {TouchableOpacity, StyleSheet, Alert, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {AddButtonProps} from '../../types/home';

const AddButton = ({taskName, category, onSuccess}: AddButtonProps) => {
  const userId = useSelector((state: RootState) => state.auth.user?.uid);

  const handleSubmit = async () => {
    const user = auth().currentUser;
    if (!user) return;

    if (!taskName.trim() || !category.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen görev adı ve kategori seçiniz.');
      return;
    }

    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('tasks')
        .add({
          name: taskName,
          category,
          completed: false,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      Alert.alert('Başarılı', 'Görev eklendi.');
      onSuccess();
    } catch (err) {
      Alert.alert('Hata', 'Görev eklenirken bir sorun oluştu.');
      console.error('Firestore Hatası:', err);
    }
  };

  return (
    <TouchableOpacity onPress={handleSubmit} style={[styles.button]}>
      <Text style={styles.buttonText}>Görev Ekle</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255, 221, 0, 0.88)',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 10,
    minWidth: 120,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddButton;
