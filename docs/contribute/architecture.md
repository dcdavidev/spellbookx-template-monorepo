# Architecture

This guide describes the layout, configuration conventions, build pipeline, and developer toolchain of `spellbookx-template-monorepo`.

## Overview

`spellbookx-template-monorepo` is a Turborepo TypeScript and ECMAScript Module (`"type": "module"`) monorepo starter template preconfigured with the Spellbookx developer toolchain:

- **Runtime & package manager**: Node.js `26.x` (pinned in [`.nvmrc`](../../.nvmrc)) and pnpm `12.x` workspaces (pinned via `packageManager` and `devEngines` in [`package.json`](../../package.json)).
- **Language & compiler**: TypeScript targeting `ES2024` with `NodeNext` module resolution and strict type-checking, shared via [`tsconfig.base.json`](../../tsconfig.base.json).
- **Task orchestration**: [Turborepo](https://turborepo.com/) for topological builds, local task caching, and parallel execution across workspace packages (`pnpm build`, `pnpm check`, `pnpm lint`, `pnpm test`).
- **Quality & formatting**: ESLint (`eslint-plugin-spellbookx`), Prettier (`prettier-config-spellbookx`), CSpell (`cspell-config-spellbookx`), Commitlint (`commitlint-config-spellbookx`), `czg` (`cz-config-spellbookx`), and Lefthook.
- **Testing & releases**: [Vitest](https://vitest.dev/) with V8 coverage and [Changesets](https://github.com/changesets/changesets).

## Directory Layout

```text
.
├── .agents/skills/          # AI coding assistant skills for Spellbookx tools
├── .changeset/              # Changesets configuration and pending release notes
├── .config/                 # Tool configs without `.config.` in the file name
│   ├── cspell/
│   │   └── custom.txt       # Project-specific CSpell word list
│   ├── cspell.yml           # CSpell configuration
│   └── lefthook.yml         # Lefthook Git hook definitions
├── .github/
│   ├── dependabot.yml       # Weekly dependency and GitHub Actions updates
│   └── workflows/           # CI checks and scheduled maintenance workflows
├── .vscode/                 # Recommended VS Code extensions and workspace settings
├── docs/
│   ├── CONTRIBUTING.md      # Main contributing guide
│   ├── SECURITY.md          # Security policy and vulnerability reporting
│   └── contribute/          # Detailed contributor documentation
├── packages/
│   └── greet/               # Starter TypeScript library package
│       ├── coverage/        # Vitest coverage output (generated, gitignored)
│       ├── dist/            # Compiled JS, declarations, and source maps (generated, gitignored)
│       ├── src/             # Package TypeScript source code
│       ├── tests/           # Package Vitest unit and integration tests
│       ├── package.json     # Package metadata, exports, scripts, and devDependencies
│       ├── README.md        # Package usage documentation
│       ├── tsconfig.build.json # TypeScript emit configuration for `dist/`
│       └── tsconfig.json    # Package TypeScript configuration extending `tsconfig.base.json`
├── scripts/
│   ├── update-node.ts       # Syncs `.nvmrc` and `@types/node` with Node.js LTS
│   └── update-turbo.ts      # Upgrades `turbo` and runs `@turbo/codemod`
├── .editorconfig            # Cross-editor indentation and line-ending defaults
├── .prettierignore          # Paths excluded from Prettier formatting
├── commitlint.config.mjs    # Commitlint preset configuration
├── cz.config.mjs            # Interactive `czg` commit prompt configuration
├── eslint.config.mjs        # ESLint flat config (`recommended-spellcheck`)
├── package.json             # Root workspace scripts and shared devDependencies
├── pnpm-workspace.yaml      # pnpm workspace globs, build allow-list, and hoisting rules
├── prettier.config.mjs      # Prettier base preset configuration
├── tsconfig.base.json       # Shared base TypeScript compiler options
├── tsconfig.json            # Root TypeScript configuration for `scripts/`
└── turbo.json               # Turborepo task graph, inputs, outputs, and caching rules
```

## Configuration Placement Convention

Configuration files follow a consistent placement rule:

- **Files with `.config.` in the name** live in the **repository root**, where their CLIs discover them automatically without extra flags: [`eslint.config.mjs`](../../eslint.config.mjs), [`prettier.config.mjs`](../../prettier.config.mjs), [`commitlint.config.mjs`](../../commitlint.config.mjs), and [`cz.config.mjs`](../../cz.config.mjs).
- **Tool-name-only configuration files** live in `.config/`: [`.config/cspell.yml`](../../.config/cspell.yml) (with its dictionary at [`.config/cspell/custom.txt`](../../.config/cspell/custom.txt)) and [`.config/lefthook.yml`](../../.config/lefthook.yml). Both CSpell and Lefthook auto-discover their files inside `.config/`.
- **Core platform files** stay in the repository root as required by their tools: [`package.json`](../../package.json), [`pnpm-workspace.yaml`](../../pnpm-workspace.yaml), [`tsconfig.base.json`](../../tsconfig.base.json), [`tsconfig.json`](../../tsconfig.json), [`turbo.json`](../../turbo.json), [`.nvmrc`](../../.nvmrc), [`.editorconfig`](../../.editorconfig), and [`.prettierignore`](../../.prettierignore).
- **Per-package files** live inside each package directory under `packages/<name>/`: `package.json`, `tsconfig.json`, `tsconfig.build.json`, `src/`, `tests/`, and `README.md`.

## Build and Package Exports

The monorepo separates shared compiler defaults, type-checking, and build emission:

- [`tsconfig.base.json`](../../tsconfig.base.json) defines shared strict compiler options (`target: "ES2024"`, `module: "NodeNext"`, `moduleResolution: "NodeNext"`, `strict: true`, `verbatimModuleSyntax: true`, `noEmit: true`).
- Root [`tsconfig.json`](../../tsconfig.json) extends `tsconfig.base.json` and covers `scripts/**/*` for root maintenance scripts.
- Each package's `tsconfig.json` (for example [`packages/greet/tsconfig.json`](../../packages/greet/tsconfig.json)) extends `../../tsconfig.base.json` and covers `src/**/*` and `tests/**/*`. It is used by `pnpm lint:types` (`tsc -p tsconfig.json`) and editor language services.
- Each package's `tsconfig.build.json` (for example [`packages/greet/tsconfig.build.json`](../../packages/greet/tsconfig.build.json)) extends `./tsconfig.json`, sets `noEmit: false`, restricts `include` to `src/**/*`, and emits JavaScript, `.d.ts` type declarations, `.d.ts.map` declaration maps, and `.js.map` source maps into `dist/`. It is used by `pnpm build` (`tsc -p tsconfig.build.json`).

In each publishable package's `package.json`, only `dist` is listed in `files`, and the package exposes ESM entry points via `exports`, `main`, `module`, and `types`:

```json
{
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    }
  }
}
```

## Quality Toolchain and Git Hooks

All linting, formatting, spelling, and commit rules come from Spellbookx preset packages configured once at the repository root:

| Concern           | Config file                                            | Preset package                                        |
| :---------------- | :----------------------------------------------------- | :---------------------------------------------------- |
| Code linting      | [`eslint.config.mjs`](../../eslint.config.mjs)         | `eslint-plugin-spellbookx` (`recommended-spellcheck`) |
| Formatting        | [`prettier.config.mjs`](../../prettier.config.mjs)     | `prettier-config-spellbookx/base`                     |
| Spell-checking    | [`.config/cspell.yml`](../../.config/cspell.yml)       | `cspell-config-spellbookx`                            |
| Commit validation | [`commitlint.config.mjs`](../../commitlint.config.mjs) | `commitlint-config-spellbookx`                        |
| Guided commits    | [`cz.config.mjs`](../../cz.config.mjs)                 | `cz-config-spellbookx`                                |
| Git hooks         | [`.config/lefthook.yml`](../../.config/lefthook.yml)   | `lefthook`                                            |

[`.config/lefthook.yml`](../../.config/lefthook.yml) defines two hooks installed by `pnpm prepare`:

- **`pre-commit`** (piped): runs `eslint --no-warn-ignored --fix` and then `prettier --ignore-unknown --write` on staged files, automatically re-staging any fixes (`stage_fixed: true`).
- **`commit-msg`**: validates the commit message with `commitlint --edit {1}`.

## Task Orchestration and Caching (Turborepo)

[`turbo.json`](../../turbo.json) coordinates tasks across workspace packages and root checks:

- **Global dependencies**: `.nvmrc`, `pnpm-lock.yaml`, and `tsconfig.base.json` invalidate cached results whenever the Node.js version, dependencies, or shared TypeScript compiler options change.
- **Package tasks**: `build` (`dependsOn: ["^build"]`, outputs `dist/**`), `lint:types` (`dependsOn: ["^build"]`), `test` (`dependsOn: ["^build"]`, outputs `coverage/**`), `clean` (uncached), and `dev` (uncached, persistent).
- **Root tasks**: `//#lint:code`, `//#lint:spelling`, and `//#fmt:check` run once at the repository root while still benefiting from Turborepo caching.
- **Aggregate commands**: `pnpm lint` runs `lint:code` and `lint:spelling`; `pnpm check` type-checks root `scripts/` and runs all verification tasks in parallel. Pass `--force` to Turbo commands to bypass the local `.turbo/` cache.

## pnpm Workspace Settings

[`pnpm-workspace.yaml`](../../pnpm-workspace.yaml) configures the workspace layout and pnpm policies:

- `packages`: registers `packages/*` as workspace packages.
- `allowBuilds`: explicitly permits post-install build scripts only for `esbuild` and `lefthook`.
- `engineStrict: true`: enforces runtime and package manager constraints.
- `publicHoistPattern`: hoists `*prettier-plugin-*` and `@prettier/plugin-*` so Prettier and editor plugins resolve Spellbookx's bundled Prettier plugins cleanly.

## CI and Maintenance Automation

- **CI** ([`.github/workflows/code-quality-tests-build.yml`](../../.github/workflows/code-quality-tests-build.yml)): runs on every pull request and push to `main` with `LEFTHOOK=0` and `TURBO_TELEMETRY_DISABLED=1`, executing install, build, PR commitlint, lint, format check, spell check, type check, and tests as separate steps.
- **Maintenance scripts**: [`scripts/update-node.ts`](../../scripts/update-node.ts) and [`scripts/update-turbo.ts`](../../scripts/update-turbo.ts) are run via `tsx` both locally (`pnpm update:node`, `pnpm update:turbo`) and on weekly GitHub Actions schedules ([`update-node.yml`](../../.github/workflows/update-node.yml) and [`update-turbo.yml`](../../.github/workflows/update-turbo.yml)) that open automated pull requests when updates are available.
- **Dependency updates**: [`.github/dependabot.yml`](../../.github/dependabot.yml) schedules weekly grouped updates for npm dependencies and GitHub Actions.
