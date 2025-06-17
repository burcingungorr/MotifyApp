import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

const Clicker = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [xpGiven, setXpGiven] = useState(false);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
  }, [timeLeft, isPlaying]);

  useEffect(() => {
    if (!userId) return;

    if (score == 60 && !xpGiven) {
      const userRef = firestore().collection('users').doc(userId);

      firestore()
        .runTransaction(async transaction => {
          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists) {
            transaction.set(userRef, {
              xp: 10,
              createdAt: firestore.FieldValue.serverTimestamp(),
            });
          } else {
            const currentXp = userDoc.data()?.xp || 0;
            transaction.update(userRef, {xp: currentXp + 10});
          }
        })
        .then(() => {
          setXpGiven(true);
        })
        .catch(err => {
          console.error('Failed to increase XP:', err);
        });
    }
  }, [score, userId, xpGiven]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsPlaying(true);
    setXpGiven(false);
  };

  const handleClick = () => {
    if (isPlaying) {
      setScore(score + 1);
    }
  };

  const endGame = () => {
    setIsPlaying(false);

    Alert.alert('Oyun Bitti!', `Skorunuz: ${score}`, [
      {text: 'Tekrar Dene', onPress: startGame},
      {text: 'Tamam', style: 'cancel'},
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HIZLI TIKLA</Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>SKOR: {score}</Text>
        <Text style={styles.timeText}>SÜRE: {timeLeft}s</Text>
      </View>

      <TouchableOpacity
        style={styles.clickButton}
        onPress={handleClick}
        activeOpacity={0.7}>
        <Text style={styles.buttonText}>
          {isPlaying ? 'TIKLA!' : 'BUTONA BAS!'}
        </Text>
      </TouchableOpacity>

      {!isPlaying && (
        <>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {score > 0 ? 'TEKRAR DENE' : 'BAŞLA'}
            </Text>
          </TouchableOpacity>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Nasıl Oynanır:</Text>
            <Text style={styles.instructionsText}>
              • Başla butonuna bas{'\n'}• 10 saniye içinde olabildiğince çok
              tıkla
              {'\n'}• Süre bitince skorunu gör{'\n'}• Rekorunu kırmaya çalış!
            </Text>
          </View>
        </>
      )}
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
    color: 'white',
    marginBottom: 30,
  },
  scoreContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  timeText: {
    fontSize: 20,
    color: 'black',
    marginVertical: 5,
  },
  clickButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#232870',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  startButton: {
    padding: 15,
    backgroundColor: 'rgb(255, 147, 70)',
    borderRadius: 10,
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginTop: 20,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default Clicker;
