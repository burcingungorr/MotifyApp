import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {TaskInfoProps} from '../../types/home';

const TaskInfo = ({
  taskName,
  category,
  onTaskNameChange,
  onCategoryChange,
}: TaskInfoProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(category);
  const [motivation, setMotivation] = useState('');

  const categories = [
    {id: 1, name: 'Fiziksel', icon: '💪', color: '#1B2360'},
    {id: 2, name: 'Sosyal', icon: '💬', color: 'rgb(255, 147, 70)'},
    {id: 3, name: 'Zihinsel', icon: '🧠', color: 'rgb(233, 55, 24)'},
    {id: 4, name: 'Disiplin', icon: '⏱️', color: 'rgba(255, 221, 0, 0.88)'},
  ];

  const motivationalQuotes = [
    'Her görev seni daha güçlü yapar. ',
    'Küçük adımlar büyük farklar yaratır. ',
    'Disiplin başarıyı getirir. ',
    'Bugünün işi yarına kalmasın. ',
    'Başlamak bitirmenin yarısıdır. ',
  ];

  useEffect(() => {
    const randomQuote =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setMotivation(randomQuote);
  }, [category]);

  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category.name);
    onCategoryChange(category.name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.motivation}>{motivation}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Görev</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Görev adını giriniz..."
          value={taskName}
          onChangeText={onTaskNameChange}
          placeholderTextColor="white"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Kategori Seç</Text>
        <View style={styles.categoryRow}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryBox,
                selectedCategory === category.name && {
                  backgroundColor: 'rgba(255, 221, 0, 0.88)',
                },
              ]}
              onPress={() => handleCategorySelect(category)}>
              <Text style={[styles.categoryIcon, {fontSize: 22}]}>
                {category.icon}
              </Text>
              <Text
                style={[
                  styles.categoryName,
                  selectedCategory === category.name && {
                    color: 'white',
                  },
                ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
  },
  motivation: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 80,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#232870',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
    height: 50,
    elevation: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryBox: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '22%',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 12,
    backgroundColor: '#232870',
    elevation: 5,
  },
  categoryIcon: {
    marginBottom: 4,
    color: 'white',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
});

export default TaskInfo;
