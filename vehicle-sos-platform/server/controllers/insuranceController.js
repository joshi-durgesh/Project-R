const { createWorker } = require('tesseract.js');
const { v4: uuidv4 } = require('uuid');

exports.fetchByRC = (req, res) => {
  const { rc_number, vehicle_id } = req.body;
  if (!rc_number) {
    return res.status(400).json({ error: 'RC Number is required' });
  }

  // Mock VAHAN API Response
  const mockProviders = ['HDFC Ergo', 'ICICI Lombard', 'Acko', 'Digit'];
  const coverageTypes = ['Third-Party', 'Comprehensive'];
  
  const randomProvider = mockProviders[Math.floor(Math.random() * mockProviders.length)];
  const randomCoverage = coverageTypes[Math.floor(Math.random() * coverageTypes.length)];
  const hasZeroDep = randomCoverage === 'Comprehensive' ? Math.random() > 0.5 : false;
  
  // Future expiry date (1 to 12 months from now)
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + Math.floor(Math.random() * 12) + 1);

  const policyData = {
    policy_id: uuidv4(),
    vehicle_id: vehicle_id || 'mock_vehicle_123',
    rc_number: rc_number.toUpperCase(),
    policy_number: `POL-${Math.floor(Math.random() * 1000000)}`,
    provider_name: randomProvider,
    expiry_date: expiryDate.toISOString().split('T')[0],
    coverage_type: randomCoverage,
    has_zero_dep: hasZeroDep
  };

  // Optionally save to DB here...
  // req.db.run(`INSERT INTO Insurance_Policies (...) VALUES (...)`, [...])

  return res.json({ success: true, data: policyData });
};

exports.parseDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No document uploaded' });
  }

  try {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(req.file.path);
    await worker.terminate();

    const lowerText = text.toLowerCase();

    // Basic heuristic extraction
    let coverage_type = 'Third-Party'; // default fallback
    let has_zero_dep = false;

    if (lowerText.includes('comprehensive') || lowerText.includes('own damage')) {
      coverage_type = 'Comprehensive';
      if (lowerText.includes('zero dep') || lowerText.includes('nil dep') || lowerText.includes('depreciation waiver')) {
        has_zero_dep = true;
      }
    }

    // Try to find a date matching "Valid Upto"
    // E.g., Valid Upto: 12/05/2025
    let expiry_date = null;
    const dateMatch = text.match(/(?:valid upto|expiry|to)\s*:?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
    if (dateMatch && dateMatch[1]) {
      // Very crude date parsing, in real life you'd use moment or date-fns
      expiry_date = dateMatch[1]; 
    } else {
      // Mock future date if not found
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      expiry_date = d.toISOString().split('T')[0];
    }

    const policyData = {
      policy_id: uuidv4(),
      rc_number: 'EXTRACTED_FROM_DOC',
      policy_number: 'SCANNED_POLICY',
      provider_name: 'Scanned Provider',
      expiry_date: expiry_date,
      coverage_type: coverage_type,
      has_zero_dep: has_zero_dep
    };

    // Clean up uploaded file
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    return res.json({ success: true, data: policyData, raw_text: text.substring(0, 500) });

  } catch (error) {
    console.error('OCR Error:', error);
    return res.status(500).json({ error: 'Failed to process document' });
  }
};
