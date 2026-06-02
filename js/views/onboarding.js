export default class OnboardingView {
  static render(root, store, router) {
    const container = document.createElement('div');
    container.className = 'view-container animate-fade-in';
    
    container.innerHTML = `
      <div style="text-align: center; padding-top: 40px;">
        <h1>SOS Moto</h1>
        <p>Your Vehicle's Best Friend.</p>
      </div>
      
      <form id="onboardingForm" class="glass-panel" style="margin-top: 24px;">
        <h2>Setup Profile</h2>
        
        <div class="input-group">
          <label for="name">Your Name</label>
          <input type="text" id="name" class="input-field" required placeholder="John Doe">
        </div>

        <div class="input-group">
          <label for="phone">Phone Number</label>
          <input type="tel" id="phone" class="input-field" required placeholder="+1 234 567 8900">
        </div>

        <h3 style="margin-top: 24px;">Vehicle Details</h3>

        <div class="input-group">
          <label for="category">Category</label>
          <select id="category" class="input-field" required>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="scooter">Scooter</option>
            <option value="ev">EV</option>
          </select>
        </div>

        <div class="input-group">
          <label for="model">Make & Model</label>
          <input type="text" id="model" class="input-field" required placeholder="e.g. TVS Apache RTR 160">
        </div>

        <div class="input-group">
          <label for="odometer">Current Odometer (km)</label>
          <input type="number" id="odometer" class="input-field" required placeholder="5000">
        </div>

        <div class="input-group">
          <label for="commute">Avg. Daily Commute (km)</label>
          <input type="number" id="commute" class="input-field" required placeholder="30">
        </div>

        <button type="submit" class="btn btn-primary" style="margin-top: 24px;">Start Engine</button>
      </form>
    `;

    root.appendChild(container);

    document.getElementById('onboardingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const userData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
      };

      const vehicleData = {
        category: document.getElementById('category').value,
        model: document.getElementById('model').value,
        baselineOdometer: document.getElementById('odometer').value,
        dailyCommute: document.getElementById('commute').value,
      };

      store.setupUserAndVehicle(userData, vehicleData);
      router.navigate('/dashboard');
    });
  }
}
