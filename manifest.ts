import packageJson from './package.json';

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: 'USD to JPY',
  version: packageJson.version,
  description: '米ドル to 日本円',
  background: { service_worker: 'src/pages/background/index.js' },
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: 'icon-34.png',
  },
  icons: {
    '128': 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: ['src/pages/content/index.js'],
      css: ['assets/css/contentStyle.css'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['assets/*/*.*', 'icon-128.png', 'icon-34.png'],
      matches: ['*://*/*'],
    },
  ],
  permissions: ['storage', 'webNavigation'],
};

export default manifest;
