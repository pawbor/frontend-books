export default function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .catch(registrationError => {
          console.error('SW registration failed: ', registrationError);
        });
    });
  }  
}
