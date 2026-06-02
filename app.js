import Router from './js/router.js';
import Store from './js/store.js';
import OnboardingView from './js/views/onboarding.js';
import DashboardView from './js/views/dashboard.js';
import EmergencyView from './js/views/emergency.js';

class App {
  constructor() {
    this.root = document.getElementById('app');
    this.store = new Store();
    this.router = new Router(this.root);
    
    this.init();
  }

  async init() {
    // Initialize routes
    this.router.addRoute('/', () => OnboardingView.render(this.root, this.store, this.router));
    this.router.addRoute('/dashboard', () => DashboardView.render(this.root, this.store, this.router));
    this.router.addRoute('/emergency', () => EmergencyView.render(this.root, this.store, this.router));

    // Check if user has completed onboarding
    const user = this.store.getUser();
    if (user && user.isSetupComplete) {
      // Simulate auto-pilot mileage tracking on app load
      this.store.simulateDailyMileage();
      this.router.navigate('/dashboard');
    } else {
      this.router.navigate('/');
    }
  }
}

// Initialize app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
  });
} else {
  window.app = new App();
}
