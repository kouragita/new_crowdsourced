// app-loader.js - Handle loading screen fade out
// This file replaces the inline script for loading screen management

// Hide loading screen once app is loaded
window.addEventListener('load', () => {
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        // Cleanup - remove from DOM completely
        loadingScreen.remove();
      }, 500);
    }
  }, 1000);
});

// Handle loading screen removal from React side as well
window.removeLoadingScreen = () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }
};

// Export for module compatibility
export { };