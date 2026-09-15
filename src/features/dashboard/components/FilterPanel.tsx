import { useId } from "react";
import type { EpidemiologyFilters } from "../../../types/epidemiology";
import { MapLegend } from "./MapLegend";
export type FilterPanelProps = {
  filters: EpidemiologyFilters;
  onChange: (filters: EpidemiologyFilters) => void;
  diseases: string[];
  diseasesLoading: boolean;
  diseasesError: boolean;
  retryDiseases: () => void;
  selectionName: string;
  selectionInfo: string;
  demo: boolean;
  municipal: boolean;
};
const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
export function FilterPanel({
  municipal,
  filters,
  onChange,
  diseases,
  diseasesLoading,
  diseasesError,
  retryDiseases,
  selectionName,
  selectionInfo,
  demo,
}: FilterPanelProps) {
  const id = useId();
  return (
    <div className="panel-content">
      <div className="section-label">RECORTE EPIDEMIOLÓGICO</div>
      <h2>Filtros e informações</h2>
      {diseasesError && (
        <p role="alert">
          Falha ao listar doenças.{" "}
          <button onClick={retryDiseases}>Tentar novamente</button>
        </p>
      )}
      {!diseasesLoading && !diseasesError && diseases.length === 0 && (
        <p role="status">Nenhuma doença disponível.</p>
      )}
      <label htmlFor={`${id}-disease`}>Doença</label>
      <select
        id={`${id}-disease`}
        value={filters.disease}
        disabled={diseasesLoading || diseasesError || !diseases.length}
        onChange={(e) => onChange({ ...filters, disease: e.target.value })}
      >
        {!diseases.length && (
          <option value="">
            {diseasesLoading ? "Carregando…" : "Indisponível"}
          </option>
        )}
        {diseases.map((d) => (
          <option key={d} value={d}>
            {d === "DENG" ? "Dengue · DENG" : d}
          </option>
        ))}
      </select>
      <div className="filter-period">
        <div>
          <label htmlFor={`${id}-year`}>Ano</label>
          <select
            id={`${id}-year`}
            value={filters.year}
            onChange={(e) =>
              onChange({ ...filters, year: Number(e.target.value) })
            }
          >
            {[2026, 2025, 2024].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-month`}>Mês</label>
          <select
            id={`${id}-month`}
            value={filters.month}
            onChange={(e) =>
              onChange({ ...filters, month: Number(e.target.value) })
            }
          >
            {months.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>
      <section className="selection" aria-live="polite">
        <div className="section-label">LOCALIZAÇÃO SELECIONADA</div>
        <h3>{selectionName}</h3>
        <p>{selectionInfo}</p>
      </section>
      <MapLegend municipal={municipal} />
      {demo && (
        <p className="demo-note">
          <strong>DEMO</strong> Dados sintéticos para demonstração. Não são
          estatísticas reais.
        </p>
      )}
    </div>
  );
}
