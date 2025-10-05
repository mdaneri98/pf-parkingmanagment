import { useState, useEffect, useCallback, useRef } from 'react';
import type { SpotDTO } from '@parking/types';

export function useSpotSelection(spots: SpotDTO[]) {
  const [selectedSpot, setSelectedSpot] = useState<SpotDTO | null>(null);
  const previousSpotsRef = useRef<SpotDTO[]>([]);

  useEffect(() => {
    const previousSpots = previousSpotsRef.current;
    const spotsChanged = JSON.stringify(previousSpots) !== JSON.stringify(spots);
    
    if (spotsChanged) {
      previousSpotsRef.current = spots;
      
      if (spots.length > 0 && !selectedSpot) {
        setSelectedSpot(spots[0]);
      } else if (spots.length === 0) {
        setSelectedSpot(null);
      } else if (selectedSpot && !spots.find(spot => spot.id === selectedSpot.id)) {
        setSelectedSpot(spots[0] || null);
      }
    }
  }, [spots, selectedSpot]);

  const selectSpot = useCallback((spot: SpotDTO) => {
    setSelectedSpot(spot);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSpot(spots[0] || null);
  }, [spots]);

  return {
    selectedSpot,
    selectSpot,
    clearSelection,
    setSelectedSpot,
  };
}
