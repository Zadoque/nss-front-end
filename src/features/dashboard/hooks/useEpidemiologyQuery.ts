import { useQuery } from "@tanstack/react-query";
import { dataSource } from "../../../data/dataSource";
import type { EpidemiologyFilters } from "../../../types/epidemiology";
export function useEpidemiologyQuery(filters: EpidemiologyFilters) {
  return useQuery({
    queryKey: ["municipality-cases", filters],
    queryFn: () => dataSource.getMunicipalityCases(filters),
    enabled: !!filters.disease,
  });
}
export function useDiseases() {
  return useQuery({
    queryKey: ["diseases"],
    queryFn: () => dataSource.listDiseases(),
  });
}
