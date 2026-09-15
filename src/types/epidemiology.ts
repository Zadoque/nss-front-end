export type EpidemiologyFilters = {
  disease: string;
  year: number;
  month: number;
};
export type MunicipalityCases = {
  cdUf: string;
  nmUf: string;
  cdMun: string;
  nmMun: string;
  casesTotal: number;
};
export type MunicipalityCasesResponse = EpidemiologyFilters & {
  items: MunicipalityCases[];
};
export interface EpidemiologyDataSource {
  listDiseases(): Promise<string[]>;
  getMunicipalityCases(
    filters: EpidemiologyFilters,
  ): Promise<MunicipalityCasesResponse>;
}
export type MapLevel =
  "BRAZIL_REGIONS" | "SOUTHEAST_STATES" | "RJ_MUNICIPALITIES";
export type GeographySelection = {
  level: "region" | "state" | "municipality";
  code: string;
  name: string;
};
