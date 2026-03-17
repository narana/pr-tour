import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import pois, { routeWaypoints } from '../data/pois';
import routeData from '../data/routeData.json';

// Fix default marker icon path issue with bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const poiIcon = L.divIcon({
  className: 'poi-marker',
  html: '<div style="background:#1a5632;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const mandatoryIcon = L.divIcon({
  className: 'poi-marker-mandatory',
  html: '<div style="background:#d94040;width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const userIcon = L.divIcon({
  className: 'user-marker',
  html: '<div style="background:#4285f4;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 1px 6px rgba(0,0,0,.4)"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

/**
 * Leaflet map component.
 *
 * Props:
 *  - userPosition: { lat, lng } | null
 *  - interactive: boolean (zoom/pan allowed)
 *  - showRoute: boolean
 *  - followUser: boolean (auto-center on user position)
 *  - height: CSS height value
 */
export default function TourMap({ userPosition, interactive = true, showRoute = true, followUser = false, onUserPan, height = '100%' }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      touchZoom: interactive,
      boxZoom: false,
      keyboard: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    if (interactive && onUserPan) {
      map.on('dragstart', onUserPan);
    }

    // Draw route polyline from waypoints
    if (showRoute) {
      const routeLatLngs = (routeData.geometry?.length
        ? routeData.geometry.map((point) => [point.lat, point.lng])
        : routeWaypoints.map((w) => [w.lat, w.lng]));
      L.polyline(routeLatLngs, {
        color: '#1a5632',
        weight: 4,
        opacity: 0.8,
      }).addTo(map);
    }

    // Add POI markers
    pois.forEach((poi) => {
      const icon = poi.mandatory ? mandatoryIcon : poiIcon;
      L.marker([poi.coordinates.lat, poi.coordinates.lng], { icon })
        .bindTooltip(poi.name, { direction: 'top', offset: [0, -10] })
        .addTo(map);
    });

    // Fit bounds to show the full route
    const allPoints = routeWaypoints.map((w) => [w.lat, w.lng]);
    map.fitBounds(allPoints, { padding: [30, 30] });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [interactive, onUserPan, showRoute]);

  // Update user position marker
  useEffect(() => {
    if (!mapRef.current || !userPosition) return;

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([userPosition.lat, userPosition.lng], { icon: userIcon })
        .addTo(mapRef.current);
    } else {
      userMarkerRef.current.setLatLng([userPosition.lat, userPosition.lng]);
    }

    if (followUser) {
      mapRef.current.setView([userPosition.lat, userPosition.lng], 14, { animate: true });
    }
  }, [userPosition, followUser]);

  // Handle container resizes
  useEffect(() => {
    if (!mapRef.current) return;
    const timeout = setTimeout(() => mapRef.current.invalidateSize(), 100);
    return () => clearTimeout(timeout);
  });

  return <div ref={mapContainerRef} data-testid="tour-map" style={{ width: '100%', height }} />;
}
