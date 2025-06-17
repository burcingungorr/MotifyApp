import React, {useEffect, useState} from 'react';
import {Text, View, ScrollView, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';

interface StatsProps {
  userId: string;
}

const Stats: React.FC<StatsProps> = ({userId}) => {
  const [statCounts, setStatCounts] = useState<Record<CategoryName, number>>({
    Fiziksel: 0,
    Sosyal: 0,
    Zihinsel: 0,
    Disiplin: 0,
  });

  useEffect(() => {
    if (!userId) return;

    const categoryMap: Record<string, CategoryName> = {
      fiziksel: 'Fiziksel',
      sosyal: 'Sosyal',
      zihinsel: 'Zihinsel',
      disiplin: 'Disiplin',
    };

    const unsubscribe = firestore()
      .collection(`users/${userId}/tasks`)
      .where('isChecked', '==', true)
      .onSnapshot(
        snapshot => {
          const counts: Record<CategoryName, number> = {
            Fiziksel: 0,
            Sosyal: 0,
            Zihinsel: 0,
            Disiplin: 0,
          };

          snapshot.forEach(doc => {
            const data = doc.data() as TaskData;
            const rawCategory = data.category?.toLowerCase().trim();
            const category = rawCategory ? categoryMap[rawCategory] : undefined;

            if (category) {
              counts[category]++;
            }
          });

          setStatCounts(counts);
        },
        error => {
          console.error('İstatistikler alınırken hata:', error);
          // İstersen hata durumunu kullanıcıya göstermek için de state ekleyebilirsin
        },
      );

    return () => unsubscribe();
  }, [userId]);

  const stats: {id: number; name: CategoryName; icon: string; color: string}[] =
    [
      {id: 1, name: 'Fiziksel', icon: '💪', color: '#1B2360'},
      {id: 2, name: 'Sosyal', icon: '💬', color: 'rgb(255, 147, 70)'},
      {id: 3, name: 'Zihinsel', icon: '🧠', color: 'rgb(233, 55, 24)'},
      {id: 4, name: 'Disiplin', icon: '⏱️', color: 'rgba(255, 221, 0, 0.88)'},
    ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İstatistikler</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {stats.map(stat => (
          <View
            key={stat.id}
            style={[styles.statCard, {backgroundColor: stat.color}]}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={styles.statName}>{stat.name}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.statValue}>{statCounts[stat.name] || 0}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 15,
    marginBottom: 10,
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
  statCard: {
    width: 100,
    height: 130,
    marginRight: 15,
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    elevation: 10,
  },
  statIcon: {
    fontSize: 28,
    marginTop: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  statName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default Stats;
