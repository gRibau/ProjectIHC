import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const options = [
  { id: 'profile', label: 'Perfile', icon: 'user', route: '/profile', image: require('../../assets/images/Default_pfp.jpg') },
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
              source={item.image}  // `require()` will handle the image source correctly
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
    backgroundColor: '#fff', // Row background default to white
  },
  profileRow: {
    backgroundColor: '#fff', // Change profile row background back to white
    borderBottomWidth: 1, // Remove the border on the profile row
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes the image circular
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
    fontSize: 20, // Make profile text larger
    fontWeight: 'bold', // Bold the profile label
    color: '#2A4D9B', // Make it standout color (blue)
  },
});

