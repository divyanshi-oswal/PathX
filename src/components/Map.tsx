'use client';

import React, {useEffect, useRef, useState} from 'react';
import {Coordinate} from '@/services/mapping';

interface MapProps {
  start: Coordinate;
  end: Coordinate;
  routeCoordinates: Coordinate[];
}

export const MapComponent: React.FC<MapProps> = ({start, end, routeCoordinates}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        const leaflet = await import('leaflet');
        const L = leaflet.default;

        if (!L) {
          console.error('Failed to load Leaflet');
          return;
        }

        // Import leaflet CSS dynamically
        await import('leaflet/dist/leaflet.css');

        const newMap = L.map(mapRef.current).setView([start.lat, start.lng], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(newMap);

        const startIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const endIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        L.marker([start.lat, start.lng], {icon: startIcon}).addTo(newMap).bindPopup("Start Location");
        L.marker([end.lat, end.lng], {icon: endIcon}).addTo(newMap).bindPopup("End Location");

        if (routeCoordinates && routeCoordinates.length > 0) {
          const latLngs = routeCoordinates.map(coord => [coord.lat, coord.lng] as [number, number]);
          const polyline = L.polyline(latLngs, {color: 'green'}).addTo(newMap);
          newMap.fitBounds(polyline.getBounds());
        }

        setMap(newMap);
      } catch (error) {
        console.error('Failed to load Leaflet', error);
      }
    };

    if (mapRef.current && !map) {
      initializeMap();
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [start, end, routeCoordinates, map]);

  return (
    <div
      ref={mapRef}
      style={{height: '300px', width: '100%'}}
    ></div>
  );
};

