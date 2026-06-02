export default class Router {
  constructor(rootElement) {
    this.root = rootElement;
    this.routes = {};
    
    // Listen to history changes
    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.pathname);
    });
  }

  addRoute(path, renderFunction) {
    this.routes[path] = renderFunction;
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute(path);
  }

  handleRoute(path) {
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
