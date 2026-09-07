# JAMB CBT Plus

JAMB CBT Plus is a cross-platform application designed for JAMB exam preparation with interactive CBT practice and AI-powered study assistance.

## Supported Platforms

- **Web**: Standard browser access via Vite + React.
- **Android**: Native Android wrapper enabled via Capacitor (`/android`).
- **iOS**: Native iOS / Swift wrapper enabled via Capacitor (`/ios`).
- **macOS & Windows**: Desktop bundle support via automated CI artifact packaging.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- For Android local builds: Android Studio & JDK 17+
- For iOS local builds: macOS with Xcode installed

### Installation & Local Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Set `GEMINI_API_KEY` in `.env.local` to your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run Web Development Server:**
   ```bash
   npm run dev
   ```

---

## Building for Mobile (Android & iOS)

1. **Build web assets:**
   ```bash
   npm run build
   ```

2. **Sync with native platforms:**
   ```bash
   npx cap sync
   ```

3. **Open native projects:**
   - **Android:**
     ```bash
     npx cap open android
     ```
   - **iOS:**
     ```bash
     npx cap open ios
     ```

---

## GitHub Actions & Downloading Artifacts

Automated builds for all platforms are configured via GitHub Actions (`.github/workflows/build.yml`).

### Available Automated Artifacts

Every push or pull request to `main` / `master` triggers CI workflow builds that produce downloadable artifacts:

- **Android APK (`android-apk`)**: Contains the debug `.apk` file for testing directly on Android devices.
- **iOS & Swift Source (`ios-swift-app`)**: Contains the iOS Swift app bundle (`App.app`) and Xcode project source.
- **macOS App (`macos-app`)**: Contains the compiled desktop application web assets for macOS.
- **Windows App (`windows-app`)**: Contains the compiled desktop application web assets for Windows.

### Downloading Artifacts from GitHub Actions

1. Go to the **Actions** tab in your GitHub repository.
2. Click on the latest workflow run under **Multi-Platform Build & Artifact Release**.
3. Scroll down to the **Artifacts** section at the bottom of the run summary page.
4. Click on any artifact (e.g., `android-apk` or `ios-swift-app`) to download the `.zip` archive containing the built platform executable / bundle.
