import { getBottomNav } from './nav.js';

export default class EmergencyView {
  static render(root, store, router) {
    document.body.classList.add('panic-mode-active');
    
    const container = document.createElement('div');
    container.className = 'view-container animate-fade-in';
    container.style.paddingBottom = '80px';
    
    const tree = store.getDiagnosisTree();
    
    container.innerHTML = `
      <header style="text-align: center;">
        <h2 style="color: #ef4444;">Panic Time</h2>
        <p>Stay calm. Help is available offline.</p>
      </header>

      <div class="sos-button-wrapper">
        <button id="mainSosBtn" class="sos-btn">SOS</button>
      </div>

      <section class="glass-panel" id="diagnosisSection" style="border-color: rgba(239, 68, 68, 0.3);">
        <h3 style="color: #ef4444; display: flex; justify-content: space-between; align-items: center;">
          <span>Offline Diagnosis</span>
          <span style="font-size: 0.8rem; background: rgba(239, 68, 68, 0.2); padding: 4px 8px; border-radius: 4px;">NO INTERNET NEEDED</span>
        </h3>
        <div id="diagnosisContainer"></div>
      </section>
    `;

    root.appendChild(container);
    root.appendChild(getBottomNav('/emergency', router));

    // Handle Diagnosis Logic
    const diagContainer = document.getElementById('diagnosisContainer');
    
    const renderNode = (nodeId) => {
      const node = tree.find(n => n.id === nodeId);
      if (!node) return;

      diagContainer.innerHTML = '';
      
      const nodeEl = document.createElement('div');
      nodeEl.className = 'tree-node animate-fade-in';
      
      nodeEl.innerHTML = `
        <p style="font-size: 1.1rem; color: var(--text-primary); font-weight: 600;">${node.text}</p>
      `;

      if (node.isTerminal) {
        nodeEl.innerHTML += `
          <div style="margin-top: 16px; padding: 12px; background: rgba(16, 185, 129, 0.1); border-left: 4px solid var(--success); border-radius: 0 8px 8px 0;">
            <p style="color: var(--text-primary); margin: 0;">DIY Fix Instructions Complete.</p>
          </div>
          <button class="btn btn-primary" style="margin-top: 24px;" id="restartDiagBtn">Start Over</button>
        `;
        diagContainer.appendChild(nodeEl);
        document.getElementById('restartDiagBtn').addEventListener('click', () => renderNode('start'));
      } else {
        const optionsEl = document.createElement('div');
        optionsEl.className = 'tree-options';
        
        node.options.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'btn';
          btn.style.background = 'rgba(255, 255, 255, 0.1)';
          btn.textContent = opt.text;
          btn.onclick = () => renderNode(opt.next);
          optionsEl.appendChild(btn);
        });
        
        nodeEl.appendChild(optionsEl);
        diagContainer.appendChild(nodeEl);
      }
    };

    // Start tree
    renderNode('start');

    // Handle SOS Button Click
    document.getElementById('mainSosBtn').addEventListener('click', () => {
      const vehicle = store.getVehicle();
      
      // Try to get location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            sendSMS(position.coords.latitude, position.coords.longitude, vehicle);
          },
          (error) => {
            // Fallback without location
            sendSMS("Unknown", "Unknown", vehicle);
          }
        );
      } else {
         sendSMS("Unknown", "Unknown", vehicle);
      }
    });

    function sendSMS(lat, lng, vehicle) {
      // The current symptom from diagnosis might be tricky to grab dynamically without storing state.
      // For MVP, we use a generic issue description.
      const issue = "Breakdown";
      const model = vehicle ? vehicle.model : "Unknown Vehicle";
      
      const payload = \`SOS - Breakdown. Vehicle: \${model}. Issue: \${issue}. Location: \${lat}, \${lng}. Please send mechanic.\`;
      
      // Use native sms URI scheme
      // Note: iOS and Android handle SMS URIs slightly differently for body text. 
      // ?body= is widely supported, but some iOS versions use &body= if a number is present.
      // We'll use a generic dispatcher number "1234567890" for demo.
      const smsUri = \`sms:1234567890?body=\${encodeURIComponent(payload)}\`;
      
      window.location.href = smsUri;
    }
  }
}
