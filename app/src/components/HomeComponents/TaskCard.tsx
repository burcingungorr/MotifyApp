import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TaskCardProps} from '../../types/home';

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  category,
  isChecked,
  dueDate,
  onToggleCheck,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onToggleCheck} style={styles.checkContainer}>
        <Text style={styles.checkButton}>{isChecked ? '✓' : '○'}</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.category}>Kategori: {category}</Text>
        {dueDate ? (
          <Text style={styles.due}>({dueDate} dakika süresi var.)</Text>
        ) : null}
      </View>

      <View style={styles.xpContainer}>
        <Text style={styles.xpText}>+10 XP</Text>
      </View>

      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Icon
            name="delete-outline"
            size={25}
            color="white"
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 147, 70)',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 10,
    position: 'relative',
  },
  checkContainer: {
    marginRight: 12,
    width: 30,
  },
  checkButton: {
    fontSize: 30,
    color: '#232870',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  category: {
    fontSize: 16,
    color: 'white',
    marginTop: 4,
  },
  due: {
    fontSize: 16,
    color: 'white',
    marginTop: 4,
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
    color: 'rgba(255, 221, 0, 1)',
    fontWeight: 'bold',
    fontSize: 18,
  },
  deleteButton: {
    position: 'absolute',
    top: 45,
    right: 10,
    padding: 5,
  },
  icon: {},
});

export default TaskCard;
