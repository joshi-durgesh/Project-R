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
          <h2>Hi, ${user.name.split(' ')[0]} <span>&#128075;</span></h2>
          <p>${vehicle.model}</p>
        </div>
        <div style="width: 40px; height: 40px; background: var(--glass-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <span>&#128100;</span>
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
        <div id="insuranceContainer">
          <div class="glass-panel">
            <h4 style="margin-bottom: 16px;">Add Your Insurance</h4>
            <div class="input-group">
              <input type="text" id="rcInput" class="input-field" placeholder="Enter RC Number (e.g. DL1CAB1234)" style="margin-bottom: 8px;">
              <button id="fetchRcBtn" class="btn btn-primary" style="margin-bottom: 16px;">Fetch via VAHAN</button>
            </div>
            <div style="text-align: center; color: var(--text-secondary); margin-bottom: 16px;">-- OR --</div>
            <div class="input-group">
              <input type="file" id="policyUpload" accept="image/*,application/pdf" style="display: none;">
              <button id="uploadDocBtn" class="btn" style="background: rgba(255,255,255,0.1);" onclick="document.getElementById('policyUpload').click()">Upload Policy Document</button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 16px;">Tools</h3>
        <div class="glass-panel" style="padding: 16px; display: flex; align-items: center; gap: 16px; cursor: pointer;">
          <div style="font-size: 2rem;">&#128269;</div>
          <div>
            <h4 style="margin: 0;">Used Vehicle Inspector</h4>
            <p style="font-size: 0.8rem; margin: 4px 0 0;">Checklists for buying second-hand</p>
          </div>
        </div>
      </section>
    `;

    root.appendChild(container);
    root.appendChild(getBottomNav('/dashboard', router));

    // Bind Insurance Logic
    const fetchRcBtn = container.querySelector('#fetchRcBtn');
    const policyUpload = container.querySelector('#policyUpload');
    const insuranceContainer = container.querySelector('#insuranceContainer');

    const renderCard = (data) => {
      let cardColor = data.coverage_type === 'Third-Party' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)';
      let borderColor = data.coverage_type === 'Third-Party' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)';
      let headerLabel = data.coverage_type === 'Third-Party' ? '&#128308; Coverage Level: Basic (Third-Party Only)' : '&#128994; Coverage Level: Maximum (Zero-Depreciation)';
      
      let bodyText = '';
      if (data.coverage_type === 'Third-Party') {
        bodyText = `
          <p style="font-size: 0.9rem; font-weight: bold; margin-top: 8px;">What this means: You are legally allowed to drive, but your vehicle is NOT protected.</p>
          <ul style="font-size: 0.8rem; margin-top: 8px; padding-left: 16px; color: var(--text-secondary);">
            <li>If you crash: Insurance only pays for the OTHER person's vehicle or injuries. You will pay 100% of your own repair costs.</li>
          </ul>
          <button class="btn btn-primary" style="margin-top: 16px;">Set reminder to upgrade</button>
        `;
      } else {
        bodyText = `
          <p style="font-size: 0.9rem; font-weight: bold; margin-top: 8px;">What this means: You are fully protected.</p>
          <ul style="font-size: 0.8rem; margin-top: 8px; padding-left: 16px; color: var(--text-secondary);">
            <li>If you crash: You only pay a small file charge. The insurance pays for almost 100% of the fiber, plastic, and metal parts.</li>
          </ul>
          <div style="background: rgba(239, 68, 68, 0.1); padding: 8px; border-radius: 4px; margin-top: 12px; font-size: 0.8rem; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);">
            Warning: You can usually only claim this twice a year. Don't use it for minor scratches!
          </div>
        `;
      }

      insuranceContainer.innerHTML = `
        <div class="glass-panel animate-fade-in" style="background: linear-gradient(135deg, ${cardColor}, transparent); border: 1px solid ${borderColor};">
          <h4 style="margin-bottom: 8px; font-size: 1rem;">${headerLabel}</h4>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">
            <strong>Provider:</strong> ${data.provider_name} | <strong>Valid Upto:</strong> ${data.expiry_date}
          </div>
          ${bodyText}
        </div>
      `;
    };

    if (fetchRcBtn) {
      fetchRcBtn.addEventListener('click', async () => {
        const rcInput = container.querySelector('#rcInput').value;
        if(!rcInput) return alert('Enter RC Number');
        fetchRcBtn.textContent = 'Fetching...';
        
        // Mock API Delay
        setTimeout(() => {
          const mockProviders = ['HDFC Ergo', 'ICICI Lombard', 'Acko', 'Digit'];
          const coverageTypes = ['Third-Party', 'Comprehensive'];
          const randomCoverage = coverageTypes[Math.floor(Math.random() * coverageTypes.length)];
          const d = new Date();
          d.setMonth(d.getMonth() + 5);
          
          renderCard({
            provider_name: mockProviders[Math.floor(Math.random() * mockProviders.length)],
            expiry_date: d.toISOString().split('T')[0],
            coverage_type: randomCoverage
          });
          fetchRcBtn.textContent = 'Fetch via VAHAN';
        }, 1000);
      });
    }

    if (policyUpload) {
      policyUpload.addEventListener('change', async (e) => {
        if (!e.target.files[0]) return;
        
        const uploadBtn = container.querySelector('#uploadDocBtn');
        uploadBtn.textContent = 'Loading Tesseract Engine...';

        try {
          // Load Tesseract dynamically if not loaded
          if (!window.Tesseract) {
            await new Promise((resolve) => {
              const script = document.createElement('script');
              script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
              script.onload = resolve;
              document.head.appendChild(script);
            });
          }

          uploadBtn.textContent = 'Scanning OCR...';
          
          const result = await window.Tesseract.recognize(e.target.files[0], 'eng');
          const text = result.data.text.toLowerCase();

          let coverage_type = 'Third-Party';
          if (text.includes('comprehensive') || text.includes('own damage')) {
            coverage_type = 'Comprehensive';
          }

          const dateMatch = text.match(/(?:valid upto|expiry|to)\s*:?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
          let expiry_date = dateMatch ? dateMatch[1] : 'Unknown Date';

          renderCard({
            provider_name: 'Scanned Provider',
            expiry_date: expiry_date,
            coverage_type: coverage_type
          });

        } catch (err) {
          console.error(err);
          alert('Failed to parse document');
        }
        uploadBtn.textContent = 'Upload Policy Document';
      });
    }
  }
}
