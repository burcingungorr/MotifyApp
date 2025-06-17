import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import dailyTasks from '../../data/surprise';

const SurpriseTask = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?.uid);

  const getTodayDate = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const loadTaskFromFirestore = async () => {
    if (!userId) return;

    const docRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .doc('dailyTask');

    const doc = await docRef.get();
    const today = getTodayDate();

    if (doc.exists()) {
      const data = doc.data();
      if (data?.date === today) {
        setSelectedTask(data.task);
        setIsChecked(data.isChecked);
        return;
      }
    }

    const randomTask =
      dailyTasks[Math.floor(Math.random() * dailyTasks.length)];
    await docRef.set({
      task: randomTask,
      isChecked: false,
      date: today,
    });
    setSelectedTask(randomTask);
    setIsChecked(false);
  };

  useEffect(() => {
    loadTaskFromFirestore();
  }, [userId]);

  const toggleIcon = () => {
    setIsOpen(prev => !prev);
  };

  const toggleCheck = async () => {
    if (!selectedTask || !userId) return;
    if (isChecked) return;

    const newChecked = true;
    setIsChecked(newChecked);

    await firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .doc('dailyTask')
      .update({
        isChecked: newChecked,
      });

    const userRef = firestore().collection('users').doc(userId);

    await firestore().runTransaction(async transaction => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        transaction.set(userRef, {
          xp: 50,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        const currentXp = userDoc.data()?.xp || 0;
        transaction.update(userRef, {
          xp: currentXp + 50,
        });
      }
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleIcon}
      activeOpacity={0.9}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.checkButtonContainer}
          onPress={e => {
            e.stopPropagation();
            toggleCheck();
          }}
          activeOpacity={0.7}>
          <Text style={styles.checkButton}>{isChecked ? '✓' : '○'}</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Sürpriz Görev</Text>
        <Icon
          name={isOpen ? 'gift-open-outline' : 'gift-outline'}
          size={35}
          color="#FF6B00"
        />
      </View>

      <View style={styles.xpContainer}>
        <Text style={styles.xpText}>+50 XP</Text>
      </View>

      {isOpen && (
        <View style={styles.taskContainer}>
          <Text style={styles.taskText}>{selectedTask}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SurpriseTask;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1B2360',
    borderRadius: 10,
    margin: 16,
    padding: 16,
    elevation: 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FF6B00',
    fontSize: 20,
    marginRight: 10,
    fontWeight: 'bold',
    paddingVertical: 25,
  },
  xpContainer: {
    position: 'absolute',
    top: 5,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  taskContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 16,
    color: '#1B2360',
    flex: 1,
    paddingRight: 10,
    textAlign: 'center',
  },
  checkButtonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  checkButton: {
    fontSize: 24,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
});
