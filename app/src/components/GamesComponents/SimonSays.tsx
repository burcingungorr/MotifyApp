import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

const colors = [
  '#1B2360',
  'rgb(255, 147, 70)',
  'rgb(233, 55, 24)',
  'rgba(255, 221, 0, 0.88)',
];

const SimonSays = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const startGame = () => {
    setSequence([]);
    setUserSequence([]);
    setLevel(1);
    setIsPlaying(true);
    generateNextSequence([]);
  };

  const generateNextSequence = (prevSequence = sequence) => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [...prevSequence, newColor];
    setSequence(newSequence);
    playSequence(newSequence);
  };

  const playSequence = (seq: string[]) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(interval);
        setActiveColor(null);
        return;
      }
      setActiveColor(seq[i]);
      setTimeout(() => setActiveColor(null), 500);
      i++;
    }, 800);
  };

  const handleColorPress = (color: string) => {
    if (!isPlaying || activeColor) return;

    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    if (sequence[newUserSequence.length - 1] !== color) {
      gameOver();
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setUserSequence([]);
      const nextLevel = level + 1;
      setLevel(nextLevel);
      addXP(5);
      setTimeout(() => generateNextSequence(sequence), 1000);
    }
  };

  const addXP = (amount: number) => {
    if (!userId) return;
    const userRef = firestore().collection('users').doc(userId);

    firestore()
      .runTransaction(async transaction => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          transaction.set(userRef, {
            xp: amount,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        } else {
          const currentXp = userDoc.data()?.xp || 0;
          transaction.update(userRef, {xp: currentXp + amount});
        }
      })
      .catch(err => console.log('XP eklenemedi:', err));
  };

  const gameOver = () => {
    Alert.alert('Oyun Bitti!', `Skorunuz: ${level - 1}`, [
      {text: 'Tekrar Dene', onPress: startGame},
    ]);
    setIsPlaying(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Renk Kutuları</Text>
      <Text style={styles.levelText}>Seviye: {level}</Text>

      <View style={styles.gameArea}>
        {colors.map(color => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              {backgroundColor: color},
              activeColor === color && styles.activeButton,
            ]}
            onPress={() => handleColorPress(color)}
            disabled={!isPlaying}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.startButton} onPress={startGame}>
        <Text style={styles.startButtonText}>Yeni Oyun</Text>
      </TouchableOpacity>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Nasıl Oynanır:</Text>
        <Text style={styles.instructionsText}>
          • Gösterilen renk sırasını takip et{'\n'}• Her seviye daha uzun bir
          sıra içerir{'\n'}• Doğru takip et, XP kazan!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fa7720',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 50,
    color: 'white',
  },
  gameArea: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButton: {
    width: 140,
    height: 140,
    margin: 5,
    borderRadius: 10,
    elevation: 10,
  },
  activeButton: {
    opacity: 1,
    transform: [{scale: 1.05}],
  },
  levelText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
  },
  startButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#1B2360',
    borderRadius: 10,
    elevation: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    marginTop: 50,
    elevation: 10,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  instructionsText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
});

export default SimonSays;
