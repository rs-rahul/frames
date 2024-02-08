// src/serviceWorkerRegistration.js
export function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/frames/sw.js").then(
        (registration) => {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        },
        (error) => {
          console.log("ServiceWorker registration failed: ", error);
        }
      );
    });
  }
}
