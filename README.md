# spellbookx-template-monorepo

[![CI](https://github.com/dcdavidev/spellbookx-template-monorepo/actions/workflows/code-quality-tests-build.yml/badge.svg)](https://github.com/dcdavidev/spellbookx-template-monorepo/actions/workflows/code-quality-tests-build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Opinionated Turborepo monorepo TypeScript starter powered by [Spellbookx](https://github.com/dcdavidev/spellbookx): zero setup, start coding right away.

## What's Included

- **Turborepo & pnpm Workspaces**: Multi-package workspace layout under [`packages/*`](./packages) managed by [pnpm](https://pnpm.io/) ([`pnpm-workspace.yaml`](./pnpm-workspace.yaml)) and orchestrated by [Turborepo](https://turborepo.com/) ([`turbo.json`](./turbo.json)) with dependency-aware task caching (`pnpm build`, `pnpm check`, `pnpm lint`, `pnpm test`, `pnpm dev`, `pnpm clean`).
- **TypeScript & ESM**: Shared strict base configuration targeting `ES2024` with `NodeNext` module resolution ([`tsconfig.base.json`](./tsconfig.base.json)), root script type-checking ([`tsconfig.json`](./tsconfig.json)), and per-package `dist/` builds with type declarations and source maps (`tsconfig.build.json`).
- **Code Quality & Formatting**: Preconfigured [Spellbookx](https://github.com/dcdavidev/spellbookx) presets for ESLint (`eslint-plugin-spellbookx` with `recommended-spellcheck`), Prettier (`prettier-config-spellbookx/base`), and CSpell (`cspell-config-spellbookx` with a project dictionary at [`.config/cspell/custom.txt`](./.config/cspell/custom.txt)).
- **Conventional Commits & Git Hooks**: Commitlint (`commitlint-config-spellbookx` with automatic workspace package scope discovery), an interactive `czg` commit prompt (`cz-config-spellbookx`), and [Lefthook](./.config/lefthook.yml) hooks that auto-fix staged files on `pre-commit` and validate commit messages on `commit-msg`.
- **Testing & Coverage**: [Vitest](https://vitest.dev/) with V8 coverage across workspace packages, orchestrated and cached via Turborepo.
- **Versioning & Changelogs**: [Changesets](https://github.com/changesets/changesets) with `@changesets/changelog-github` and `changeset-conventional-commits` for multi-package versioning and release notes.
- **CI & Automated Maintenance**: GitHub Actions for build, commit validation, linting, formatting, spell-checking, type-checking, and tests ([`code-quality-tests-build.yml`](./.github/workflows/code-quality-tests-build.yml)), plus weekly Dependabot updates ([`dependabot.yml`](./.github/dependabot.yml)) and scheduled Node.js LTS and Turborepo update workflows.
- **Editor & AI Tooling**: Ready-to-use VS Code workspace settings and recommended extensions ([`.vscode/`](./.vscode)), [`.editorconfig`](./.editorconfig), and Spellbookx skills for AI coding assistants ([`.agents/skills/`](./.agents/skills)).

## Requirements

- **Node.js `26.x`** (pinned in [`.nvmrc`](./.nvmrc))
- **pnpm `12.x`** (pinned via `packageManager` and `devEngines` in [`package.json`](./package.json))

## Quick Start

1. **Create a repository from this template** by clicking **Use this template** on GitHub, or using the GitHub CLI:

   ```bash
   gh repo create my-monorepo --template dcdavidev/spellbookx-template-monorepo --clone
   cd my-monorepo
   ```

2. **Use the pinned Node.js version** (if using `nvm`):

   ```bash
   nvm install
   nvm use
   ```

3. **Install dependencies** (this also installs the Lefthook Git hooks via `prepare`):

   ```bash
   pnpm install
   ```

4. **Run the full verification suite**:

   ```bash
   pnpm check
   ```

### Template Customization Checklist

After creating a new project from this template:

- Update repository metadata (`description`, `keywords`, `homepage`, `bugs`, `repository`, `author`) in the root [`package.json`](./package.json) and in each workspace package under [`packages/`](./packages).
- Update the GitHub repository slug (`changelog[1].repo`) in [`.changeset/config.json`](./.changeset/config.json).
- Update the copyright holder in [`LICENSE`](./LICENSE) if needed.
- Rename, replace, or expand the starter package in [`packages/greet/`](./packages/greet).
- Add project-specific terms to [`.config/cspell/custom.txt`](./.config/cspell/custom.txt) and update `README.md` and [`docs/`](./docs).

## Project Structure

```text
.
├── .agents/skills/          # Spellbookx skills for AI coding assistants
├── .changeset/              # Changesets configuration and pending release notes
├── .config/                 # CSpell and Lefthook configuration files
├── .github/                 # CI workflows, scheduled maintenance, and Dependabot
├── .vscode/                 # Recommended VS Code extensions and workspace settings
├── docs/                    # Contributing guide, security policy, and contributor docs
├── packages/                # Workspace packages managed by pnpm and Turborepo
│   └── greet/               # Starter TypeScript library package
│       ├── src/             # Package TypeScript source code
│       ├── tests/           # Package Vitest unit and integration tests
│       ├── package.json     # Package metadata, exports, scripts, and dependencies
│       ├── tsconfig.build.json
│       └── tsconfig.json
├── scripts/                 # Maintenance scripts (update-node.ts, update-turbo.ts)
├── commitlint.config.mjs    # Commitlint configuration
├── cz.config.mjs            # Interactive czg commit prompt configuration
├── eslint.config.mjs        # ESLint flat configuration
├── package.json             # Root workspace metadata, scripts, and shared devDependencies
├── pnpm-workspace.yaml      # pnpm workspace globs, build allow-list, and hoisting rules
├── prettier.config.mjs      # Prettier configuration
├── tsconfig.base.json       # Shared base TypeScript compiler options
├── tsconfig.json            # Root TypeScript configuration for scripts/
└── turbo.json               # Turborepo task pipeline and caching configuration
```

For full details on configuration placement, build outputs, and tooling, see the [Architecture](./docs/contribute/architecture.md) guide.

## Available Scripts

| Script              | What it does                                                                                                                 |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------- |
| `build`             | Builds all workspace packages in topological order via Turborepo (`turbo run build`).                                        |
| `changeset`         | Creates a changeset interactively.                                                                                           |
| `changeset:commits` | Generates changesets from Conventional Commits (`changeset-conventional`).                                                   |
| `changeset:version` | Consumes pending changesets, bumps package versions, and updates package `CHANGELOG.md` files.                               |
| `check`             | Type-checks root `scripts/` and runs `build`, `lint:code`, `lint:spelling`, `lint:types`, `fmt:check`, and `test` via Turbo. |
| `clean`             | Removes generated build, coverage, and cache outputs in all packages (`turbo run clean`).                                    |
| `commit`            | Launches the interactive `czg` Conventional Commits prompt.                                                                  |
| `dev`               | Runs package watch builds concurrently via Turborepo (`turbo run dev`).                                                      |
| `fmt`               | Formats all supported files with Prettier.                                                                                   |
| `fmt:check`         | Verifies Prettier formatting without modifying files.                                                                        |
| `lint`              | Runs `lint:code` and `lint:spelling` via Turborepo.                                                                          |
| `lint:code`         | Lints the repository with ESLint.                                                                                            |
| `lint:code:fix`     | Lints the repository with ESLint and applies automatic fixes.                                                                |
| `lint:commits`      | Validates the latest commit message with Commitlint (`HEAD~1`).                                                              |
| `lint:spelling`     | Checks spelling across the repository with CSpell.                                                                           |
| `lint:types`        | Type-checks root `scripts/` and all workspace packages (`tsc --noEmit && turbo run lint:types`).                             |
| `prepare`           | Installs Lefthook Git hooks.                                                                                                 |
| `test`              | Runs Vitest with V8 coverage across all workspace packages (`turbo run test`).                                               |
| `update:node`       | Syncs `.nvmrc` and `@types/node` across the workspace with the latest active Node.js LTS release.                            |
| `update:turbo`      | Upgrades `turbo` and runs `@turbo/codemod` migrations.                                                                       |

Run any script with `pnpm <script>` (for example, `pnpm check` or `pnpm exec turbo run test --force` to bypass the Turborepo cache).

## Documentation

- [Contributing Guide](./docs/CONTRIBUTING.md)
- [Development Environment](./docs/contribute/development-environment.md)
- [Architecture](./docs/contribute/architecture.md)
- [Code Conventions](./docs/contribute/code-conventions.md)
- [Commit Message Style](./docs/contribute/commit-style.md)
- [Package.json Scripts Naming Conventions](./docs/contribute/package-json-scripts-naming-conventions.md)
- [Tests](./docs/contribute/tests.md)
- [Security Policy](./docs/SECURITY.md)

## Contributing

Contributions are welcome! Please read the [Contributing Guide](./docs/CONTRIBUTING.md) before opening an issue or pull request.

## Security

To report a security vulnerability privately, please follow the [Security Policy](./docs/SECURITY.md).

## License

MIT © [Davide Di Criscito](./LICENSE)
