# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hashicon is a library that generates beautiful, deterministic visual representations of hash values as hexagonal icons. It produces unique canvas-based identicons with 3D-like geometric patterns and colors derived from any input string (UUIDs, addresses, etc.).

This is a Yarn workspaces monorepo containing two packages:
- `@emeraldpay/hashicon` - Core library (vanilla JS/TS)
- `@emeraldpay/hashicon-react` - React component wrapper

## Requirements

- Node.js 16+ (18 LTS recommended, see `.nvmrc`)

## Development Commands

```bash
# Install dependencies
yarn install

# Build all packages (outputs to lib/ in each package)
yarn build

# Start Storybook development environment (port 6006)
yarn workspace @emeraldpay/hashicon run storybook

# Build individual packages
yarn workspace @emeraldpay/hashicon run build
yarn workspace @emeraldpay/hashicon-react run build

# Clean build artifacts
yarn workspace @emeraldpay/hashicon run clean
yarn workspace @emeraldpay/hashicon-react run clean
```

Note: Tests are currently stubbed (`echo "*** TODO TESTS ***"`).

## Architecture

### Rendering Pipeline

1. **Hashing** (`index.ts`): Input string → BLAKE2s (default) or Keccak256 → 16-byte hash → 8 Uint16 values
2. **Parameter Mapping** (`renderer.ts`): Each Uint16 maps to a visual property (hue, saturation, lightness, shift, figureAlpha, figureIndex, variation)
3. **Canvas Drawing** (`renderer.ts`): Iterates through 27 sprites, drawing triangles with calculated HSL colors
4. **Pattern Overlay**: Applies one of 256 predefined geometric figures (`figures.ts`) with alpha blending

### Key Files

- `packages/hashicon/src/index.ts` - Main entry; exports `hashicon()` function, handles hasher selection
- `packages/hashicon/src/renderer.ts` - Canvas rendering; maps hash values to colors, draws sprites
- `packages/hashicon/src/params.ts` - Type definitions (`Params`, `Range`) and default parameter values
- `packages/hashicon/src/figures.ts` - 256 preselected 28-element arrays defining geometric patterns
- `packages/hashicon/src/sprite.ts` - 27 sprite definitions (position, shape index, lighting zone)
- `packages/hashicon/src/shapes.ts` - Two triangle shape definitions used in rendering
- `packages/hashicon-react/src/component.tsx` - React class component; renders hashicon as `<img>` with data URL

### Hasher Options

The `hasher` parameter controls which algorithm produces the visual seed:
- `"blake2"` (default) - BLAKE2s with keyed hash, faster
- `"keccak"` or `"legacy"` - Keccak256, for backward compatibility

## Code Style

- Tab indentation for source files
- No Prettier/ESLint configuration (follow existing style)
- TypeScript 5.x, target ES2020

## Publishing to npm

Pushing a `v*` tag runs `.github/workflows/publish.yml`, which tests, builds and **publishes to npm directly**
(no staged approval). It authenticates with npm Trusted Publishing (GitHub Actions OIDC); no `NPM_TOKEN` secret is used,
and provenance is attached automatically.

```bash
# after bumping "version" in packages/hashicon/package.json and packages/hashicon-react/package.json and pushing the commit
git tag vX.Y.Z && git push origin vX.Y.Z
```

Both packages are published by the same workflow; keep their versions equal. Each one needs its own Trusted Publisher entry.
The upstream `publish.yaml` (release-triggered, `NPM_TOKEN`) was removed.

- The job fails if the tag and the version in packages/hashicon/package.json and packages/hashicon-react/package.json differ, and does nothing if that version is already on npm.
- A prerelease (`1.2.0-beta.0`) is published under its identifier as the dist-tag (`beta`), not `latest`.
- Do not `npm publish` from a local machine (no tokens are kept).
- To re-run without moving the tag, start "Publish to npm" with workflow_dispatch (it publishes the version in packages/hashicon/package.json and packages/hashicon-react/package.json on the chosen branch).
- A PR that changes `publish.yml` runs the build and `npm pack --dry-run` without publishing.
- `repository` in package.json must point at this repository: provenance verification compares them and a mismatch fails the publish with `E422` (the workflow checks it first).
- Prerequisite: on npmjs.com, `@ideamans-npm/hashicon` and `@ideamans-npm/hashicon-react` lists GitHub Actions / `ideamans/hashicon-box` / `publish.yml` with the **publish** permission as its
  Trusted Publisher. With only the stage-publish permission, `npm publish` fails with `E403 OIDC permission denied`.
