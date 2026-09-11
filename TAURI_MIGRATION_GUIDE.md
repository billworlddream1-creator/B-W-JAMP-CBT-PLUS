# Tauri Migration Guide (React + TypeScript to Desktop)

This guide provides step-by-step instructions for converting this React + TypeScript web application into a cross-platform desktop application using **Tauri v2**.

---

## 1. Why Tauri v2?

- **Extremely Small Binary Size**: Tauri uses the native system webview (WebView2 on Windows, WKWebView on macOS, WebKitGTK on Linux), resulting in application bundles starting under 10MB (compared to ~100MB+ for Electron).
- **Low Memory & CPU Usage**: Uses lightweight Rust for backend capabilities instead of bundling Node.js.
- **Enhanced Security**: Sandboxed renderer with explicit IPC capabilities.

---

## 2. Prerequisites

Before developing locally or building binaries, install the platform-specific dependencies:

### System Requirements
- **Node.js**: >= 20 (Node.js 22 recommended)
- **Rust**: Latest stable Rust toolchain (`rustup`)

### Platform-Specific Setup
- **Windows**:
  - Visual Studio C++ Build Tools (with "Desktop development with C++").
  - WebView2 Runtime (pre-installed on Windows 10/11).
- **macOS**:
  - Xcode Command Line Tools (`xcode-select --install`).
- **Linux (Debian/Ubuntu)**:
  - System packages:
    ```bash
    sudo apt update
    sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
    ```

---

## 3. Project Configuration Overview

### Directory Structure Added
```
├── .github/
│   └── workflows/
│       └── release.yml          # GitHub Actions multi-platform release CI/CD
├── src-tauri/
│   ├── capabilities/
│   │   └── default.json        # Tauri v2 capability configuration
│   ├── src/
│   │   ├── lib.rs              # Tauri Rust library entry point
│   │   └── main.rs             # Tauri binary entry point
│   ├── build.rs                # Rust build script
│   ├── Cargo.toml              # Rust project dependencies
│   └── tauri.conf.json         # Main Tauri v2 configuration file
├── package.json                # Added Tauri CLI scripts
└── vite.config.ts              # Tauri-compatible Vite configuration
```

### Configuration Highlights

1. **`src-tauri/tauri.conf.json`**:
   - `build.beforeDevCommand`: `npm run dev`
   - `build.devUrl`: `http://localhost:3000`
   - `build.beforeBuildCommand`: `npm run build`
   - `build.frontendDist`: `../dist`
   - `bundle.targets`: `["msi", "nsis", "dmg", "app", "deb", "appimage"]`

2. **`vite.config.ts`**:
   - Set `server.strictPort: true` and `server.port: 3000` so Tauri reliably connects to the Vite dev server.
   - Set `server.watch.ignored: ["**/src-tauri/**"]` to prevent hot-reload loops when Rust files change.

---

## 4. Local Development Workflow

To run the application in desktop development mode:

```bash
# Install dependencies
npm install

# Run the desktop app with Hot Module Reloading (HMR)
npm run desktop:dev
```

This command will:
1. Start Vite dev server at `http://localhost:3000`.
2. Compile the Rust backend in `src-tauri`.
3. Launch the native desktop window containing your React app.

---

## 5. Building Production Binaries Locally

To package production desktop installers for your current platform:

```bash
npm run desktop:build
```

The compiled bundles will be generated in `src-tauri/target/release/bundle/`:
- **Windows**: `.exe` (NSIS installer) and `.msi` (WiX installer) in `nsis/` and `msi/`.
- **macOS**: `.dmg` installer and `.app` bundle in `dmg/` and `macos/`.
- **Linux**: `.deb` package and `.AppImage` executable in `deb/` and `appimage/`.

---

## 6. Continuous Integration & Release (GitHub Actions)

The `.github/workflows/release.yml` workflow automates production builds and releases across all major platforms:

- **Trigger**: Push a tag matching `v*` (e.g., `git tag v1.0.0 && git push origin v1.0.0`).
- **Matrix Builders**:
  - `windows-latest`: Generates `.exe` and `.msi`.
  - `macos-latest`: Cross-compiles Universal macOS binaries (`x86_64` Intel + `aarch64` Apple Silicon) into `.dmg` and `.app`.
  - `ubuntu-22.04`: Installs WebKitGTK and builds `.deb` and `.AppImage`.
- **Publisher**: Uses `tauri-apps/tauri-action@v2` to publish compiled binaries directly to GitHub Releases.
