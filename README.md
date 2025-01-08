# Pause Blocker Chrome Extension

A Chrome extension that prevents videosand media content from automatically pausing when you switch between tabs.

## Features

- Prevents auto-pause behavior when switching tabs
- Works on most websites that play media content
- Simple and lightweight
- Configurable through options page

## Installation

### From Source

1. Clone this repository:

```sh
git clone https://github.com/yourusername/pause-blocker
cd pause-blocker
```

2. Install dependencies:

```sh
npm install
```

3. Build the extension:

```sh
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist` directory from this project

## Development

To start development with hot-reload:

```sh
npm run dev
```

## Building

To create a production build:

```sh
npm run build
```

The built extension will be in the `dist` directory.

## Tech Stack

- React
- TypeScript
- Vite
- Chrome Extension Manifest V3

## License

MIT License

## Version

Current version: 1.0.1
