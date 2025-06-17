import React from 'react';
import {StyleSheet, View} from 'react-native';
import Title from '../components/Title';
import type {NavigationProp} from '@react-navigation/native';
import {MenuButton} from '../navigation/AppNavigator';
import GamesCard from '../components/GamesComponents/GamesCard';
import GamesTitle from '../components/GamesComponents/GamesTitle';

const GamesScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  return (
    <View style={styles.container}>
      <MenuButton navigation={navigation} />
      <Title name="Oyun Alanı" />
      <GamesCard />
      <GamesTitle />
    </View>
  );
};

export default GamesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa7720',
  },
});
