import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {GestureResponderEvent} from 'react-native/Libraries/Types/CoreEventTypes';

export type TitleProps = {
  name: string;
};
export type Task = {
  id: string;
  name: string;
  category: string;
  isChecked: boolean;
  dueDate?: FirebaseFirestoreTypes.Timestamp;
  xp?: number;
};
export type TaskCardProps = {
  title: string;
  category: string;
  isChecked: boolean;
  dueDate?: string;
  xp?: number;
  onToggleCheck?: (event: GestureResponderEvent) => void;
  onDelete?: () => void;
};
export type AddButtonProps = {
  taskName: string;
  category: string;
  onSuccess: () => void;
};

export type TaskInfoProps = {
  taskName: string;
  category: string;
  onTaskNameChange: (name: string) => void;
  onCategoryChange: (category: string) => void;
};
