import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Bus } from '../types/bus';

interface BusDetailSheetProps {
  bus: Bus | null;
  bottomSheetRef: React.RefObject<BottomSheet>;
}

export const BusDetailSheet: React.FC<BusDetailSheetProps> = ({ bus, bottomSheetRef }) => {
  if (!bus) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['25%', '50%']}
      enablePanDownToClose
      index={-1}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.busNumber}>Bus {bus.number}</Text>
        <Text style={styles.route}>{bus.route}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Próxima Paragem:</Text>
            <Text style={styles.value}>{bus.nextStop}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>ETA:</Text>
            <Text style={styles.value}>{bus.eta}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ocupação:</Text>
            <Text style={styles.value}>{bus.passengers}/{bus.capacity}</Text>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  busNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  route: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 