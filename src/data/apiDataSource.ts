import { getJson } from "../api/http";
import type {
  EpidemiologyDataSource,
  EpidemiologyFilters,
  MunicipalityCases,
  MunicipalityCasesResponse,
} from "../types/epidemiology";
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
function validItem(value: unknown): value is MunicipalityCases {
  return (
    object(value) &&
    typeof value.cdUf === "string" &&
    /^\d{2}$/.test(value.cdUf) &&
    typeof value.nmUf === "string" &&
    typeof value.cdMun === "string" &&
    /^\d{7}$/.test(value.cdMun) &&
    typeof value.nmMun === "string" &&
    typeof value.casesTotal === "number" &&
    Number.isSafeInteger(value.casesTotal) &&
    value.casesTotal >= 0
  );
}
export function parseCases(
  value: unknown,
  filters: EpidemiologyFilters,
): MunicipalityCasesResponse {
  if (
    !object(value) ||
    value.disease !== filters.disease ||
    value.year !== filters.year ||
    value.month !== filters.month ||
    !Array.isArray(value.items) ||
    !value.items.every(validItem) ||
    new Set(value.items.map((item) => item.cdMun)).size !== value.items.length
  )
    throw new Error("Resposta epidemiológica inválida.");
  return { ...filters, items: value.items };
}
export const apiDataSource: EpidemiologyDataSource = {
  async listDiseases() {
    const data = await getJson("/diseases");
    if (
      !object(data) ||
      !Array.isArray(data.items) ||
      !data.items.every(
        (d): d is string => typeof d === "string" && d.trim().length > 0,
      )
    )
      throw new Error("Lista de doenças inválida.");
    return [...new Set(data.items)];
  },
  async getMunicipalityCases(filters) {
    const params = new URLSearchParams({
      disease: filters.disease,
      year: String(filters.year),
      month: String(filters.month),
    });
    return parseCases(
      await getJson(`/epidemiology/municipalities?${params}`),
      filters,
    );
  },
};
