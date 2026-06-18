# Web Completo — Guia de Estudo

Guia de estudo interativo para aprender desenvolvimento web front-end (HTML, CSS e JavaScript). Projeto criado durante o curso **B7Web**, com conteúdo em português e exemplos práticos com demonstrações visuais.

## Visão Geral

O projeto é um site estático com uma abordagem progressiva:

1. **Comece Aqui** — configuração do ambiente, primeiros passos
2. **HTML** — guia completo com 12 tópicos, do básico às melhores práticas
3. **CSS** — guia completo com 15 tópicos, incluindo Flexbox, Grid, animações e responsividade
4. **JavaScript** — guia completo com 15 tópicos, do básico ao assíncrono
5. **Projeto Prático** — construção passo a passo de um mini-portfólio
6. **Ferramentas** — terminal, Git, DevTools do navegador
7. **Trilha** — roadmap de estudos e recursos recomendados

## Tecnologias

| Camada        | Tecnologia                                                        |
| ------------- | ----------------------------------------------------------------- |
| Marcação      | HTML5 semântico                                                   |
| Estilo        | CSS3 (Custom Properties, Flexbox, Grid, Animações, Media Queries) |
| Interação     | JavaScript vanilla (ES6+)                                         |
| Tipografia    | Sora, DM Sans, JetBrains Mono (Google Fonts)                      |
| Versionamento | Git + Husky + commitlint (conventional commits)                   |
| Formatação    | Prettier + lint-staged                                            |

## Estrutura

```
.
├── index.html              # Página inicial
├── comece-aqui/            # Guia de configuração inicial
├── html/                   # Referência completa de HTML
├── css/                    # Referência completa de CSS
├── js/                     # Referência completa de JavaScript
├── projeto/                # Tutorial prático (mini-portfólio)
├── ferramentas/            # Terminal, Git e DevTools
├── trilha/                 # Roadmap de aprendizado
├── styles/main.css         # Estilos globais (~1500 linhas)
├── scripts/main.js         # Scripts globais
└── package.json            # Dependências de ferramentas (dev apenas)
```

## Como usar

Não são necessários build tools. Basta servir os arquivos com qualquer servidor estático:

```bash
# Com VS Code + Live Server
# Ou com Python:
python3 -m http.server 3000
# Ou com npx:
npx serve .
```

Abra o endereço exibido no navegador e navegue pelos links no topo da página.

## Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- (Opcional) VS Code com extensão Live Server para desenvolvimento

## Commits

Este repositório usa **conventional commits** validados automaticamente via Husky + commitlint. Exemplos:

```
feat: adicionar seção de animações CSS
fix: corrigir quebra de layout no mobile
docs: atualizar README com instruções de uso
chore: configurar lint-staged
```

## Licença

MIT
