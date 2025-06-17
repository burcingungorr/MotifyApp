import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Level = () => {
  const xp = useSelector((state: RootState) => state.xp.value);
  const level = useSelector((state: RootState) => state.xp.level);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const xpInLevel = xp % 100;
  const progressPercentage = xpInLevel;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progressPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  return (
    <View style={styles.container}>
      <Icon name="creation" size={24} color="#FFD700" style={styles.icon} />
      <Text style={styles.level}>{level}</Text>
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  progressBarBackground: {
    width: '100%',
    backgroundColor: 'white',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 10,
  },
  progressBarWrapper: {
    flex: 1,
  },
  progressBarFill: {
    backgroundColor: '#1B2360',
    height: '100%',
    borderRadius: 5,
  },
  icon: {
    marginLeft: 10,
    elevation: 10,
  },
  level: {
    fontSize: 26,
    color: 'rgba(255, 221, 0, 1)',
    marginRight: 10,
    marginLeft: 5,
    elevation: 10,
  },
});

export default Level;
