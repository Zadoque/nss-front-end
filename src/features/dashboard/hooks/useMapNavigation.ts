import { useState } from 'react'
import { demoCoverage } from '../../../data/coverage'
import type { GeographySelection, MapLevel } from '../../../types/epidemiology'
export function useMapNavigation() {
  const [mapLevel, setMapLevel] = useState<MapLevel>('BRAZIL_REGIONS')
  const [selectedGeography, setSelectedGeography] = useState<GeographySelection | null>(null)
  function navigate(level: MapLevel) { setMapLevel(level); setSelectedGeography(null) }
  function select(selection: GeographySelection) {
    setSelectedGeography(selection)
    if (selection.level === 'region' && demoCoverage.drilldownEnabled.regions.includes(selection.code)) navigate('SOUTHEAST_STATES')
    if (selection.level === 'state' && demoCoverage.drilldownEnabled.states.includes(selection.code)) navigate('RJ_MUNICIPALITIES')
  }
  return { mapLevel, selectedGeography, navigate, select }
}
