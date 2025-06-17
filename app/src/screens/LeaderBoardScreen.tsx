import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Title from '../components/Title';
import type {NavigationProp} from '@react-navigation/native';
import {MenuButton} from '../navigation/AppNavigator';
import LeaderTable from '../components/LeaderComponents/LeaderTable';
import Users from '../components/LeaderComponents/Users';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LeaderBoardScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  return (
    <View style={styles.container}>
      <MenuButton navigation={navigation} />
      <Title name="Liderlik" />
      <Icon name="podium-gold" size={50} color="white" style={styles.icon} />

      <LeaderTable />

      <View style={styles.containerDown}>
        <Text style={styles.containerDownText}>Arkadaşlık</Text>
        <Users />
      </View>
    </View>
  );
};

export default LeaderBoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa7720',
  },
  containerDown: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    left: '40%',
  },
  containerDownText: {
    marginTop: 15,
    color: 'white',
    marginBottom: 10,
    fontSize: 18,
  },
  icon: {
    textAlign: 'center',

    marginTop: 20,
  },
});
