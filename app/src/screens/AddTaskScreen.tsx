import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Title from '../components/Title';
import TaskInfo from '../components/AddTaskScreenComponents/TaskInfo';
import AddButton from '../components/AddTaskScreenComponents/AddButton';

const AddTaskScreen = () => {
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState('');

  return (
    <View style={styles.container}>
      <Title name="Görev Ekle" />
      <TaskInfo
        taskName={taskName}
        category={category}
        onTaskNameChange={setTaskName}
        onCategoryChange={setCategory}
      />

      <AddButton
        taskName={taskName}
        category={category}
        onSuccess={() => {
          setTaskName('');
          setCategory('');
        }}
      />
    </View>
  );
};

export default AddTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa7720',
  },
});
