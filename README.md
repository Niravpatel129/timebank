# Timebank / HourBlock Desktop

Timebank is a desktop time-tracking and productivity application built with Electron and React. The app is designed for tracking work sessions, organizing time blocks, visualizing workflows, and packaging the experience as a distributable desktop application.

The repository contains executable desktop application code, release scripts, auto-update tooling, and UI patterns for a real productivity product.

## Core capabilities

- Desktop time-tracking workflow
- Task/time block management
- Visual workflow and schedule-style UI
- Drag-and-drop interactions
- React Flow-powered visual interfaces
- Electron desktop runtime
- macOS and Windows release tooling
- Auto-update support
- Packaged application builds

## Tech stack

- Electron
- React
- TypeScript / JavaScript
- React Flow
- DnD Kit
- Electron Builder
- electron-updater
- Tailwind/CSS tooling where configured

## Repository structure

Common areas include:

- `src/` - application source code
- `src/main/` - Electron main process logic where present
- `src/renderer/` - renderer UI where present
- `components/` - reusable UI components
- `assets/` - desktop app assets
- build/release configuration in `package.json`

Exact folder names may vary as the application evolves.

## Getting started

### Prerequisites

- Node.js
- npm
- Desktop development environment for Electron

### Install dependencies

```bash
npm install
```

### Start development mode

```bash
npm run dev
```

If the project separates React and Electron dev scripts, check `package.json` for the current commands.

## Build and release

The repository includes desktop build and release scripts for macOS and Windows.

Common workflows include:

```bash
npm run build
npm run release
npm run release:mac
npm run release:win
```

Use `package.json` as the source of truth for the latest script names.

## Environment and configuration

Most desktop configuration is handled through application code and Electron build settings. If local environment values are required, keep them in local-only files and do not commit secrets.

## Packaging notes

Before creating a shareable archive or release:

1. Remove `node_modules`
2. Remove generated build/release artifacts
3. Remove local cache folders
4. Verify the app starts cleanly from a fresh install
5. Confirm macOS/Windows release scripts are configured for the intended target

## Code quality notes

The project demonstrates a complete desktop application workflow with Electron packaging, app update tooling, interactive React UI, drag-and-drop interactions, and visual flow-based productivity interfaces.

## Security notes

Do not commit signing certificates, update provider credentials, local environment files, generated release artifacts, or machine-specific configuration.
