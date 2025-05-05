import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

export default function ScheduleDetail() {
  const router = useRouter();
  const { id } = router.query;

  // Fake schedule data for Line 20
  const scheduleData = {
    '20': [
      { time: '08:00 AM', destination: 'Aveiro' },
      { time: '09:00 AM', destination: 'Vagos' },
      { time: '10:00 AM', destination: 'Cantanhede' },
      { time: '11:00 AM', destination: 'Praia de Mira' },
      { time: '12:00 PM', destination: 'Aveiro' },
      { time: '01:00 PM', destination: 'Vagos' },
    ],
  };

  // Get the schedule for the requested line
  const schedule = scheduleData[id] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule for Line {id}</Text>
      <FlatList
        data={schedule}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleTime}>{item.time}</Text>
            <Text style={styles.scheduleDestination}>{item.destination}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scheduleTime: {
    fontSize: 18,
    color: '#333',
  },
  scheduleDestination: {
    fontSize: 18,
    color: '#555',
  },
});
