import { getBottomNav } from './nav.js';

export default class DashboardView {
  static render(root, store, router) {
    const container = document.createElement('div');
    container.className = 'view-container animate-fade-in';
    container.style.paddingBottom = '80px'; // Space for nav

    const user = store.getUser();
    const vehicle = store.getVehicle();
    const nextServiceThreshold = store.getNextServiceThreshold();
    const currentOdo = vehicle.currentEstimatedOdometer;
    
    // Calculate progress percentage (0 to 100) based on 5000 interval
    const interval = 5000;
    const progressInInterval = currentOdo % interval;
    const progressPercent = Math.min(100, Math.max(0, (progressInInterval / interval) * 100));

    container.innerHTML = `
      <header style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2>Hi, ${user.name.split(' ')[0]} 👋</h2>
          <p>${vehicle.model}</p>
        </div>
        <div style="width: 40px; height: 40px; background: var(--glass-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          👤
        </div>
      </header>

      <section class="glass-panel health-card">
        <h3>Vehicle Health</h3>
        <p>Estimated Odometer</p>
        <div class="odometer-display">${currentOdo.toLocaleString()} km</div>
        
        <div style="text-align: left; margin-top: 24px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
            <span>Next Service</span>
            <span>${nextServiceThreshold.toLocaleString()} km</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${progressPercent}%"></div>
          </div>
          <p style="font-size: 0.8rem; margin-top: 8px; color: var(--text-secondary);">
            Based on your ${vehicle.dailyCommute} km/day commute.
          </p>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 16px;">Maintenance Hub</h3>
        <div class="card-grid">
          <div class="glass-panel" style="padding: 16px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h4 style="margin: 0;">Check Tire Pressure</h4>
              <p style="font-size: 0.8rem; margin: 4px 0 0;">Due in 200 km</p>
            </div>
            <button class="btn" style="background: rgba(255,255,255,0.1); width: auto; padding: 8px 16px;">Log</button>
          </div>
          <div class="glass-panel" style="padding: 16px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h4 style="margin: 0;">Chain Lube</h4>
              <p style="font-size: 0.8rem; margin: 4px 0 0;">Due in 500 km</p>
            </div>
            <button class="btn" style="background: rgba(255,255,255,0.1); width: auto; padding: 8px 16px;">Log</button>
          </div>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 16px;">Insurance Locker</h3>
        <div class="glass-panel" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2)); border: 1px solid rgba(139, 92, 246, 0.3);">
          <div style="display: flex; justify-content: space-between;">
            <h4>Comprehensive Cover</h4>
            <span style="color: var(--success);">Active</span>
          </div>
          <p style="font-size: 0.9rem; margin-top: 8px;">Expires in 142 days</p>
          
          <div style="margin-top: 16px; font-size: 0.9rem;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              ✅ <span style="color: var(--text-primary);">Own Damage (Zero Dep)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              ✅ <span style="color: var(--text-primary);">Third Party Liability</span>
            </div>
          </div>
          
          <button class="btn" style="background: rgba(255,255,255,0.1); margin-top: 16px;">Claim Guide</button>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 16px;">Tools</h3>
        <div class="glass-panel" style="padding: 16px; display: flex; align-items: center; gap: 16px; cursor: pointer;">
          <div style="font-size: 2rem;">🔍</div>
          <div>
            <h4 style="margin: 0;">Used Vehicle Inspector</h4>
            <p style="font-size: 0.8rem; margin: 4px 0 0;">Checklists for buying second-hand</p>
          </div>
        </div>
      </section>
    `;

    root.appendChild(container);
    root.appendChild(getBottomNav('/dashboard', router));
  }
}
