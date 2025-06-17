import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
const UserFriends: React.FC<userIdProps> = ({userId}) => {
  const [friends, setFriends] = useState<User[]>([]);
  const currentUserId = auth().currentUser?.uid;

  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(currentUserId)
      .collection('friends')
      .onSnapshot(async snapshot => {
        const friendIds = snapshot.docs.map(doc => doc.id);

        if (friendIds.length === 0) {
          setFriends([]);
          return;
        }

        try {
          const batches: string[][] = [];
          let idsCopy = [...friendIds];

          while (idsCopy.length) {
            batches.push(idsCopy.splice(0, 10));
          }

          const friendsData: User[] = [];

          for (const batch of batches) {
            const usersSnapshot = await firestore()
              .collection('users')
              .where(firestore.FieldPath.documentId(), 'in', batch)
              .get();

            usersSnapshot.docs.forEach(doc => {
              const data = doc.data();
              friendsData.push({
                id: doc.id,
                name: data.username || 'Anonim',
                avatar: data.avatar || 'default.png',
                level: data.level || 1,
              });
            });
          }

          setFriends(friendsData);
        } catch (error) {
          console.error('Arkadaş bilgileri alınamadı:', error);
        }
      });

    return () => unsubscribe();
  }, [currentUserId]);

  const handleDeleteFriend = (friendId: string) => {
    Alert.alert(
      'Arkadaşı Sil',
      'Bu arkadaşınızı silmek istediğinizden emin misiniz?',
      [
        {text: 'İptal', style: 'cancel'},
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!currentUserId) return;
              await firestore()
                .collection('users')
                .doc(currentUserId)
                .collection('friends')
                .doc(friendId)
                .delete();
            } catch (error) {
              console.error('Arkadaş silinirken hata oluştu:', error);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <FlatList
      data={friends}
      keyExtractor={item => item.id}
      contentContainerStyle={{padding: 10}}
      renderItem={({item}) => (
        <View style={styles.card}>
          <View style={styles.leftSection}>
            <Image
              source={
                avatarSources[item.avatar] || avatarSources['default.png']
              }
              style={styles.avatar}
              resizeMode="cover"
            />
            <Text style={styles.name}>{item.name}</Text>
          </View>

          <View style={styles.rightSection}>
            <Icon name="star" size={50} color="#FFD700" />
            <Text style={styles.level}>{item.level}</Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteFriend(item.id)}>
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz arkadaşınız yok.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fa7720',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  rightSection: {
    alignItems: 'center',
    minWidth: 60,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#1B2360',
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flexShrink: 1,
  },
  level: {
    fontSize: 19,
    fontWeight: '600',
    color: 'white',
    marginTop: 12,
    position: 'absolute',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },

  deleteButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 25,
    lineHeight: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserFriends;
