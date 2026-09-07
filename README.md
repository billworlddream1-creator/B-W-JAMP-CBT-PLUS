<div align="center">
  <img src="public/logo.png" alt="B&W JAMB CBT PLUS Logo" width="160" height="160" style="border-radius: 20px;" />
  <h1>B&W JAMB CBT PLUS</h1>
  <p><strong>Premier High-Fidelity Multi-Platform JAMB Exam Simulation System</strong></p>

  [![Build Status](https://github.com/user/repo/actions/workflows/build.yml/badge.svg)](https://github.com/user/repo/actions)
  ![Platforms](https://img.shields.io/badge/Platforms-Android%20%7C%20iOS%20%7C%20macOS%20%7C%20Windows%20%7C%20Web-blue)
  ![License](https://img.shields.io/badge/License-MIT-green)
</div>

---

## 📱 Features

- **Integrated Image Logo Branding**: Custom JAMB app logo featured across app icons, header branding, splash screens, and favicons.
- **First-Open Splash Screen**: Visually stunning splash landing screen featuring the logo on initial app load.
- **Cross-Platform Support**: Full cross-platform compatibility across **Android**, **iOS**, **macOS**, and **Windows**.
- **Automated GitHub Workflows & Artifact Downloads**: GitHub CI/CD configured to automatically build and provide downloadable artifacts for:
  - **Android APK Download** (`Android-APK-Download`)
  - **iOS & Swift Package Download** (`iOS-Swift-Package-Download`)
  - **macOS Application Download** (`macOS-Application-Download`)
  - **Windows Application Download** (`Windows-Application-Download`)
- **JAMB CBT Engine**: Exam simulation, study hub, real-time telemetry analytics, progress tracker, and hall of fame.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites

- **Node.js**: v18 or v20+
- **npm**: v9+

### Installation & Execution

1. Clone the repository and install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

---

## 🛠️ Cross-Platform Mobile & Desktop Builds

### Capacitor Commands

- **Android**:
  ```bash
  npm run build:android
  ```
- **iOS**:
  ```bash
  npm run build:ios
  ```
- **Desktop (macOS & Windows)**:
  ```bash
  npm run build:desktop
  ```

---

## 📦 GitHub Workflows & Artifact Downloads

Every commit or pull request triggers the multi-platform GitHub workflow defined in `.github/workflows/build.yml`.

### How to Download Artifacts:

1. Navigate to the **Actions** tab in the GitHub repository.
2. Select the latest run of the **Cross-Platform Multi-OS Build Workflow**.
3. Scroll down to the **Artifacts** section.
4. Download your preferred package:
   - 🤖 **Android-APK-Download** (Contains `.apk` package for Android installation)
   - 🍎 **iOS-Swift-Package-Download** (Contains Xcode Swift project & iOS app assets)
   - 💻 **macOS-Application-Download** (Contains macOS app package)
   - 🪟 **Windows-Application-Download** (Contains Windows app package)

---

## 📄 License

This project is licensed under the MIT License.
