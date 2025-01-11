interface WebsitelistItem {
  url: string;
}

// Direct override without injection
const override = () => {
  // Override at prototype level
  Object.defineProperty(Document.prototype, 'hidden', {
    get: function () {
      return false;
    },
    set: function () {
      // Maintain setter but ignore value
    },
    configurable: true,
    enumerable: true,
  });

  Object.defineProperty(Document.prototype, 'visibilityState', {
    get: function () {
      return 'visible';
    },
    set: function () {
      // Maintain setter but ignore value
    },
    configurable: true,
    enumerable: true,
  });

  // Override hasFocus
  Document.prototype.hasFocus = function () {
    return true;
  };

  // Prevent visibility change events
  const stopEvent = (e: Event) => {
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  document.addEventListener('visibilitychange', stopEvent, true);
  document.addEventListener('webkitvisibilitychange', stopEvent, true);
  document.addEventListener('mozvisibilitychange', stopEvent, true);
  document.addEventListener('msvisibilitychange', stopEvent, true);
  window.addEventListener('blur', stopEvent, true);
  window.addEventListener('focus', stopEvent, true);

  // Watch for video elements and prevent them from pausing
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node instanceof HTMLVideoElement || node instanceof HTMLMediaElement) {
          const video = node as HTMLVideoElement;
          video.addEventListener(
            'pause',
            e => {
              e.preventDefault();
              e.stopImmediatePropagation();
              video.play();
            },
            true
          );
        }
      });
    });
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
  });
};

// Check if current URL is in whitelist
const shouldApplyOverride = async (): Promise<boolean> => {
  try {
    const result = await chrome.storage.sync.get(['whitelist']);
    const websiteList: WebsitelistItem[] = result.whitelist || [];
    const currentHost = window.location.hostname.replace(/^www\./, '');

    // Try exact match first
    if (websiteList.some(item => item.url === currentHost)) {
      return true;
    }

    // Try domain match
    return websiteList.some(item => currentHost.endsWith(item.url));
  } catch {
    return false;
  }
};

// Initialize
(async (): Promise<void> => {
  const shouldOverride = await shouldApplyOverride();
  if (shouldOverride) {
    override();
    // Reapply periodically to ensure it stays in effect
    setInterval(override, 100);
  }
})();
