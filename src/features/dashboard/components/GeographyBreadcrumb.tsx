import type { MapLevel } from '../../../types/epidemiology'
const levels: MapLevel[] = ['BRAZIL_REGIONS', 'SOUTHEAST_STATES', 'RJ_MUNICIPALITIES']
const labels = ['Brasil', 'Sudeste', 'Rio de Janeiro']
export function GeographyBreadcrumb({ level, navigate }: { level: MapLevel; navigate: (level: MapLevel) => void }) {
  const index = levels.indexOf(level)
  return <nav className="breadcrumb" aria-label="Navegação geográfica"><ol>{levels.slice(0, index + 1).map((value, i) => <li key={value}>{i > 0 && <span aria-hidden="true">/</span>}{i === index ? <span aria-current="page">{labels[i]}</span> : <button onClick={() => navigate(value)}>{labels[i]}</button>}</li>)}</ol>{index > 0 && <button onClick={() => navigate(levels[index - 1])}>← Voltar</button>}</nav>
}
