export {}

function loadCOIServiceWorker() {
  if (typeof window !== 'undefined' && window.location.hostname != 'localhost') {
    const coi = window.document.createElement('script');
    coi.setAttribute('src','/proof-of-ownership-zkapp/coi-serviceworker.min.js');
    window.document.head.appendChild(coi);
  }
}

loadCOIServiceWorker();
