// pwa-handler.js - Handle PWA install prompt and service worker registration
// This file replaces the inline script for PWA functionality

let deferredPrompt;

// PWA install prompt handler
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  window.deferredPrompt = deferredPrompt;
  
  console.log('PWA install prompt available');
  
  // Optionally, send analytics event that PWA install promo was shown
  if (window.gtag) {
    window.gtag('event', 'pwa_install_prompt_shown');
  }
});

// Handle the app install event
window.addEventListener('appinstalled', (e) => {
  console.log('PWA was installed successfully');
  deferredPrompt = null;
  window.deferredPrompt = null;
  
  // Optionally, send analytics event
  if (window.gtag) {
    window.gtag('event', 'pwa_installed');
  }
});

// Function to trigger PWA install (can be called from React components)
window.installPWA = async () => {
  if (deferredPrompt) {
    // Show the prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the deferredPrompt for next time
    deferredPrompt = null;
    window.deferredPrompt = null;
    
    return outcome === 'accepted';
  }
  return false;
};

// Service Worker registration with enhanced error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })
    .then((registration) => {
      console.log('SW registered successfully:', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available
            console.log('New content is available; please refresh.');
            
            // You can dispatch a custom event here for React to listen to
            window.dispatchEvent(new CustomEvent('swUpdate', {
              detail: { registration }
            }));
          }
        });
      });
    })
    .catch((registrationError) => {
      console.error('SW registration failed:', registrationError);
    });
  });

  // Handle service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service worker controller changed, reloading...');
    window.location.reload();
  });
}

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('App is back online');
  // Dispatch custom event for React components
  window.dispatchEvent(new CustomEvent('appOnline'));
});

window.addEventListener('offline', () => {
  console.log('App is offline');
  // Dispatch custom event for React components
  window.dispatchEvent(new CustomEvent('appOffline'));
});

// Expose PWA status for React components
window.getPWAStatus = () => {
  return {
    isInstallable: !!deferredPrompt,
    isInstalled: window.matchMedia('(display-mode: standalone)').matches,
    isServiceWorkerSupported: 'serviceWorker' in navigator,
    isOnline: navigator.onLine
  };
};

// Export for module compatibility
export { };