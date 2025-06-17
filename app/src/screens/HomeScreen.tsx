import React from 'react';
import {StyleSheet, View} from 'react-native';
import Title from '../components/Title';
import type {NavigationProp} from '@react-navigation/native';
import {MenuButton} from '../navigation/AppNavigator';
import Level from '../components/HomeComponents/Level';
import CardList from '../components/HomeComponents/CardList';
import AddTaskButton from '../components/HomeComponents/AddTaskButton';

const HomeScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  return (
    <View style={styles.container}>
      <MenuButton navigation={navigation} />
      <Title name="Görevler" />
      <Level />
      <CardList />
      <AddTaskButton />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa7720',
  },
});
