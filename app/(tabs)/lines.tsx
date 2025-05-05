import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useActiveLines } from '../../context/ActiveLinesContext';
import { useFavourites } from '../../context/FavouritesContext';
import { router } from 'expo-router';
import { ROUTE_COLORS } from '../../components/LiveMap';

const lines = [
  { id: '15', name: 'Esgueira ↔ S. Bernardo' },
  { id: '16', name: 'Gafanha Naz. ↔ Ílhavo' },
  { id: '17', name: 'Aveiro ↔ Ovar' },
  { id: '18', name: 'Aveiro ↔ Vagos' },
  { id: '19', name: 'Aveiro ↔ Cantanhede' },
  { id: '20', name: 'Aveiro ↔ Praia de Mira' },
];

export default function LinesScreen() {
  const { activeLines, setActiveLines } = useActiveLines();
  const { favouriteLines, toggleFavouriteLine } = useFavourites();

  const toggleLine = (id: string) => {
    setActiveLines((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleRowPress = (id: string) => {
    if (!activeLines.includes(id)) {
      setActiveLines((prev) => [...prev, id]);
    }
    router.replace(`/?line=${id}`);
  };

  return (
    <FlatList
      data={lines}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Switch
            value={activeLines.includes(item.id)}
            onValueChange={() => toggleLine(item.id)}
          />
          <TouchableOpacity
            style={[styles.lineBox, { backgroundColor: (ROUTE_COLORS[item.id] ? `${ROUTE_COLORS[item.id]}4D` : '#E3E9FF') }]}
            onPress={() => handleRowPress(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.lineId, { color: ROUTE_COLORS[item.id] || '#2A4D9B' }]}>{item.id}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.lineInfo}
            onPress={() => handleRowPress(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.lineName}>{item.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.starButton}
            onPress={() => toggleFavouriteLine(item.id)}
            activeOpacity={0.7}
          >
            <FontAwesome
              name={favouriteLines.includes(item.id) ? 'star' : 'star-o'}
              size={24}
              color={favouriteLines.includes(item.id) ? '#FFD700' : '#888'}
            />
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  lineBox: {
    backgroundColor: '#E3E9FF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 12,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2A4D9B',
  },
  lineInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  lineName: {
    fontSize: 16,
    color: '#222',
  },
  starButton: {
    marginLeft: 12,
    padding: 4,
  },
}); 