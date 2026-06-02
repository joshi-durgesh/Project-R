export default class Store {
  constructor() {
    this.storageKey = 'vehicleSosData';
    // Initialize default data structure if it doesn't exist
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({
        user: null,
        vehicle: null,
        lastUpdated: new Date().toISOString()
      }));
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  saveData(data) {
    const current = this.getData();
    localStorage.setItem(this.storageKey, JSON.stringify({
      ...current,
      ...data,
      lastUpdated: new Date().toISOString()
    }));
  }

  getUser() {
    return this.getData().user;
  }

  getVehicle() {
    return this.getData().vehicle;
  }

  setupUserAndVehicle(userData, vehicleData) {
    this.saveData({
      user: {
        ...userData,
        isSetupComplete: true
      },
      vehicle: {
        ...vehicleData,
        currentEstimatedOdometer: parseInt(vehicleData.baselineOdometer, 10),
        lastSimulatedDate: new Date().toISOString()
      }
    });
  }

  simulateDailyMileage() {
    const data = this.getData();
    if (!data.vehicle) return;

    const lastDate = new Date(data.vehicle.lastSimulatedDate);
    const now = new Date();
    
    // Calculate difference in days
    const diffTime = Math.abs(now - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    // For demonstration, we'll increment even for same day to show the UI moving
    // In real app, only increment once per day
    const simulatedDays = diffDays > 0 ? diffDays : 1; 

    const dailyCommute = parseInt(data.vehicle.dailyCommute, 10);
    const newOdometer = data.vehicle.currentEstimatedOdometer + (dailyCommute * simulatedDays);

    data.vehicle.currentEstimatedOdometer = newOdometer;
    data.vehicle.lastSimulatedDate = now.toISOString();

    this.saveData({ vehicle: data.vehicle });
  }

  getNextServiceThreshold() {
    const vehicle = this.getVehicle();
    if (!vehicle) return 0;
    
    // Simple mock logic: Service every 5000 km
    const serviceInterval = 5000;
    const current = vehicle.currentEstimatedOdometer;
    const nextService = Math.ceil(current / serviceInterval) * serviceInterval;
    
    // If we just hit exactly 5000, next is 10000
    return nextService === current ? current + serviceInterval : nextService;
  }

  getDiagnosisTree() {
    // Mock offline diagnosis tree payload
    return [
      { id: 'start', text: 'What seems to be the problem?', options: [
        { text: "Engine won't start", next: 'battery' },
        { text: "Overheating", next: 'coolant' },
        { text: "Strange Noise", next: 'noise_type' }
      ]},
      { id: 'battery', text: 'Do the headlights turn on brightly?', options: [
        { text: 'Yes', next: 'starter' },
        { text: 'No / Dim', next: 'fix_jump' }
      ]},
      { id: 'starter', text: 'You hear a clicking sound when you turn the key?', options: [
        { text: 'Yes', next: 'fix_starter' },
        { text: 'No', next: 'fix_ignition' }
      ]},
      { id: 'coolant', text: 'Is there a puddle under the car?', options: [
        { text: 'Yes', next: 'fix_leak' },
        { text: 'No', next: 'fix_radiator' }
      ]},
      { id: 'noise_type', text: 'When does the noise happen?', options: [
        { text: 'When braking', next: 'fix_brakes' },
        { text: 'While idling', next: 'fix_belts' }
      ]},
      // Terminals
      { id: 'fix_jump', text: 'Battery is likely dead. Try a jump start or replace battery.', isTerminal: true },
      { id: 'fix_starter', text: 'Starter motor issue. Tap it gently with a wrench or call mechanic.', isTerminal: true },
      { id: 'fix_ignition', text: 'Ignition switch or wiring issue. Mechanic required.', isTerminal: true },
      { id: 'fix_leak', text: 'Coolant leak detected. Do not drive. Tow to mechanic.', isTerminal: true },
      { id: 'fix_radiator', text: 'Check radiator fan or thermostat. Let engine cool before opening radiator cap.', isTerminal: true },
      { id: 'fix_brakes', text: 'Brake pads worn out. Schedule replacement immediately.', isTerminal: true },
      { id: 'fix_belts', text: 'Serpentine belt might be loose or worn.', isTerminal: true }
    ];
  }
}
