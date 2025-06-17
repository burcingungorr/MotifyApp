import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import timedTasks from '../../data/time';

const parseTimeRange = (timeRange: string) => {
  if (!timeRange.includes(':') || !timeRange.includes('–')) return null;

  const [start, end] = timeRange.split('–').map(t => t.trim());
  const [startHourStr, startMinStr = '0'] = start.split(':');
  const [endHourStr, endMinStr = '0'] = end.split(':');
  const startHour = Number(startHourStr);
  const startMin = Number(startMinStr);
  const endHour = Number(endHourStr);
  const endMin = Number(endMinStr);

  return {
    start: startHour * 60 + startMin,
    end: endHour * 60 + endMin,
  };
};

const getCurrentMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

const TimedTask = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const [todayTask, setTodayTask] = useState<any | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const now = getCurrentMinutes();

    const validTasks = timedTasks.filter(task => {
      const range = parseTimeRange(task.zaman);
      if (!range) return false;
      return now >= range.start && now <= range.end;
    });

    if (validTasks.length > 0) {
      const today = new Date().toDateString();
      const index =
        Math.abs(today.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) %
        validTasks.length;
      setTodayTask(validTasks[index]);
    } else {
      setTodayTask(null);
    }
  }, []);

  const handleComplete = async () => {
    if (!userId || isChecked) return;

    const userRef = firestore().collection('users').doc(userId);
    await firestore().runTransaction(async transaction => {
      const doc = await transaction.get(userRef);
      const currentXp = doc.exists() ? doc.data()?.xp || 0 : 0;
      transaction.update(userRef, {xp: currentXp + 30});
    });
    setIsChecked(true);
  };

  if (!todayTask || isChecked) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.xp}>+30 XP</Text>
      <TouchableOpacity onPress={handleComplete}>
        <Text style={styles.checkButton}>{isChecked ? '✓' : '○'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Süreli Görev ⏰ </Text>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <Text style={styles.text}>{todayTask.gorev}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFD700',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 10,
    marginVertical: 7,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
    marginLeft: 40,
    color: 'black',
  },
  text: {
    fontSize: 15,
    marginBottom: 8,
    marginLeft: 40,
    color: 'black',
  },
  xp: {
    position: 'absolute',
    top: 10,
    right: 15,
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },

  button: {
    backgroundColor: '#1B2360',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkButton: {
    fontSize: 28,
    color: '#1B2360',
    position: 'absolute',
    left: 5,
  },
});

export default TimedTask;
