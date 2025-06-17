import React, {useEffect, useState} from 'react';
import {Text, View, ScrollView, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

interface userIdProps {
  userId: string;
}

const checkOkumaCanavari = async (userId: string): Promise<boolean> => {
  try {
    const tasksSnapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .where('category', '==', 'Zihinsel')
      .where('isChecked', '==', true)
      .get();

    return tasksSnapshot.size >= 10;
  } catch (error) {
    console.error('Okuma Canavarı kontrolünde hata:', error);
    return false;
  }
};

const checkSeriGorevci = async (userId: string): Promise<boolean> => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .where('isChecked', '==', true)
      .get();

    const dates = snapshot.docs
      .map(doc => {
        const date = doc.data().date;
        return date?.toDate ? moment(date.toDate()).format('YYYY-MM-DD') : null;
      })
      .filter(Boolean);

    const uniqueDates = Array.from(new Set(dates)).sort();

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = moment(uniqueDates[i - 1]);
      const curr = moment(uniqueDates[i]);

      if (curr.diff(prev, 'days') === 1) {
        currentStreak += 1;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak >= 5;
  } catch (error) {
    console.error('Seri Görevci kontrolünde hata:', error);
    return false;
  }
};

const checkSurprizAvcisi = async (userId: string): Promise<boolean> => {
  try {
    const docSnap = await firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .doc('dailyTask')
      .get();

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data?.isChecked === true) {
        return true;
      }
    } else {
    }

    return false;
  } catch (error) {
    return false;
  }
};

const checkSporDelisi = async (userId: string): Promise<boolean> => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .where('category', '==', 'Fiziksel')
      .where('isChecked', '==', true)
      .get();

    return snapshot.size >= 10;
  } catch (error) {
    console.error('Spor Delisi kontrolünde hata:', error);
    return false;
  }
};
const checkDisiplinUstadi = async (userId: string): Promise<boolean> => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .where('category', '==', 'Disiplin')
      .where('isChecked', '==', true)
      .get();

    return snapshot.size >= 10;
  } catch (error) {
    console.error('Disiplin Üstadı kontrolünde hata:', error);
    return false;
  }
};

const checkBilgelikYolu = async (userId: string): Promise<boolean> => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .where('category', '==', 'Zihinsel')
      .where('isChecked', '==', true)
      .get();

    return snapshot.size >= 50;
  } catch (error) {
    console.error('Bilgelik Yolu kontrolünde hata:', error);
    return false;
  }
};

const checkSosyalKral = async (userId: string): Promise<boolean> => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .where('category', '==', 'Sosyal')
      .where('isChecked', '==', true)
      .get();

    return snapshot.size >= 10;
  } catch (error) {
    console.error('Sosyal Kral/Kraliçe kontrolünde hata:', error);
    return false;
  }
};
const checkGorevUstasi = async (userId: string): Promise<boolean> => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .where('isChecked', '==', true)
      .get();

    const categoryCounts: {[key: string]: number} = {};

    snapshot.docs.forEach(doc => {
      const category = doc.data().category;
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });

    return Object.values(categoryCounts).every(count => count >= 5);
  } catch (error) {
    console.error('Görev Ustası kontrolünde hata:', error);
    return false;
  }
};

const checkDostCanlisi = async (userId: string): Promise<boolean> => {
  try {
    const friendsSnapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('friends')
      .get();

    return friendsSnapshot.size >= 10;
  } catch (error) {
    console.error('Dost Canlısı kontrolünde hata:', error);
    return false;
  }
};

const checkYeniBaslayan = async (userId: string): Promise<boolean> => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('tasks')
      .where('isChecked', '==', true)
      .limit(1)
      .get();

    return !snapshot.empty; // En az 1 tamamlanmış görev varsa true döner
  } catch (error) {
    console.error('Yeni Başlayan kontrolünde hata:', error);
    return false;
  }
};

const checkElitOyuncu = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await firestore().collection('users').doc(userId).get();

    if (!userDoc.exists) return false;

    const level = userDoc.data()?.level ?? 0;
    return level >= 50;
  } catch (error) {
    console.error('Elit Oyuncu kontrolünde hata:', error);
    return false;
  }
};

