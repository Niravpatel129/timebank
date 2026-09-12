# Build and Run Instructions

## Prerequisites

- Node.js 20 or newer
- npm
- macOS tooling for signed/notarized macOS releases and Windows tooling/certificates for signed Windows releases, if packaging installers

## Install

```bash
git clone https://github.com/Niravpatel129/timebank.git
cd timebank
npm install
```

Configure any required local environment values before running the application.

## Run in development

```bash
npm start
```

This starts both the renderer development server and the Electron main process.

## Build and run locally

```bash
npm run build:local
npm run start:local
```

## Package the application

macOS:

```bash
npm run build
```

Windows:

```bash
npm run build:win
```

General packaging:

```bash
npm run package
```

Release commands may publish signed artifacts, so use `npm run release` or `npm run release:win` only when release credentials are configured and publishing is intended.