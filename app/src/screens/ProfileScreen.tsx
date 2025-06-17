import React, {useEffect, useState} from 'react';
import Title from '../components/Title';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import {MenuButton} from '../navigation/AppNavigator';
import AvatarSelector from '../components/ProfileComponents/UserAvatar';
import UserLevel from '../components/ProfileComponents/UserLevel';
import Badges from '../components/ProfileComponents/Badges';
import Username from '../components/ProfileComponents/Username';
import Stats from '../components/ProfileComponents/Stats';

type ProfileRouteProp = RouteProp<{Profil: {userId?: string}}, 'Profil'>;

const ProfileScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<ProfileRouteProp>();
  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  useEffect(() => {
    console.log('Gelen route params:', route.params);
  }, [route.params]);
  useEffect(() => {
    const currentUserId = auth().currentUser?.uid || null;
    const routeUserId = route.params?.userId;

    if (routeUserId && routeUserId !== currentUserId) {
      setProfileUserId(routeUserId);
      setIsOwnProfile(false);
    } else {
      setProfileUserId(currentUserId);
      setIsOwnProfile(true);
    }
  }, [route.params?.userId]);

  if (!profileUserId) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isOwnProfile && <MenuButton navigation={navigation} />}

      <Title name={isOwnProfile ? 'Profilim' : 'Kullanıcı Profili'} />
      <AvatarSelector userId={profileUserId} editable={isOwnProfile} />
      <Username userId={profileUserId} editable={isOwnProfile} />
      <UserLevel userId={profileUserId} />
      <Badges userId={profileUserId} />
      <Stats userId={profileUserId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa7720',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
