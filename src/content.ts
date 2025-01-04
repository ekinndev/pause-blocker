import { chromeStorage } from './utils/storage';

interface WhitelistItem {
  url: string;
}

// Check if current URL is in whitelist
const shouldApplyOverride = async (): Promise<boolean> => {
  const result = await chromeStorage.get(['whitelist']);
  const whitelist: WhitelistItem[] = result.whitelist || [];
  const currentHost = window.location.hostname;
  return !whitelist.some(item => currentHost.includes(item.url));
};

// Apply the visibility override
const applyOverride = (): void => {
  Object.defineProperty(document, 'hidden', { value: false });
  Object.defineProperty(document, 'visibilityState', { value: 'visible' });

  document.addEventListener(
    'visibilitychange',
    (e: Event) => {
      e.stopPropagation();
    },
    true
  );
};

// Initialize
(async (): Promise<void> => {
  const shouldOverride = await shouldApplyOverride();
  if (shouldOverride) {
    applyOverride();
  }
})();
