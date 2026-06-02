export default class Router {
  constructor(rootElement) {
    this.root = rootElement;
    this.routes = {};
    
    // Listen to history changes
    window.addEventListener('hashchange', () => {
      this.handleRoute();
    });
  }

  addRoute(path, renderFunction) {
    this.routes[path] = renderFunction;
  }

  navigate(path) {
    // If the hash is already the target path, hashchange won't fire, so trigger it manually
    if (window.location.hash === '#' + path || window.location.hash === path) {
      this.handleRoute();
    } else {
      window.location.hash = path;
    }
  }

  handleRoute() {
    const hash = window.location.hash || '#/';
    const path = hash.replace('#', '');
    
    // Basic exact match routing for MVP
    const route = this.routes[path] || this.routes['/'];
    if (route) {
      // Clear current content
      this.root.innerHTML = '';
      document.body.classList.remove('panic-mode-active'); // Reset any global state
      route();
    }
  }
}
