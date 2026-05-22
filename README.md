# iupac.cheminfo.org

Interactive pedagogic tool to learn IUPAC organic nomenclature — guided
tutorial, live structure playground, self-paced exercises that grade both
directions (structure → name and name → structure), and a printable
cheatsheet built straight from the chemistry course handout.

Live site: <https://iupac.cheminfo.org>

## Replaces the cheminfo "IUPAC nomenclature" visualizer

This site is the modern, standalone replacement for the legacy IUPAC
nomenclature view embedded inside the cheminfo visualizer:

- **Legacy:**
  <https://www.cheminfo.org/?viewURL=https%3A%2F%2Fcouch.cheminfo.org%2Fcheminfo-public%2Fc13474e55f66984d203dd496788b1661%2Fview.json&loadversion=true&fillsearch=Iupac+nom+vers+structure>
- **New:** <https://iupac.cheminfo.org>

It keeps the catalogue of exercises (~310 molecules, ~620 exercises after
expansion) and adds a guided tutorial, the OCL canvas editor for the
"draw the structure from a name" direction, hint generation, deterministic
seeded series sharing, and a printable functional-group cheatsheet.

## Features

- **🎓 Tutorial** — 12 guided steps from chain roots through stereochemistry,
  each preloading a real molecule with a hoverable glossary explanation.
- **🧪 Playground** — type any SMILES, redraw freely with the OpenChemLib
  canvas editor, and inspect the canonical idCode in real time.
- **🏆 Exercises** — every molecule yields two exercises:
  - **structure → name** — the structure is rendered, the student types
    the IUPAC name (case- and whitespace-insensitive match).
  - **name → structure** — the name is shown, the student draws the
    molecule in the OCL editor. The validator uses the canonical OCL
    idCode, so atom ordering and bond drawing do not matter; only
    connectivity and stereochemistry (where the name asks for it).
  Hints are auto-generated from the molecule's functional groups and chain
  length. Per-exercise progress is persisted in `localStorage` under the
  composite id `<kind>:<moleculeId>`.
- **🔗 Teacher-share** — pick filters (kind, level, functional groups), a
  count and a seed; copy a `?series=…` URL that re-creates the exact same
  exercises in the exact same order for every student who opens it. Seed
  shuffling is backed by the [ml-xsadd](https://github.com/mljs/xsadd) PRNG.
- **📚 Cheatsheet** — printable, two-column reference: chain lengths, the
  nine naming rules, stereodescriptors, common branched substituents, the
  full functional-group table (with rendered example structures), and the
  seniority order.

## Stack

- React 18 + TypeScript 6 + [Vite 8](https://vitejs.dev)
- [BlueprintJS](https://blueprintjs.com/) for UI components
- [react-ocl](https://github.com/zakodium-oss/react-ocl) for the structure
  editor and SVG renderer
- [openchemlib](https://github.com/cheminfo/openchemlib-js) for SMILES
  parsing and canonical idCode comparison
- [ml-xsadd](https://github.com/mljs/xsadd) for seeded shuffling
- Vitest for unit tests, Playwright for e2e, ESLint 9 + Prettier for linting
- Static-only deployment — no backend, no API calls

## Local development

```sh
npm install
npm run dev
```

Then open the URL printed by Vite (typically `http://localhost:5173`).
The Vite dev server picks its own port; `PORT` from `.env` is only
read by the Docker container.

## Tests, lint and type checks

```sh
npm run test       # vitest + tsc + eslint + prettier
npm run test-e2e   # Playwright (Chromium) end-to-end suite
```

`npm run test` runs the fast gate: unit tests with coverage (the
`src/iupac/` domain logic is fully covered), the TypeScript checker,
ESLint and Prettier.

`npm run test-e2e` boots the Vite dev server and walks through the live
UI (tutorial, exercises with `localStorage` persistence, cheatsheet, the
share-series dialog and hash routing). First-time setup requires
`npx playwright install --with-deps chromium`.

## Production build

```sh
npm run build
npm run preview
```

The static site is emitted to `dist/`. The build script also regenerates
`src/data/molecules.generated.ts` from `scripts/exercises.tsv` — run
`npm run build-exercises` standalone to refresh the catalogue after
editing the spreadsheet.

## Docker deployment

Three deployment modes are shipped as `compose.example.*.yaml`. Each one
exposes both `image:` and `build: .`, so you can either pull the released
image (`docker compose pull && docker compose up -d`) or build from the
current checkout (`docker compose up -d --build`).

Always start with:

```sh
cp .env.example .env
# edit .env if needed (PORT for host-port mode, TUNNEL_TOKEN for cloudflared)
```

### Port mode (`compose.example.yaml`)

Exposes the static site on a host port. The container always serves on
port 80; the host port is configured via `PORT` in `.env` (default 8080).

```sh
cp compose.example.yaml compose.yaml
docker compose up -d
```

### Cloudflare Tunnel (`compose.example.cloudflared.yaml`)

Public HTTPS via Cloudflare Tunnel, by default published at
`iupac.lactame.com`. No host port is exposed.

1. In the Cloudflare dashboard (https://dash.cloudflare.com):
   *Networking → Tunnels → Create a tunnel → Cloudflared connector*.
2. Copy the connector token into `.env` as `TUNNEL_TOKEN=...`.
3. Open the new tunnel, go to the **Published applications** tab and add
   an application with `Service = HTTP`, URL = `iupac-cheminfo-org:80`,
   hostname `iupac.lactame.com` (or any host you chose in Cloudflare).
4. Deploy:

```sh
cp compose.example.cloudflared.yaml compose.yaml
docker compose up -d
```

### Traefik (`compose.example.traefik.yaml`)

For deployment behind an existing Traefik instance on `iupac.cheminfo.org`.
Requires the host to already run Traefik on an external Docker network
named `traefik` (with a `websecure` entrypoint and a `letsencrypt` cert
resolver). Adjust the `Host(...)` label inside the compose file if you
want a different hostname.

```sh
cp compose.example.traefik.yaml compose.yaml
docker compose up -d
```

## Environment variables

| Name           | Description                                              |
| -------------- | -------------------------------------------------------- |
| `PORT`         | Host port to publish (port mode only). Defaults to 8080. |
| `TUNNEL_TOKEN` | Cloudflare Tunnel token (cloudflared deployment only).   |

## Updating the exercise catalogue

The catalogue is a TSV at `scripts/exercises.tsv` (same shape as the
original Google Sheet). After editing it:

```sh
npm run build-exercises
```

This regenerates `src/data/molecules.generated.ts` with up-to-date OCL
idCodes (computed by `openchemlib` at build time so the runtime
comparison is deterministic and offline-safe).

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md). The file is managed automatically
by release-please based on Conventional Commits.

## License

[MIT](./LICENSE)
