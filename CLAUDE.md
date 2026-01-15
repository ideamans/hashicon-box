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