const Badges: React.FC<userIdProps> = ({userId}) => {
  const [earnedBadges, setEarnedBadges] = useState<{[key: number]: boolean}>(
    {},
  );

  useEffect(() => {
    const fetchBadges = async () => {
      const okumaEarned = await checkOkumaCanavari(userId);
      const seriEarned = await checkSeriGorevci(userId);
      const surprizeEarned = await checkSurprizAvcisi(userId);
      const sporDelisiEarned = await checkSporDelisi(userId);
      const disiplinEarned = await checkDisiplinUstadi(userId);
      const bilgelikEarned = await checkBilgelikYolu(userId);
      const sosyalEarned = await checkSosyalKral(userId);
      const gorevUstasiEarned = await checkGorevUstasi(userId);
      const yeniBaslayanEarned = await checkYeniBaslayan(userId);
      const elitOyuncuEarned = await checkElitOyuncu(userId);
      const dostCanlisiEarned = await checkDostCanlisi(userId);

      setEarnedBadges({
        1: okumaEarned,
        2: seriEarned,
        3: surprizeEarned,
        4: sporDelisiEarned,
        5: disiplinEarned,
        6: bilgelikEarned,
        7: sosyalEarned,
        8: gorevUstasiEarned,
        9: dostCanlisiEarned,
        10: yeniBaslayanEarned,
        11: elitOyuncuEarned,
      });
    };

    fetchBadges();
  }, [userId]);

  const badges: Badge[] = [
    {
      id: 1,
      name: 'Okuma Canavarı',
      icon: '📚',
      description: '10 kere "Zeka" kategorisinde görev tamamla',
      earned: earnedBadges[1] ?? false,
    },
    {
      id: 2,
      name: 'Seri Görevci',
      icon: '🔥',
      description: '5 gün arka arkaya herhangi bir görev tamamla',
      earned: earnedBadges[2] ?? false,
    },
    {
      id: 3,
      name: 'Sürpriz Avcısı',
      icon: '🎁',
      description: '1 sürpriz görev başarıyla tamamla',
      earned: earnedBadges[3] ?? false,
    },
    {
      id: 4,
      name: 'Spor Delisi',
      icon: '💪',
      description: '10 kere fiziksel görev tamamla',
      earned: earnedBadges[4] ?? false,
    },
    {
      id: 5,
      name: 'Disiplin Üstadı',
      icon: '🎯',
      description: '10 “Disiplin” görevi tamamla',
      earned: earnedBadges[5] ?? false,
    },
    {
      id: 6,
      name: 'Bilgelik Yolu',
      icon: '🦉',
      description: '50 kere "Zeka" kategorisinde görev tamamla',
      earned: earnedBadges[6] ?? false,
    },
    {
      id: 7,
      name: 'Sosyal Kral/Kraliçe',
      icon: '💬',
      description: '10 kere sosyal görev tamamla',
      earned: earnedBadges[7] ?? false,
    },
    {
      id: 8,
      name: 'Görev Ustası',
      icon: '🎖️',
      description: 'Tüm kategorilerde en az 5 görev tamamla',
      earned: earnedBadges[8] ?? false,
    },
    {
      id: 9,
      name: 'Dost Canlısı',
      icon: '🤝',
      description: '5 arkadaş ekle',
      earned: earnedBadges[9] ?? false,
    },
    {
      id: 10,
      name: 'Yeni Başlayan',
      icon: '🎉',
      description: 'İlk görevini başarıyla tamamla',
      earned: earnedBadges[10] ?? false,
    },
    {
      id: 11,
      name: 'Elit Oyuncu',
      icon: '🏆',
      description: 'Seviye 50’ye ulaş',
      earned: earnedBadges[11] ?? false,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rozetler</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {badges.map(badge => (
          <View
            key={badge.id}
            style={[
              styles.badgeContainer,
              !badge.earned && styles.lockedBadge,
            ]}>
            <Text style={styles.badgeIcon}>{badge.icon}</Text>
            <Text style={styles.badgeName}>{badge.name}</Text>
            {!badge.earned && (
              <View style={styles.lockOverlay}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  scrollContainer: {
    paddingRight: 15,
  },
  badgeContainer: {
    width: 130,
    height: 120,
    backgroundColor: '#1B2360',
    borderRadius: 12,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    position: 'relative',
  },
  lockedBadge: {
    backgroundColor: '#f5f5f5',
  },
  badgeIcon: {
    fontSize: 30,
    marginBottom: 5,
    borderWidth: 4,
    borderColor: '#fa7720',
    borderRadius: 25,
    padding: 10,
  },
  badgeName: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 5,
    fontWeight: '500',
    color: 'white',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  lockIcon: {
    fontSize: 45,
    opacity: 0.7,
  },
});

export default Badges;
