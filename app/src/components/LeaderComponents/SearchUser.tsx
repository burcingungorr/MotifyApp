import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const avatarSources: {[key: string]: any} = {
  'avatar1.png': require('../../assets/avatars/avatar1.png'),
  'avatar2.png': require('../../assets/avatars/avatar2.png'),
  'avatar3.png': require('../../assets/avatars/avatar3.png'),
  'avatar4.png': require('../../assets/avatars/avatar4.png'),
  'avatar5.png': require('../../assets/avatars/avatar5.png'),
  'avatar6.png': require('../../assets/avatars/avatar6.png'),
  'default.png': require('../../assets/avatars/default.png'),
};

const SearchUser = () => {
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [friendStatus, setFriendStatus] = useState<{[key: string]: string}>({});

  const currentUserId = auth().currentUser?.uid;

  useEffect(() => {
    if (!currentUserId) return;

    const fetchUsersAndStatuses = async () => {
      try {
        const usersSnapshot = await firestore().collection('users').get();

        let fetchedUsers: User[] = usersSnapshot.docs
          .map(doc => ({
            id: doc.id,
            name: doc.data().username || 'Anonim',
            avatar: doc.data().avatar || 'default.png',
            level: doc.data().level || 1,
          }))
          .filter(user => user.id !== currentUserId);

        fetchedUsers = fetchedUsers.sort(() => Math.random() - 0.5);
        setUsers(fetchedUsers);

        const statusObj: {[key: string]: string} = {};

        const friendsSnapshot = await firestore()
          .collection('users')
          .doc(currentUserId)
          .collection('friends')
          .get();

        friendsSnapshot.docs.forEach(doc => {
          statusObj[doc.id] = 'friend';
        });

        const requestsSnapshot = await firestore()
          .collection('users')
          .doc(currentUserId)
          .collection('friendsrequest')
          .get();

        requestsSnapshot.docs.forEach(doc => {
          if (!statusObj[doc.id]) {
            statusObj[doc.id] = 'pending';
          }
        });

        setFriendStatus(statusObj);
      } catch (error) {
        console.error('Kullanıcılar veya durumlar alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndStatuses();
  }, [currentUserId]);

  const sendFriendRequest = async (targetUserId: string) => {
    if (!currentUserId) return;

    if (friendStatus[targetUserId] === 'friend') {
      Alert.alert('Bilgi', 'Bu kullanıcı zaten arkadaşınız.');
      return;
    }
    if (friendStatus[targetUserId] === 'pending') {
      Alert.alert('Bilgi', 'Bu kullanıcıya zaten istek gönderdiniz.');
      return;
    }

    try {
      const requestRef = firestore()
        .collection('users')
        .doc(targetUserId)
        .collection('friendsrequest')
        .doc(currentUserId);

      await requestRef.set({
        status: 'pending',
        timestamp: firestore.FieldValue.serverTimestamp(),
      });

      setFriendStatus(prev => ({...prev, [targetUserId]: 'pending'}));

      Alert.alert(
        'İstek Gönderildi',
        'Arkadaşlık isteği başarıyla gönderildi.',
      );
    } catch (error) {
      console.error('İstek gönderilemedi:', error);
      Alert.alert('Hata', 'İstek gönderilirken bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1B2360" />
      </View>
    );
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={{flex: 1}}>
      <TextInput
        placeholder="Kullanıcı ara..."
        placeholderTextColor="#aaa"
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({item}) => {
          const status = friendStatus[item.id] || 'none';

          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Profil', {
                  screen: 'ProfileMain',
                  params: {userId: item.id},
                })
              }
              style={styles.userCard}>
              <View style={styles.leftSection}>
                <TouchableOpacity
                  onPress={() => sendFriendRequest(item.id)}
                  disabled={status !== 'none'}
                  style={{padding: 6}}>
                  <Icon
                    name={
                      status === 'friend' || status === 'pending'
                        ? 'account-check'
                        : 'account-plus'
                    }
                    size={28}
                    color="white"
                  />
                </TouchableOpacity>

                <Image
                  source={avatarSources[item.avatar]}
                  style={styles.avatar}
                  resizeMode="cover"
                />
                <Text style={styles.name}>{item.name}</Text>
              </View>

              <View style={styles.rightSection}>
                <Icon name="star" size={50} color="#FFD700" />
                <Text style={styles.level}>{item.level}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    fontSize: 16,
    color: '#333',
    elevation: 10,
    margin: 10,
  },
  listContainer: {
    paddingBottom: 16,
    paddingHorizontal: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#fa7720',
    padding: 12,
    borderRadius: 10,
    elevation: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    alignItems: 'center',
    marginLeft: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#1B2360',
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  level: {
    fontSize: 19,
    fontWeight: '600',
    color: 'white',
    position: 'absolute',
    marginTop: 13,
  },
});

export default SearchUser;
