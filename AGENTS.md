# Instruções para agentes de código

A fonte arquitetural da V1 é `documentation/main.tex`.

Antes de implementar:

1. leia integralmente `documentation/main.tex`;
2. preserve o escopo enxuto da V1;
3. não implemente autenticação, CRUD de usuários, SSR ou acesso direto ao PostgreSQL/Python;
4. use React + TypeScript + Vite + Tailwind + TanStack Query;
5. mantenha a UI desacoplada da origem dos dados por `EpidemiologyDataSource`;
6. implemente primeiro `mockDataSource` e depois `apiDataSource`;
7. componentes visuais não devem chamar `fetch` diretamente;
8. o modo demo deve funcionar mesmo sem o backend Java epidemiológico;
9. dados mockados devem estar explicitamente marcados como sintéticos;
10. antes de encerrar, execute build e lint e registre limitações remanescentes.

Não amplie o escopo sem necessidade. A prioridade é uma dashboard única, estável e apresentável.
