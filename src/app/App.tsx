import { useEffect, useState, type MouseEvent } from "react";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { HomePage } from "../features/home/HomePage";

export function App() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  useEffect(() => {
    document.title =
      path === "/mapa"
        ? "Mapa | NSS — UENF"
        : "NSS — Núcleo de Situação de Saúde";
    document.querySelector("h1")?.setAttribute("tabindex", "-1");
    document.querySelector("h1")?.focus();
  }, [path]);
  function followLink(event: MouseEvent<HTMLDivElement>) {
    const link = (event.target as Element).closest("a");
    if (
      !link ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target ||
      link.hasAttribute("download")
    )
      return;
    const url = new URL(link.href);
    if (
      url.origin !== window.location.origin ||
      !["/", "/mapa"].includes(url.pathname)
    )
      return;
    event.preventDefault();
    window.history.pushState(null, "", url);
    setPath(url.pathname);
    window.scrollTo(0, 0);
  }
  return (
    <div onClick={followLink}>
      {path === "/mapa" ? (
        <DashboardPage />
      ) : path === "/" ? (
        <HomePage />
      ) : (
        <main>
          <h1>Página não encontrada</h1>
          <a href="/">Voltar ao início</a>
        </main>
      )}
    </div>
  );
}
