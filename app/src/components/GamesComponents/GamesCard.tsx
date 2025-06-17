import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const GamesCard = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, {backgroundColor: '#1B2360'}]}
        onPress={() => {
          navigation.navigate('tictactoe');
        }}>
        <Text style={styles.text}>X - O - X</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, {backgroundColor: 'rgb(255, 147, 70)'}]}
        onPress={() => {
          navigation.navigate('memorymatch');
        }}>
        <Text style={styles.text}>Hafıza Patlat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, {backgroundColor: 'rgb(233, 55, 24)'}]}
        onPress={() => {
          navigation.navigate('simonsays');
        }}>
        <Text style={styles.text}>Renk Kutuları</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, {backgroundColor: 'rgba(255, 221, 0, 0.88)'}]}
        onPress={() => {
          navigation.navigate('clicker');
        }}>
        <Text style={styles.text}>Hızlı Tıkla</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GamesCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
    marginTop: 100,
  },
  card: {
    width: '47%',
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 10,
  },
  text: {
    color: 'white',
    fontSize: 25,
    margin: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
