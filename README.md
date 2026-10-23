# CRUD Desktop (React + Electron)

A small offline desktop contact manager. Create, read, update, delete, and search contacts. Data is stored as JSON in Electron's per-user application data directory and remains on the device.

## Requirements
- Node.js 20 or newer
- npm

## Run in development
```bash
npm install
npm run dev
```

## Build a Windows installer
Run this on Windows (recommended) or a compatible build environment:
```bash
npm install
npm run dist:win
```
The NSIS installer is written to `release/CRUD Desktop Setup 1.0.0.exe` (filename may vary slightly by electron-builder version).

## Build Linux AppImage
```bash
npm install
npm run dist:linux
```

## Notes
- The app works offline after installation; the optional Google Fonts import only affects typography when internet access is available.
- Records are stored locally. Back up the app's user-data directory if you need to preserve records across devices.
- This is a starter app, not a multi-user database. Deleting a record is permanent after confirmation.
