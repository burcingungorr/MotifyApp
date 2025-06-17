import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
} from 'react-native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {RootState} from '../../redux/store';

const avatars = [
  {name: 'avatar1.png', source: require('../../assets/avatars/avatar1.png')},
  {name: 'avatar2.png', source: require('../../assets/avatars/avatar2.png')},
  {name: 'avatar3.png', source: require('../../assets/avatars/avatar3.png')},
  {name: 'avatar4.png', source: require('../../assets/avatars/avatar4.png')},
  {name: 'avatar5.png', source: require('../../assets/avatars/avatar5.png')},
  {name: 'avatar6.png', source: require('../../assets/avatars/avatar6.png')},
  {name: 'default.png', source: require('../../assets/avatars/default.png')},
];

interface UserIdProps {
  userId: string;
  editable?: boolean;
}

const AvatarSelector: React.FC<UserIdProps> = ({userId, editable = false}) => {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.uid);
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[6].source); // default
  const [isSelectorVisible, setSelectorVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(
        doc => {
          const avatarName = doc.data()?.avatar;
          const found = avatars.find(a => a.name === avatarName);
          if (found) {
            setSelectedAvatar(found.source);
          } else {
            setSelectedAvatar(avatars[6].source);
          }
        },
        error => {
          console.error('Avatar alınırken hata:', error);
        },
      );

    return () => unsubscribe();
  }, [userId]);

  const handleAvatarPress = () => {
    if (editable) {
      setSelectorVisible(true);
    }
  };

  const handleSelect = async (avatarName: string) => {
    if (!editable || currentUserId !== userId) return;

    const avatar = avatars.find(a => a.name === avatarName);
    if (!avatar) return;

    try {
      await firestore().collection('users').doc(userId).update({
        avatar: avatar.name,
      });
      setSelectedAvatar(avatar.source);
      setSelectorVisible(false);
    } catch (error) {
      console.error('Avatar güncellenemedi:', error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={handleAvatarPress} disabled={!editable}>
        <Image source={selectedAvatar} style={styles.mainAvatar} />
      </TouchableOpacity>

      <Modal visible={isSelectorVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Avatarını seç</Text>
            <View style={styles.avatarContainer}>
              {avatars.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelect(avatar.name)}>
                  <Image
                    source={avatar.source}
                    style={[
                      styles.avatar,
                      selectedAvatar === avatar.source && styles.selectedAvatar,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setSelectorVisible(false)}>
              <Text style={styles.closeText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: 20,
    elevation: 10,
  },
  mainAvatar: {
    width: 130,
    height: 130,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#1B2360',
    elevation: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1B2360',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    elevation: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    margin: 10,
    borderWidth: 2,
    borderColor: '#1B2360',
    elevation: 10,
  },
  selectedAvatar: {
    borderColor: '#87CEFA',
  },
  closeText: {
    marginTop: 10,
    color: 'white',
    backgroundColor: '#fa7720',
    fontSize: 16,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    elevation: 10,
  },
});

export default AvatarSelector;
