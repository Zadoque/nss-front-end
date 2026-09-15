import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { loadMap, mapViews } from "../../../data/maps";
import type {
  GeographySelection,
  MapLevel,
  MunicipalityCases,
} from "../../../types/epidemiology";
import { demoCoverage } from "../../../data/coverage";
import { caseColor } from "./MapLegend";

type Props = {
  level: MapLevel;
  selected: GeographySelection | null;
  items: MunicipalityCases[];
  dataStatus: "loading" | "error" | "success";
  onSelect: (value: GeographySelection) => void;
};
export function GeographicMap({
  level,
  selected,
  items,
  dataStatus,
  onSelect,
}: Props) {
  const [hint, setHint] = useState("");
  const map = useQuery({
    queryKey: ["map", level],
    queryFn: () => loadMap(level),
    staleTime: Infinity,
  });
  const view = mapViews[level];
  if (map.isPending)
    return (
      <div className="map-placeholder" role="status">
        Carregando mapa…
      </div>
    );
  if (map.isError)
    return (
      <div className="map-placeholder" role="alert">
        Não foi possível carregar o mapa.
        <button onClick={() => void map.refetch()}>Tentar novamente</button>
      </div>
    );
  const byCode = new Map(items.map((item) => [item.cdMun, item]));
  return (
    <>
      <ComposableMap
        width={800}
        height={540}
        projection="geoMercator"
        projectionConfig={{ center: view.center, scale: view.scale }}
        aria-label={`Mapa interativo: ${view.title}`}
      >
        <Geographies geography={map.data}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const p = geo.properties ?? {};
              const geography: GeographySelection =
                level === "BRAZIL_REGIONS"
                  ? {
                      level: "region",
                      code: String(p.abbrev_region),
                      name: String(p.name_region),
                    }
                  : level === "SOUTHEAST_STATES"
                    ? {
                        level: "state",
                        code: String(p.abbrev_state),
                        name: String(p.name_state),
                      }
                    : {
                        level: "municipality",
                        code: String(p.code_muni),
                        name: String(p.name_muni),
                      };
              const navigable =
                geography.level === "region"
                  ? demoCoverage.drilldownEnabled.regions.includes(
                      geography.code,
                    )
                  : geography.level === "state" &&
                    demoCoverage.drilldownEnabled.states.includes(
                      geography.code,
                    );
              const covered =
                geography.level === "municipality" &&
                demoCoverage.caseDataAvailableForMunicipalities.includes(
                  geography.code,
                );
              const item = covered ? byCode.get(geography.code) : undefined;
              const detail = navigable
                ? "Toque ou pressione Enter para explorar"
                : !covered
                  ? "Sem cobertura nesta V1"
                  : dataStatus === "loading"
                    ? "Carregando dados"
                    : dataStatus === "error"
                      ? "Dados indisponíveis: erro na consulta"
                      : item
                        ? `${item.casesTotal} casos`
                        : "Sem registros neste recorte";
              const label = `${geography.name} · ${detail}`;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  tabIndex={0}
                  role="button"
                  aria-label={label}
                  aria-pressed={selected?.code === geography.code}
                  className={
                    selected?.code === geography.code ? "geo selected" : "geo"
                  }
                  fill={
                    item
                      ? caseColor(item.casesTotal)
                      : covered
                        ? "#f6f0d8"
                        : navigable
                          ? "#b8d9d2"
                          : "#dce2e6"
                  }
                  stroke="#fff"
                  strokeWidth={1}
                  onMouseEnter={() => setHint(label)}
                  onMouseLeave={() => setHint("")}
                  onFocus={() => setHint(label)}
                  onBlur={() => setHint("")}
                  onClick={() => onSelect(geography)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(geography);
                    }
                  }}
                >
                  <title>{label}</title>
                </Geography>
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <p className="map-hint" aria-live="polite">
        {hint ||
          (selected
            ? selected.name
            : "Selecione uma área no mapa para explorar.")}
      </p>
    </>
  );
}
