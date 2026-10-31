# Site Speed Deck (React)

React + Vite version of the PageSpeed monitoring dashboard/config UI, matching
the stack used in the fandeck project (React + Vite).

## Local setup

```bash
npm install
npm run dev
```

Open the URL Vite prints (default http://localhost:5173).

## Build for production

```bash
npm run build
```

Outputs a static `dist/` folder — can be hosted anywhere (Netlify, GitLab
Pages, dropped into an AEM clientlib, etc.), same as the fandeck build.

## Structure

```
src/
├── App.jsx                  # root: tabs + state wiring
├── components/
│   ├── Header.jsx            # title + Dashboard/Config tabs
│   ├── Dashboard.jsx          # run checks, score cards, stats
│   ├── ConfigPanel.jsx         # URLs, thresholds, recipients, YAML export
│   ├── ScoreSwatch.jsx          # paint-chip style score badge
│   └── Sparkline.jsx             # inline SVG trend line
├── hooks/
│   └── useLocalStorage.js         # persists state to the browser
├── lib/
│   ├── mockData.js                 # mock score generator
│   ├── psiApi.js                    # live Google PageSpeed Insights call
│   └── yamlExport.js                 # generates config.yaml snippet
└── index.css                          # design tokens + all styling
```

## Notes

- All state (URLs, thresholds, recipients, API key, run history) persists in
  the browser via `localStorage` — nothing is sent anywhere except the direct
  PageSpeed Insights API call in Live mode.
- "Export as config.yaml" in the Config tab generates a snippet that can be
  pasted into the Python backend project's `config/config.yaml`, so URLs and
  thresholds stay in sync without duplicating work.
- Mock mode needs no API key and works instantly — good for demos.
