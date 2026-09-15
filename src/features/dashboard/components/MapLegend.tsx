export function caseColor(cases: number) {
  return cases === 0
    ? "#e0f2ee"
    : cases <= 40
      ? "#8ccbb8"
      : cases <= 100
        ? "#328b77"
        : "#125345";
}
export function MapLegend() {
  return (
    <section className="legend" aria-label="Legenda">
      <h3>Casos no mês</h3>
      <ul>
        {[
          ["#dce2e6", "Sem cobertura nesta V1"],
          ["#f6f0d8", "Coberto · sem valor disponível"],
          [caseColor(0), "0 casos"],
          [caseColor(18), "1–40 casos"],
          [caseColor(85), "41–100 casos"],
          [caseColor(120), "Mais de 100 casos"],
        ].map(([color, label]) => (
          <li key={label}>
            <span style={{ background: color }} />
            {label}
          </li>
        ))}
      </ul>
      <p>Contagens absolutas; não representam incidência.</p>
    </section>
  );
}
