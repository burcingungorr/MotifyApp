import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const avatarSources: {[key: string]: any} = {
  'avatar1.png': require('../../assets/avatars/avatar1.png'),
  'avatar2.png': require('../../assets/avatars/avatar2.png'),
  'avatar3.png': require('../../assets/avatars/avatar3.png'),
  'avatar4.png': require('../../assets/avatars/avatar4.png'),
  'avatar5.png': require('../../assets/avatars/avatar5.png'),
  'avatar6.png': require('../../assets/avatars/avatar6.png'),
  'default.png': require('../../assets/avatars/default.png'),
};
interface userIdProps {
  userId: string;
}
const FollowRequest: React.FC<userIdProps> = ({userId}) => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const currentUserId = auth().currentUser?.uid;

  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(currentUserId)
      .collection('friendsrequest')
      .onSnapshot(async snapshot => {
        const data = await Promise.all(
          snapshot.docs.map(async doc => {
            const requesterId = doc.id;
            const userDoc = await firestore()
              .collection('users')
              .doc(requesterId)
              .get();
            const userData = userDoc.exists() ? userDoc.data() : null;

            return {
              id: requesterId,
              username: userData?.username || 'Anonim',
              avatar: userData?.avatar || 'default.png',
            };
          }),
        );
        setRequests(data);
      });

    return () => unsubscribe();
  }, [currentUserId]);

  const acceptRequest = async (requesterId: string) => {
    if (!currentUserId) return;

    try {
      const batch = firestore().batch();

      const requesterRef = firestore()
        .collection('users')
        .doc(currentUserId)
        .collection('friends')
        .doc(requesterId);

      const currentRef = firestore()
        .collection('users')
        .doc(requesterId)
        .collection('friends')
        .doc(currentUserId);

      batch.set(requesterRef, {
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
      batch.set(currentRef, {
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      const requestRef = firestore()
        .collection('users')
        .doc(currentUserId)
        .collection('friendsrequest')
        .doc(requesterId);

      batch.delete(requestRef);

      await batch.commit();
    } catch (error) {
      console.error('İstek onaylanamadı:', error);
      Alert.alert('Hata', 'İstek onaylanırken hata oluştu.');
    }
  };

  const rejectRequest = async (requesterId: string) => {
    if (!currentUserId) return;

    try {
      await firestore()
        .collection('users')
        .doc(currentUserId)
        .collection('friendsrequest')
        .doc(requesterId)
        .delete();

      Alert.alert('İstek Reddedildi');
    } catch (error) {
      console.error('İstek reddedilemedi:', error);
      Alert.alert('Hata', 'İstek reddedilirken hata oluştu.');
    }
  };

  return (
    <FlatList
      data={requests}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.card}>
          <View style={styles.leftSection}>
            <Image
              source={avatarSources[item.avatar || 'default.png']}
              style={styles.avatar}
            />
            <Text style={styles.text}>
              <Text style={{fontWeight: 'bold'}}>
                {item.username || 'Anonim'}
              </Text>{' '}
              arkadaşlık isteği gönderdi.
            </Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => acceptRequest(item.id)}
              style={[styles.button]}>
              <Text style={styles.buttonText}>Kabul Et</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => rejectRequest(item.id)}
              style={[styles.button]}>
              <Text style={styles.buttonText}>Reddet</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz istek yok.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fa7720',
    marginBottom: 10,
    borderRadius: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#1B2360',
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    color: 'white',
    flexShrink: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});

export default FollowRequest;
