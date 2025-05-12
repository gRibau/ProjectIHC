import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const options = [
  { id: 'profile', label: 'Perfil', icon: 'user', route: '/profile', image: require('../../assets/images/Default_pfp.jpg') },
  { id: 'settings', label: 'Definições', icon: 'cog', route: '/settings' },
  { id: 'schedules', label: 'Horários', icon: 'calendar', route: '/schedules/scheduleScreen'},
  { id: 'help', label: 'Ajuda', icon: 'question-circle', route: '/help' },
  { id: 'about', label: 'Sobre', icon: 'info-circle', route: '/about' },
];

export default function MoreScreen() {
  const handlePress = (route: string) => {
    router.push(route);
  };

  return (
    <FlatList
      ListHeaderComponent={<View style={styles.fakeHeader} />}
      data={options}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.row, item.id === 'profile' && styles.profileRow]}
          onPress={() => handlePress(item.route)}
          activeOpacity={0.7}
        >
          {item.id === 'profile' ? (
            <Image
              source={item.image}
              style={styles.profileImage}
            />
          ) : (
            <FontAwesome name={item.icon} size={20} color="#2A4D9B" style={styles.icon} />
          )}
          <Text style={[styles.label, item.id === 'profile' && styles.profileLabel]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  fakeHeader: {
    height: Platform.OS === 'ios' ? 44 : 56,
    backgroundColor: '#fff', // Same background as rest of the screen
  },
  container: {
    paddingVertical: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  profileRow: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  icon: {
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  profileLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A4D9B',
  },
});
