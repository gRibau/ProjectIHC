import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const lines = [
  { id: '15', name: 'Esgueira ↔ S. Bernardo' },
  { id: '16', name: 'Gafanha Naz. ↔ Ílhavo' },
  { id: '17', name: 'Aveiro ↔ Ovar' },
  { id: '18', name: 'Aveiro ↔ Vagos' },
  { id: '19', name: 'Aveiro ↔ Cantanhede' },
  { id: '20', name: 'Aveiro ↔ Praia de Mira' },
];

export const meta = {
  title: 'Lines',
};

export default function SchedulesScreen() {
  const router = useRouter();

  const handleLinePress = (id: string) => {
    router.push(`/schedules/schedule`);
  };

  return (
    <FlatList
      data={lines}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleLinePress(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.lineBox}>
            <Text style={styles.lineId}>{item.id}</Text>
          </View>
          <Text style={styles.lineName}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  lineBox: {
    backgroundColor: '#E3E9FF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 12,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2A4D9B',
  },
  lineName: {
    fontSize: 16,
    color: '#222',
  },
});
