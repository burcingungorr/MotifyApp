import React, {useState} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserFriends from './UserFriends';
import FollowRequest from './FollowRequest';
import SearchUser from './SearchUser';

const Users = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('userfriend');

  const renderContent = () => {
    switch (selectedTab) {
      case 'userfriend':
        return <UserFriends userId={''} />;
      case 'followrequest':
        return <FollowRequest userId={''} />;
      case 'searchuser':
        return <SearchUser />;
      default:
        return null;
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Icon
          name="account-group"
          size={60}
          color="white"
          style={styles.icon}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === 'userfriend' && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedTab('userfriend')}>
                <Icon
                  name="account-supervisor"
                  size={28}
                  color={selectedTab === 'userfriend' ? '#232870' : 'white'}
                />
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === 'userfriend' && styles.tabTextActive,
                  ]}>
                  Arkadaşlar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === 'followrequest' && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedTab('followrequest')}>
                <Icon
                  name="account-plus"
                  size={28}
                  color={selectedTab === 'followrequest' ? '#232870' : 'white'}
                />
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === 'followrequest' && styles.tabTextActive,
                  ]}>
                  İstekler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === 'searchuser' && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedTab('searchuser')}>
                <Icon
                  name="account-search-outline"
                  size={28}
                  color={selectedTab === 'searchuser' ? '#232870' : 'white'}
                />
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === 'searchuser' && styles.tabTextActive,
                  ]}>
                  Ara
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>{renderContent()}</View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.close}>Kapat</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  icon: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 15,
    backgroundColor: '#1B2360',
    elevation: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '90%',
    backgroundColor: '#1B2360',
    borderRadius: 20,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#1B2360',
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#fa7720',
  },
  tabText: {
    color: 'white',
    marginTop: 4,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#232870',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: '#fa7720',
    margin: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  close: {
    color: '#232870',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
