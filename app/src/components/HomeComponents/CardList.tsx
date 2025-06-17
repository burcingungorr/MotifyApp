import React, {useEffect, useState} from 'react';
import {ScrollView, ActivityIndicator, Alert} from 'react-native';
import TaskCard from './TaskCard';
import SurpriseTask from './SurpriseTask';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import TimedTask from './TimedTask';
import {Task} from '../../types/home';

const CardList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state: RootState) => state.auth.user?.uid);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const now = new Date();

        const userTasks: Task[] = [];

        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate?.();

          if (createdAt) {
            const diff = now.getTime() - createdAt.getTime();
            const diffInHours = diff / (1000 * 60 * 60);

            if (diffInHours >= 24) {
              firestore()
                .collection('users')
                .doc(userId)
                .collection('tasks')
                .doc(doc.id)
                .delete();
              return;
            }
          }

          userTasks.push({
            id: doc.id,
            name: data.name,
            category: data.category,
            isChecked: data.isChecked,
            dueDate: data.dueDate,
            xp: data.xp,
          });
        });

        setTasks(userTasks);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#FFD700" style={{marginTop: 50}} />
    );
  }

  const handleToggleCheck = async (task: Task) => {
    if (task.isChecked) return;
    await firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .doc(task.id)
      .update({isChecked: true});

    const userRef = firestore().collection('users').doc(userId);

    await firestore().runTransaction(async transaction => {
      const userDoc = await transaction.get(userRef);
      const xpToAdd = task.xp || 10;

      if (!userDoc.exists) {
        transaction.set(userRef, {
          xp: xpToAdd,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        const currentXp = userDoc.data()?.xp || 0;
        transaction.update(userRef, {
          xp: currentXp + xpToAdd,
        });
      }
    });
  };

  const handleDelete = (taskId: string) => {
    Alert.alert(
      'Görev Silinsin mi?',
      'Bu görevi silmek istediğine emin misin?',
      [
        {text: 'Vazgeç', style: 'cancel'},
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            firestore()
              .collection('users')
              .doc(userId)
              .collection('tasks')
              .doc(taskId)
              .delete();
          },
        },
      ],
    );
  };

  return (
    <ScrollView>
      <TimedTask />
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          title={task.name}
          category={task.category}
          isChecked={task.isChecked}
          dueDate={task.dueDate?.toDate?.()?.toLocaleTimeString()}
          xp={task.xp}
          onToggleCheck={() => handleToggleCheck(task)}
          onDelete={() => handleDelete(task.id)}
        />
      ))}
      <SurpriseTask />
    </ScrollView>
  );
};

export default CardList;
