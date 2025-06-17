import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Animated, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface userIdProps {
  userId: string;
}

const UserLevel: React.FC<userIdProps> = ({userId}) => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(0);

  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(doc => {
        if (doc.exists()) {
          const data = doc.data();
          setXp(data?.xp || 0);
          if (data?.level) setLevel(data.level);
        }
      });

    return () => unsubscribe();
  }, [userId]);

  const calculatedLevel = Math.floor(xp / 200) + 1;
  const xpInLevel = xp % 200;

  useEffect(() => {
    if (level !== calculatedLevel) {
      setLevel(calculatedLevel);
      firestore()
        .collection('users')
        .doc(userId)
        .update({level: calculatedLevel})
        .catch(err => {
          console.error('Level güncellenemedi:', err);
        });
    }
  }, [calculatedLevel, level, userId]);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: xpInLevel,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [xpInLevel]);

  return (
    <View style={styles.container}>
      <View style={styles.starContainer}>
        <Icon name="star" size={60} color="#FFD700" style={styles.bigStar} />
        <Text style={styles.level}>{level}</Text>
      </View>

      <Text style={styles.xpText}>{xp} XP</Text>

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
  );
};

const styles = StyleSheet.create({
  container: {
    width: '70%',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 25,
    marginLeft: 60,
    backgroundColor: 'rgb(255, 147, 70)',
    elevation: 10,
  },
  starContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  bigStar: {
    position: 'absolute',
  },
  level: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  xpText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBarBackground: {
    width: '100%',
    backgroundColor: '#E0E0E0',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: '#1B2360',
    height: '100%',
    borderRadius: 5,
  },
});

export default UserLevel;
