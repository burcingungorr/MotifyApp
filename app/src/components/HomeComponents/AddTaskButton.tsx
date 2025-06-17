import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const AddTaskButton = () => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate('AddTaskScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Görevini Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
    flexDirection: 'row',
    padding: 16,
    borderRadius: 10,
    margin: 16,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 221, 0, 0.76)',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AddTaskButton;
