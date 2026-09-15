import { useState } from "react";
import { isDemo } from "../../data/dataSource";
import { demoCoverage } from "../../data/coverage";
import { mapViews } from "../../data/maps";
import type { EpidemiologyFilters } from "../../types/epidemiology";
import {
  useDiseases,
  useEpidemiologyQuery,
} from "./hooks/useEpidemiologyQuery";
import { useMapNavigation } from "./hooks/useMapNavigation";
import { GeographicMap } from "./components/GeographicMap";
import { GeographyBreadcrumb } from "./components/GeographyBreadcrumb";
import { FilterPanel } from "./components/FilterPanel";
import { FilterDrawer } from "./components/FilterDrawer";
import { MunicipalityRanking } from "./components/MunicipalityRanking";
export function DashboardPage() {
  const navigation = useMapNavigation();
  const { mapLevel, selectedGeography, select, navigate } = navigation;
  const diseases = useDiseases();
  const [filterInput, setFilters] = useState<EpidemiologyFilters>({
    disease: "DENG",
    year: 2026,
    month: 1,
  });
  const filters = {
    ...filterInput,
    disease: diseases.data?.includes(filterInput.disease)
      ? filterInput.disease
      : (diseases.data?.[0] ?? ""),
  };
  const query = useEpidemiologyQuery(filters);
  const items = query.isSuccess ? query.data.items : [];
  const municipal = mapLevel === "RJ_MUNICIPALITIES";
  const covered =
    selectedGeography?.level === "municipality" &&
    demoCoverage.caseDataAvailableForMunicipalities.includes(
      selectedGeography.code,
    );
  const selectedItem = items.find(
    (item) => item.cdMun === selectedGeography?.code,
  );
  const selectionInfo = selectedGeography
    ? !covered
      ? "Sem cobertura nesta V1. Dados ainda não disponíveis."
      : query.isError
        ? "Não foi possível consultar os dados."
        : query.isPending
          ? "Carregando dados…"
          : selectedItem
            ? `${selectedItem.casesTotal} casos no mês selecionado.`
            : "Sem registros neste recorte. Isso não equivale a zero casos."
    : municipal
      ? "4 municípios com cobertura nesta V1. Selecione um município para consultar."
      : "Explore o Sudeste e o Rio de Janeiro. Cobertura parcial, sem total agregado.";
  const panel = {
    municipal,
    filters,
    onChange: setFilters,
    diseases: diseases.data ?? [],
    diseasesLoading: diseases.isPending,
    diseasesError: diseases.isError,
    retryDiseases: () => {
      void diseases.refetch();
    },
    selectionName: selectedGeography?.name ?? mapViews[mapLevel].title,
    selectionInfo,
    demo: isDemo,
  };
  return (
    <>
      <header className="header">
        <div className="brand-mark" aria-hidden="true">
          NSS
        </div>
        <div>
          <strong>Núcleo de Situação de Saúde</strong>
          <p>UENF · Vigilância epidemiológica</p>
        </div>
        {isDemo && <span className="badge">DEMO</span>}
      </header>
      <main>
        <div className="page-intro">
          <div className="section-label">TERRITÓRIO E SAÚDE</div>
          <h1>Um olhar sobre o território</h1>
          <p>
            Explore o mapa e consulte os casos mensais nos municípios cobertos.
          </p>
        </div>
        <GeographyBreadcrumb level={mapLevel} navigate={navigate} />
        <div className="dashboard-grid">
          <section className="card map-card" aria-label="Exploração geográfica">
            <div className="map-heading">
              <div>
                <div className="section-label">
                  {municipal
                    ? "MUNICÍPIOS"
                    : mapLevel === "BRAZIL_REGIONS"
                      ? "REGIÕES"
                      : "ESTADOS"}
                </div>
                <h2>{mapViews[mapLevel].title}</h2>
              </div>
              <span className="map-step">
                {municipal ? "03" : mapLevel === "BRAZIL_REGIONS" ? "01" : "02"}{" "}
                / 03
              </span>
            </div>
            <GeographicMap
              key={mapLevel}
              level={mapLevel}
              selected={selectedGeography}
              items={items}
              dataStatus={
                query.isError
                  ? "error"
                  : query.isSuccess
                    ? "success"
                    : "loading"
              }
              onSelect={select}
            />
            <div className="map-context" aria-live="polite">
              <strong>
                {selectedGeography?.name ??
                  (municipal
                    ? "Cobertura municipal parcial"
                    : "Navegação pelo território")}
              </strong>
              <p>{selectionInfo}</p>
            </div>
          </section>
          <aside className="card desktop-panel">
            <FilterPanel {...panel} />
          </aside>
        </div>
        <FilterDrawer panel={panel} />
        {municipal && (
          <div className="query-state" aria-live="polite">
            {query.isPending && (
              <p role="status">
                {filters.disease
                  ? "Carregando dados epidemiológicos…"
                  : "Selecione uma doença disponível para consultar."}
              </p>
            )}
            {query.isError && (
              <p role="alert">
                Não foi possível carregar os dados.{" "}
                <button onClick={() => void query.refetch()}>
                  Tentar novamente
                </button>
              </p>
            )}
            {query.isSuccess && !items.length && (
              <p>Sem registros para este recorte nos municípios cobertos.</p>
            )}
          </div>
        )}
        {municipal && query.isSuccess && (
          <MunicipalityRanking
            items={items}
            onSelect={select}
            selected={selectedGeography}
          />
        )}
        <footer>
          NSS / UENF{" "}
          <span>
            {isDemo
              ? "Demonstração com dados sintéticos · V1"
              : "Dados fornecidos pela API epidemiológica · V1"}
          </span>
        </footer>
      </main>
    </>
  );
}
