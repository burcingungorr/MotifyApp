import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const avatarSources: {[key: string]: any} = {
  'avatar1.png': require('../../assets/avatars/avatar1.png'),
  'avatar2.png': require('../../assets/avatars/avatar2.png'),
  'avatar3.png': require('../../assets/avatars/avatar3.png'),
  'avatar4.png': require('../../assets/avatars/avatar4.png'),
  'avatar5.png': require('../../assets/avatars/avatar5.png'),
  'avatar6.png': require('../../assets/avatars/avatar6.png'),
  'default.png': require('../../assets/avatars/default.png'),
};

const LeaderTable = () => {
  const [topPlayers, setTopPlayers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const snapshot = await firestore()
          .collection('users')
          .orderBy('level', 'desc')
          .limit(5)
          .get();

        const fetched = snapshot.docs.map((doc, index) => ({
          id: doc.id,
          name: doc.data().username || `Oyuncu${index + 1}`,
          level: doc.data().level || 1,
          avatar: doc.data().avatar || 'default.png', // avatar adı olarak geliyor
        }));

        setTopPlayers(fetched);
      } catch (error) {
        console.error('Lider tablosu verileri alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPlayers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4D96FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={topPlayers}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Image
              source={
                avatarSources[item.avatar] || avatarSources['default.png']
              }
              style={styles.avatar}
            />
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.levelContainer}>
              <Text style={styles.levelText}>Lv. {item.level}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default LeaderTable;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 20,
    backgroundColor: '#1B2360',
    borderRadius: 10,
    elevation: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rank: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  levelContainer: {
    backgroundColor: '#4D96FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
