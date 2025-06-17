import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const GamesTitle = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oyunları Oyna </Text>
      <Text style={styles.subtitle}>XP Kazan! </Text>
      <Icon name="creation" size={30} color="white" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: 'white',
  },
  icon: {
    margin: 20,
  },
});

export default GamesTitle;
