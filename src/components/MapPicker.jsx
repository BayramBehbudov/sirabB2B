import { useCallback, useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapClickHandler = ({ onSelectCoords }) => {
  useMapEvents({
    click(e) {
      onSelectCoords(e.latlng);
    },
  });

  return null;
};

const MapInstanceBinder = ({ mapInstanceRef }) => {
  const map = useMap();

  useEffect(() => {
    mapInstanceRef.current = map;
  }, [map, mapInstanceRef]);

  return null;
};

const MapPicker = ({
  markerPosition,
  setMarkerPosition,
  updateSelectedLocation,
  mapInstanceRef,
}) => {
  const handleMarkerMove = useCallback(
    async ({ lat, lng }) => {
      setMarkerPosition({ lat, lng });
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(
          { lat, lng },
          mapInstanceRef.current.getZoom(),
          {
            duration: 0.5,
          }
        );
      }
      await updateSelectedLocation(lat, lng);
    },
    [updateSelectedLocation]
  );

  return (
    <MapContainer
      center={markerPosition}
      zoom={15}
      scrollWheelZoom
      className="h-full w-full"
    >
      <MapInstanceBinder mapInstanceRef={mapInstanceRef} />
      <TileLayer
        attribution="&copy; Sirab B2B"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={markerPosition}
        draggable
        icon={markerIcon}
        eventHandlers={{
          dragend: async (e) => {
            const latLng = e.target.getLatLng();
            await handleMarkerMove({
              lat: latLng.lat,
              lng: latLng.lng,
            });
          },
        }}
      />
      <MapClickHandler onSelectCoords={handleMarkerMove} />
    </MapContainer>
  );
};

export default MapPicker;
