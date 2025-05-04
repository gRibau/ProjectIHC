import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Bus } from '../types/bus';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import routesRaw from '../assets/mock/routes.json';
const routes = (routesRaw as any).default || routesRaw;

interface LiveMapProps {
  buses: Bus[];
  onBusPress: (bus: Bus) => void;
  activeLines: string[];
}

interface BusPosition {
  id: string;
  line: string;
  number: string;
  routeIndex: number;
}

// Color mapping for different routes
const ROUTE_COLORS: { [key: string]: string } = {
  '15': '#FF5252', // Red
  '16': '#4CAF50', // Green
  '17': '#2196F3', // Blue
  '18': '#FFC107', // Yellow
  '19': '#9C27B0', // Purple
  '20': '#FF9800', // Orange
  '21': '#00BCD4', // Cyan
  '22': '#E91E63', // Pink
  '23': '#8BC34A', // Light Green
  '24': '#795548', // Brown
  '25': '#607D8B', // Blue Grey
  '26': '#3F51B5', // Indigo
  '27': '#009688', // Teal
  '28': '#673AB7', // Deep Purple
  '29': '#CDDC39', // Lime
  '30': '#FF5722', // Deep Orange
};

// Helper function to get bus positions for a route
const getBusPositionsForRoute = (routeId: string) => {
  const route = routes[routeId];
  if (!route || !Array.isArray(route) || route.length < 2) return [];
  
  // Get positions at 1/4 and 3/4 of the route
  const firstBusIndex = Math.floor(route.length / 4);
  const secondBusIndex = Math.floor(route.length * 3 / 4);
  
  return [
    {
      id: `${routeId}-bus1`,
      line: routeId,
      number: '1',
      routeIndex: firstBusIndex,
    },
    {
      id: `${routeId}-bus2`,
      line: routeId,
      number: '2',
      routeIndex: secondBusIndex,
    }
  ];
};

export const LiveMap: React.FC<LiveMapProps> = ({ buses, onBusPress, activeLines }) => {
  const safeActiveLines = Array.isArray(activeLines) ? activeLines : [];
  const [busPositions, setBusPositions] = useState<BusPosition[]>([]);

  const initialRegion = {
    latitude: 40.6300,
    longitude: -8.6577,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Update bus positions when active lines change
  useEffect(() => {
    const newBusPositions = safeActiveLines.flatMap(routeId => getBusPositionsForRoute(routeId));
    setBusPositions(newBusPositions);
  }, [safeActiveLines]);

  // Move buses along their routes
  useEffect(() => {
    const interval = setInterval(() => {
      setBusPositions(currentPositions => {
        return currentPositions.map(bus => {
          const route = routes[bus.line];
          if (!route || !Array.isArray(route)) return bus;

          // Move to next position
          let nextIndex = bus.routeIndex + 1;
          
          // If reached end of route, loop back to start
          if (nextIndex >= route.length) {
            nextIndex = 0;
          }

          return {
            ...bus,
            routeIndex: nextIndex,
          };
        });
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // Convert bus positions to actual bus objects with coordinates
  const routeBuses = busPositions.map(bus => {
    const route = routes[bus.line];
    if (!route || !Array.isArray(route)) return null;
    
    const position = route[bus.routeIndex];
    return {
      id: bus.id,
      line: bus.line,
      number: bus.number,
      lat: position.latitude,
      lng: position.longitude,
    };
  }).filter((bus): bus is Bus => bus !== null);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        {safeActiveLines.map((lineId) => {
          const route = routes[lineId];
          if (Array.isArray(route) && route.length > 0) {
            const routeColor = ROUTE_COLORS[lineId] || '#00FF00'; // Default to green if no color defined
            return (
              <Polyline
                key={lineId + '-full'}
                coordinates={route}
                strokeColor={routeColor}
                strokeWidth={7}
              />
            );
          }
          return null;
        })}
        {routeBuses.map((bus) => {
          const routeColor = ROUTE_COLORS[bus.line] || '#2196F3'; // Default to blue if no color defined
          return (
            <Marker
              key={bus.id}
              coordinate={{
                latitude: bus.lat,
                longitude: bus.lng,
              }}
              onPress={() => onBusPress(bus)}
            >
              <View style={[styles.busMarker, { backgroundColor: routeColor }]}>
                <MaterialCommunityIcons name="bus" size={28} color="#fff" />
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  busMarker: {
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
}); 