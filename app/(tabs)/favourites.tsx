import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Switch } from 'react-native';
import { CollapsibleSection } from '@/components/ui/CollapsibleSection';
import { useFavourites } from '../../context/FavouritesContext';
import { useActiveLines } from '../../context/ActiveLinesContext';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ROUTE_COLORS } from '../../components/LiveMap';

const lines = [
  { id: '15', name: 'Esgueira ↔ S. Bernardo' },
  { id: '16', name: 'Gafanha Naz. ↔ Ílhavo' },
  { id: '17', name: 'Aveiro ↔ Ovar' },
  { id: '18', name: 'Aveiro ↔ Vagos' },
  { id: '19', name: 'Aveiro ↔ Cantanhede' },
  { id: '20', name: 'Aveiro ↔ Praia de Mira' },
];

export default function FavouritesScreen() {
  const { favouriteLines, recentlyUnfavorited, toggleFavouriteLine, clearRecentlyUnfavorited } = useFavourites();
  const { activeLines, setActiveLines } = useActiveLines();

  // Clear recently unfavorited lines when leaving the tab
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        clearRecentlyUnfavorited();
      };
    }, [])
  );

  // Combine current favourites with recently unfavorited lines
  const visibleLines = lines.filter(line => 
    favouriteLines.includes(line.id) || recentlyUnfavorited.includes(line.id)
  );

  const toggleLine = (id: string) => {
    setActiveLines((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleRowPress = (id: string) => {
    console.log('Line pressed:', id);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <CollapsibleSection
          title="LINHAS"
          isEmpty={visibleLines.length === 0}
          emptyMessage="Ainda não possui linhas nos favoritos."
        >
          {visibleLines.map((line) => (
            <View key={line.id} style={styles.row}>
              <Switch
                value={activeLines.includes(line.id)}
                onValueChange={() => toggleLine(line.id)}
              />
              <TouchableOpacity
                style={[styles.lineBox, { backgroundColor: (ROUTE_COLORS[line.id] ? `${ROUTE_COLORS[line.id]}4D` : '#E3E9FF') }]}
                onPress={() => handleRowPress(line.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.lineId, { color: ROUTE_COLORS[line.id] || '#2A4D9B' }]}>{line.id}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.lineInfo}
                onPress={() => handleRowPress(line.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.lineName}>{line.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.starButton}
                onPress={() => toggleFavouriteLine(line.id)}
                activeOpacity={0.7}
              >
                <FontAwesome
                  name={favouriteLines.includes(line.id) ? 'star' : 'star-o'}
                  size={24}
                  color={favouriteLines.includes(line.id) ? '#FFD700' : '#888'}
                />
              </TouchableOpacity>
            </View>
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title="PARAGENS"
          isEmpty={true}
          emptyMessage="Ainda não possui paragens nos favoritos."
        >
          {/* Stops content will go here */}
        </CollapsibleSection>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
    paddingTop: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
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