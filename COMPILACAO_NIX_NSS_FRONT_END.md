# Compilar a documentação LaTeX do nss-front-end

O principal é `documentation/main.tex`. O `flake.nix` da raiz, caso exista para a aplicação, fornece ferramentas da aplicação, **não deve ser presumido como ambiente TeX Live**. Não presumir que `nix develop` disponibiliza compilador LaTeX ou Python.

## Ambiente correto

`texliveFull` já inclui `latexmk` e `pdflatex`. **Não adicionar `nixpkgs#latexmk`**: esse atributo pode não existir na revisão Nix utilizada.

A partir da raiz do repositório, verificar primeiro:

```sh
nix shell nixpkgs#texliveFull -c latexmk -v
```

Se houver bloqueio de acesso ao daemon Nix pelo sandbox, solicitar escalonamento para o mesmo comando. Isso é problema de permissão do ambiente, não erro do documento. Não repetir o comando sem resolver a permissão. Não alterar o flake da aplicação só para compilar documentação.

## Build isolado, a partir da raiz

```sh
nix shell nixpkgs#texliveFull -c latexmk -cd -pdf -interaction=nonstopmode -halt-on-error -outdir=/tmp/nss-front-end-tex-final documentation/main.tex > /tmp/nss-front-end-final-build.log 2>&1
```

`-cd` faz latexmk entrar no diretório do arquivo principal, permitindo resolver os `input` relativos. O diretório de saída é absoluto. Alternativa equivalente: entrar em `documentation` e executar o mesmo comando sem `-cd`, passando somente `main.tex`.

Para rodadas independentes, trocar o diretório de saída e o log por nomes distintos: `/tmp/nss-front-end-tex-a`, `/tmp/nss-front-end-tex-b`, `/tmp/nss-front-end-tex-c`, `/tmp/nss-front-end-tex-d`.

## Reutilização do ambiente já disponibilizado

Para descobrir os caminhos reais:

```sh
nix shell nixpkgs#texliveFull -c sh -c 'command -v latexmk; command -v pdflatex'
```

O caminho do Nix store é evidência local, não contrato portável: conferir existência e redescobrir em outra máquina/revisão. Ao reutilizar um ambiente descoberto, adicionar o diretório completo ao `PATH`, pois `latexmk` invoca `pdflatex` e outras ferramentas.

## Verificação obrigatória

1. Aguardar a conclusão do processo e registrar seu exit code; uma sessão ainda em execução não é resultado aprovado.
2. Exigir exit code 0 e conclusão de todos os alvos pelo latexmk.
3. Inspecionar o log **final** do compilador:

   ```sh
   rg -n '^!|LaTeX Error|undefined|Output written|Overfull' /tmp/nss-front-end-tex-final/main.log
   ```

   Nenhum erro ou referência indefinida pode permanecer. Avisos de `LastPage` na primeira passagem podem desaparecer nas passagens seguintes; não avaliar só o log agregado inicial. `rg` retorna 1 quando não encontra correspondências, o que não significa falha de compilação.
4. Executar `git diff --check` e inspecionar visualmente as páginas alteradas, especialmente tabelas, caixas e listagens. Registrar avisos tipográficos remanescentes sem escondê-los.
5. Copiar `/tmp/nss-front-end-tex-final/main.pdf` para `documentation/main.pdf` **somente depois do build final aprovado e da inspeção visual**. Builds intermediários não atualizam o PDF versionado.

Compilação verifica sintaxe e referências documentais; não prova implementação, segurança do backend, contratos de API ou homologação dos dados.
