import { createRoot } from 'react-dom/client';
import App from './app';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/content/components/Demo');

const root = document.createElement('div');
root.id = 'chrome-extension-dollar-to-yen-extension';
root.style.position = 'absolute';
root.style.zIndex = '2147483647';
root.style.top = '0';
root.style.bottom = '0';
root.style.left = '0';
root.style.right = '0';
root.style.width = '0';
root.style.height = '0';
root.style.margin = '0';
root.style.padding = '0';

document.body.append(root);

createRoot(root).render(<App />);
