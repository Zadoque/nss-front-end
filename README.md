# NSS Front-end

Front-end do Núcleo de Situação de Saúde (NSS/UENF).

A documentação arquitetural da V1 está em [`documentation/main.tex`](documentation/main.tex). Ela define o escopo mínimo da primeira demonstração, o contrato esperado com a API Java, o schema PostgreSQL de referência e a estratégia de mock/API para permitir desenvolvimento do front antes da conclusão do backend epidemiológico.

## Direção da V1

- React + TypeScript + Vite
- Tailwind CSS
- TanStack Query
- uma única dashboard epidemiológica
- dados mockados intercambiáveis com a API Java
- nenhum acesso direto do navegador ao PostgreSQL ou ao pipeline Python

Consulte também [`COMPILACAO_NIX_NSS_FRONT_END.md`](COMPILACAO_NIX_NSS_FRONT_END.md) para validar a documentação LaTeX.
