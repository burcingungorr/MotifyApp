import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');

export const MemoryMatch = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [timeLeft, setTimeLeft] = useState(50);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const userId = useSelector((state: any) => state.auth.userId);

  const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];

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

  const initializeGame = () => {
    const gameCards = [...symbols, ...symbols]
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setGameWon(false);
    setShowInstructions(true);
    setTimeLeft(50);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
  };

  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !gameWon) {
      if (matchedCards.length === cards.length) {
        setGameWon(true);
        addXP(10);
        Alert.alert(
          'Süre doldu!',
          'Tebrikler! Tüm kartları eşleştirdiniz. +10 XP',
        );
      } else {
        Alert.alert('Süre doldu!', 'Süre bitti, tekrar deneyin.');
      }
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [timeLeft]);

  const flipCard = (cardId: number) => {
    if (flippedCards.length === 2 || gameWon || timeLeft === 0) return;
    if (flippedCards.includes(cardId) || matchedCards.includes(cardId)) return;

    if (showInstructions) {
      setShowInstructions(false);
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      checkMatch(newFlippedCards);
    }
  };

  const checkMatch = (flippedCardIds: number[]) => {
    const [firstCard, secondCard] = flippedCardIds.map(id =>
      cards.find(card => card.id === id),
    );

    if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
      setTimeout(() => {
        const newMatched = [...matchedCards, ...flippedCardIds];
        setMatchedCards(newMatched);
        setFlippedCards([]);

        if (newMatched.length === cards.length) {
          setGameWon(true);
          if (timerRef.current) clearInterval(timerRef.current);
          addXP(10);
          setTimeout(() => {
            Alert.alert('Tebrikler!', `Oyunu tamamladınız! +10 XP`, [
              {text: 'Yeni Oyun', onPress: initializeGame},
            ]);
          }, 500);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  };

  const renderCard = (card: Card) => {
    const isFlipped =
      flippedCards.includes(card.id) || matchedCards.includes(card.id);

    return (
      <TouchableOpacity
        key={card.id}
        style={[
          styles.card,
          isFlipped ? styles.flippedCard : styles.hiddenCard,
          matchedCards.includes(card.id) && styles.matchedCard,
        ]}
        onPress={() => flipCard(card.id)}
        disabled={isFlipped || gameWon || timeLeft === 0}>
        <Text style={styles.cardText}>{isFlipped ? card.symbol : '?'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hafıza Patlat</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Eşleşen: {matchedCards.length / 2}/{symbols.length}
        </Text>
        <Text style={styles.statsText}>Süre: {timeLeft}s</Text>
      </View>

      <View style={styles.gameBoard}>
        {cards.map(card => renderCard(card))}
      </View>

      <TouchableOpacity style={styles.newGameButton} onPress={initializeGame}>
        <Text style={styles.newGameButtonText}>Yeni Oyun</Text>
      </TouchableOpacity>

      {showInstructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Nasıl Oynanır:</Text>
          <Text style={styles.instructionsText}>
            • İki kartı çevirin{'\n'}• Aynı sembolleri eşleştirin{'\n'}• En az
            hamlede tamamlayıp XP kazanın
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa7720',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 40,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  statsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  gameBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 40,
    marginBottom: 30,
  },
  card: {
    width: (width - 80) / 4 - 10,
    height: (width - 80) / 4 - 10,
    margin: 5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  hiddenCard: {
    backgroundColor: '#232870',
  },
  flippedCard: {
    backgroundColor: '#ffffff',
  },
  matchedCard: {
    backgroundColor: '#2ecc71',
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  newGameButton: {
    backgroundColor: 'rgb(255, 147, 70)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 10,
  },
  newGameButtonText: {
    color: '#ffffff',
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

export default MemoryMatch;
