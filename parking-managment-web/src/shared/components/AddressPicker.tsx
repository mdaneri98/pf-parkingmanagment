/// <reference types="@types/google.maps" />

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

interface AddressPickerProps {
  address: string;
  setAddress: (value: string) => void;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  disabled?: boolean;
}

export function AddressPicker({
  address,
  setAddress,
  setLatitude,
  setLongitude,
  disabled,
}: AddressPickerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const autocompleteRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTypedTranslation();

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Google Maps API key missing. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.");
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places", "marker"],
    });

    loader.load().then(() => {
      if (!mapRef.current || !autocompleteRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 37.4221, lng: -122.0841 },
        zoom: 13,
        mapId: "DEMO_MAP_ID",
      });

      // Advanced marker
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
      });
      markerRef.current = marker;

      const autocomplete = new google.maps.places.Autocomplete(autocompleteRef.current!, {
        fields: ["geometry", "formatted_address"],
        types: ["address"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        const location = place.geometry.location;
        setAddress(place.formatted_address ?? "");
        setLatitude(location.lat());
        setLongitude(location.lng());

        map.setCenter(location);
        marker.position = location;
      });
    });
  }, [setAddress, setLatitude, setLongitude]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {t('shared.addressPicker.label')}
      </label>
      <input
        ref={autocompleteRef}
        type="text"
        className="w-full rounded-md border px-3 py-2 text-sm 
                   bg-white text-neutral-900 
                   dark:bg-neutral-800 dark:text-neutral-100"
        placeholder={t('shared.addressPicker.placeholder')}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        disabled={disabled}
      />
      <div ref={mapRef} className="h-64 w-full rounded-md border" />
    </div>
  );
}
