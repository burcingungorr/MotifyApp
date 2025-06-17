import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';

interface userIdProps {
  userId: string;
  editable?: boolean;
}

const Username: React.FC<userIdProps> = ({userId}) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(
        doc => {
          if (doc.exists()) {
            const data = doc.data();
            setUsername(data?.username || 'Bilinmiyor');
          } else {
            setUsername('Kullanıcı bulunamadı');
          }
          setLoading(false);
        },
        error => {
          console.error('Firestore kullanıcı çekme hatası:', error);
          setUsername('Veri alınamadı');
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [userId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.username}>{username}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Username;
