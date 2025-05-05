import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { Bus } from '../types/bus';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import routesRaw from '../assets/mock/routes.json';
const routes = (routesRaw as any).default || routesRaw;

interface LiveMapProps {
  buses: Bus[];
  onBusPress: (bus: Bus) => void;
  activeLines: string[];
  selectedLineFromTab?: string | null;
}

interface BusPosition {
  id: string;
  line: string;
  number: string;
  routeIndex: number;
}

// Color mapping for different routes
export const ROUTE_COLORS: { [key: string]: string } = {
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

// Helper function to calculate region that fits a route
const getRegionForRoute = (route: { latitude: number; longitude: number }[]): Region => {
  if (!route || route.length === 0) {
    return {
      latitude: 40.6300,
      longitude: -8.6577,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }

  let minLat = route[0].latitude;
  let maxLat = route[0].latitude;
  let minLng = route[0].longitude;
  let maxLng = route[0].longitude;

  route.forEach(point => {
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLng = Math.min(minLng, point.longitude);
    maxLng = Math.max(maxLng, point.longitude);
  });

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  const latDelta = (maxLat - minLat) * 1.25; // Add 50% padding
  const lngDelta = (maxLng - minLng) * 1.35; // Add 50% padding

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
};

export const LiveMap: React.FC<LiveMapProps> = ({ 
  buses, 
  onBusPress, 
  activeLines,
  selectedLineFromTab 
}) => {
  const safeActiveLines = Array.isArray(activeLines) ? activeLines : [];
  const [busPositions, setBusPositions] = useState<BusPosition[]>([]);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

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

  // Handle line selection from tab
  useEffect(() => {
    if (selectedLineFromTab) {
      const route = routes[selectedLineFromTab];
      if (Array.isArray(route) && route.length > 0) {
        setSelectedLine(selectedLineFromTab);
        const region = getRegionForRoute(route);
        mapRef.current?.animateToRegion(region, 1000);
      }
    }
  }, [selectedLineFromTab]);

  // Handle line selection and zoom
  const handleLinePress = (lineId: string) => {
    const route = routes[lineId];
    if (Array.isArray(route) && route.length > 0) {
      setSelectedLine(lineId);
      const region = getRegionForRoute(route);
      mapRef.current?.animateToRegion(region, 1000);
    }
  };

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
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onPress={() => setSelectedLine(null)}
      >
        {safeActiveLines.map((lineId) => {
          const route = routes[lineId];
          if (Array.isArray(route) && route.length > 0) {
            const routeColor = ROUTE_COLORS[lineId] || '#00FF00'; // Default to green if no color defined
            const colorWithOpacity = selectedLine === lineId 
              ? routeColor 
              : `${routeColor}99`; // Add 60% opacity (99 in hex)
            return (
              <Polyline
                key={lineId + '-full'}
                coordinates={route}
                strokeColor={colorWithOpacity}
                strokeWidth={selectedLine === lineId ? 10 : 7}
                tappable={true}
                onPress={() => handleLinePress(lineId)}
                zIndex={1}
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