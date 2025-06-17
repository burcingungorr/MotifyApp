import React, {useEffect, useState} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

import HomeScreen from '../screens/HomeScreen';
import GamesScreen from '../screens/GamesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import TicTacToe from '../components/GamesComponents/TicTacToe';
import Clicker from '../components/GamesComponents/Clicker';
import {MemoryMatch} from '../components/GamesComponents/MemoryMatch';
import SimonSays from '../components/GamesComponents/SimonSays';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import {logout} from '../redux/slices/authSlice';
import {setXP} from '../redux/slices/xpSlice';
import splash from '../assets/logo/splash.png';
import Logo from '../components/Logo';

const SplashScreen = () => (
  <View style={styles.splashContainer}>
    <Image source={splash} style={styles.splashLogo} />
  </View>
);

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const drawerItems = [
  {label: 'Görevler', icon: 'format-list-bulleted', route: 'Anasayfa'},
  {label: 'Oyunlar', icon: 'gamepad-variant-outline', route: 'Oyunlar'},
  {label: 'Liderlik', icon: 'trophy-outline', route: 'Liderlik'},
  {label: 'Profil', icon: 'account-outline', route: 'Profil'},
];

function CustomDrawerContent({navigation}: any) {
  const dispatch = useDispatch();

  return (
    <DrawerContentScrollView>
      <Logo />
      {drawerItems.map(({label, icon, route}) => (
        <DrawerItem
          key={route}
          label={label}
          labelStyle={styles.drawerLabel}
          icon={({size}) => (
            <MaterialCommunityIcons name={icon} color="#FF6B00" size={35} />
          )}
          onPress={() => {
            if (route === 'Profil') {
              navigation.navigate('Profil', {
                screen: 'ProfileMain',
                params: {userId: null},
              });
            } else {
              navigation.navigate(route);
            }
          }}
        />
      ))}

      <View style={styles.logoutButton}>
        <DrawerItem
          label="Çıkış Yap"
          labelStyle={styles.drawerLabel}
          icon={({size}) => (
            <MaterialCommunityIcons name="logout" color="#FF6B00" size={35} />
          )}
          onPress={() => {
            dispatch(logout());
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const createStack = ({initialRouteName, screens}: any) => (
  <Stack.Navigator
    initialRouteName={initialRouteName}
    screenOptions={{headerShown: false}}>
    {screens.map(({name, component}: any) => (
      <Stack.Screen key={name} name={name} component={component} />
    ))}
  </Stack.Navigator>
);

const HomeStack = () =>
  createStack({
    initialRouteName: 'HomeMain',
    screens: [
      {name: 'HomeMain', component: HomeScreen},
      {name: 'AddTaskScreen', component: AddTaskScreen},
    ],
  });

const GamesStack = () =>
  createStack({
    initialRouteName: 'GamesMain',
    screens: [
      {name: 'GamesMain', component: GamesScreen},
      {name: 'tictactoe', component: TicTacToe},
      {name: 'clicker', component: Clicker},
      {name: 'memorymatch', component: MemoryMatch},
      {name: 'simonsays', component: SimonSays},
    ],
  });

const LeaderBoardStack = () =>
  createStack({
    initialRouteName: 'LeaderBoardMain',
    screens: [{name: 'LeaderBoardMain', component: LeaderBoardScreen}],
  });

const ProfileStack = () =>
  createStack({
    initialRouteName: 'ProfileMain',
    screens: [{name: 'ProfileMain', component: ProfileScreen}],
  });

const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

export const MenuButton = ({navigation}: any) => (
  <TouchableOpacity
    onPress={() => navigation.openDrawer()}
    style={styles.menuButton}>
    <Icon name="menu" size={28} color="white" />
  </TouchableOpacity>
);

export default function AppNavigator() {
  const {isLoggedIn, user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const userId = user?.uid;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(snapshot => {
        const data = snapshot.data();
        if (data?.xp !== undefined) {
          dispatch(setXP(data.xp));
        }
      });
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Drawer.Navigator
          screenOptions={{
            headerShown: false,
            drawerStyle: {backgroundColor: '#1B2360'},
          }}
          drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Anasayfa" component={HomeStack} />
          <Drawer.Screen name="Oyunlar" component={GamesStack} />
          <Drawer.Screen name="Liderlik" component={LeaderBoardStack} />
          <Drawer.Screen name="Profil" component={ProfileStack} />
        </Drawer.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B2360',
  },
  splashLogo: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: '50%',
    height: 160,
    borderRadius: 50,
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 250,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#020b4d',
  },
  menuButton: {
    marginTop: 40,
    marginLeft: 15,
    position: 'absolute',
    zIndex: 10,
  },
  drawerLabel: {
    color: '#FF6B00',
    fontSize: 18,
  },
});
