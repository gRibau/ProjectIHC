import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import { LiveMap } from '../../components/LiveMap';
import { BusDetailSheet } from '../../components/BusDetailSheet';
import { Bus } from '../../types/bus';
import busesData from '../../assets/mock/buses.json';
import { MaterialIcons } from '@expo/vector-icons';
import { useActiveLines } from '../../context/ActiveLinesContext';

export default function LiveTrackingScreen() {
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { activeLines } = useActiveLines();

  const handleBusPress = (bus: Bus) => {
    setSelectedBus(bus);
    bottomSheetRef.current?.expand();
  };

  return (
    <View style={styles.container}>
      <View style={styles.planTripButtonContainer}>
        <Link href="/trip-planning" asChild>
          <TouchableOpacity style={styles.planTripButton}>
            <MaterialIcons name="arrow-forward" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.planTripText}>Planear Viagem</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <LiveMap
        buses={busesData.buses}
        onBusPress={handleBusPress}
        activeLines={activeLines}
      />

      <BusDetailSheet
        bus={selectedBus}
        bottomSheetRef={bottomSheetRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  planTripButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  planTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  planTripText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 