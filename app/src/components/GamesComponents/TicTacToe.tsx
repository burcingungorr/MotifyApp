import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

const TicTacToe = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const checkWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares: any[]) => {
    return squares.every((square: null) => square !== null);
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

  const computerMove = () => {
    const newBoard = [...board];
    const emptySquares = [];

    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === null) {
        emptySquares.push(i);
      }
    }

    if (emptySquares.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptySquares.length);
      const computerChoice = emptySquares[randomIndex];
      newBoard[computerChoice] = 'O';
      setBoard(newBoard);

      const winner = checkWinner(newBoard);
      if (winner) {
        setGameOver(true);
        setTimeout(() => {
          Alert.alert('Oyun Bitti!', 'Kaybettiniz!', [
            {text: 'Tekrar Oyna', onPress: resetGame},
          ]);
        }, 100);
      } else if (isBoardFull(newBoard)) {
        setGameOver(true);
        setTimeout(() => {
          Alert.alert('Oyun Bitti!', 'Berabere!', [
            {text: 'Tekrar Oyna', onPress: resetGame},
          ]);
        }, 100);
      } else {
        setIsPlayerTurn(true);
      }
    }
  };

  const handlePress = (index: number) => {
    if (board[index] !== null || !isPlayerTurn || gameOver) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      if (winner === 'X') {
        addXP(10); // XP ekle
      }
      setTimeout(() => {
        Alert.alert(
          'Oyun Bitti!',
          winner === 'X' ? 'Kazandınız!' : 'Kaybettiniz!',
          [{text: 'Tekrar Oyna', onPress: resetGame}],
        );
      }, 100);
    } else if (isBoardFull(newBoard)) {
      setGameOver(true);
      setTimeout(() => {
        Alert.alert('Oyun Bitti!', 'Berabere!', [
          {text: 'Tekrar Oyna', onPress: resetGame},
        ]);
      }, 100);
    }
  };

  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timer = setTimeout(() => {
        computerMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameOver]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
  };

  const renderSquare = (index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.square}
        onPress={() => handlePress(index)}>
        <Text style={styles.squareText}>{board[index]}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>X - O - X</Text>
      <Text style={styles.subtitle}>
        {gameOver
          ? 'Oyun Bitti'
          : isPlayerTurn
          ? 'Sizin Sıranız (X)'
          : 'Rakibin Sırası (O)'}
      </Text>

      <View style={styles.board}>
        <View style={styles.row}>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </View>
        <View style={styles.row}>
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </View>
        <View style={styles.row}>
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Yeni Oyun</Text>
      </TouchableOpacity>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Nasıl Oynanır:</Text>
        <Text style={styles.instructionsText}>
          • Oyuncular sırayla hamle yapar{'\n'}• Bir oyuncu X, diğeri O
          sembolünü kullanır{'\n'}• Amacınız yatay, dikey veya çapraz 3 sembolü
          birleştirmek
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
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
  },
  board: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 80,
    height: 80,
    backgroundColor: 'rgb(255, 147, 70)',
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  squareText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  resetButton: {
    backgroundColor: '#232870',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  resetButtonText: {
    color: '#fff',
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

export default TicTacToe;
