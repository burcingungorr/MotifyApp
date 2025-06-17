import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TitleProps} from '../types/home';

const Title: React.FC<TitleProps> = ({name}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Title;
