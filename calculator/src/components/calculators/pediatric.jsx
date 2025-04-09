// src/components/calculators/pediatric.js
import React, { useState } from 'react';

const PediatricCalculator = ({ onCrClCalculated }) => {
  const [inputs, setInputs] = useState({
    age: '',
    ageUnit: 'years', // Default to years
    ageType: 'pediatricabove1', // Default type for years
    height: '',
    heightType: '1',
    serumCreatinine: '',
  });
  const [results, setResults] = useState(null);

  const handleInputChange = (field, value) => {
    setInputs((prev) => {
      const newInputs = { ...prev, [field]: value };

      // --- Logic for dependent dropdowns ---
      if (field === 'ageUnit') {
        // If switching to 'years', set ageType to the only valid option
        if (value === 'years') {
          newInputs.ageType = 'pediatricabove1';
        }
        // If switching to 'months', set ageType to a default valid option (e.g., term infant)
        else if (value === 'months') {
          newInputs.ageType = 'normalpediatricabelow1';
        }
      }
      // --- End logic ---

      return newInputs;
    });
    setResults(null); // Clear results on any input change
  };

  const calculate = () => {
    const { age, ageUnit, ageType, height, heightType, serumCreatinine } = inputs;

    // --- Input Validation (ensure ageType is valid for ageUnit) ---
    if (ageUnit === 'years' && ageType !== 'pediatricabove1') {
        alert('Invalid Age Type selected for Years.');
        return;
    }
    if (ageUnit === 'months' && (ageType !== 'normalpediatricabelow1' && ageType !== 'prematurepediatricabelow1')) {
        alert('Invalid Age Type selected for Months.');
        return;
    }
    // --- End Input Validation ---


    if (!age || !height || !serumCreatinine) {
      alert('Please enter Age, Height, and Serum Creatinine.');
      return;
    }

    const ageNum = parseFloat(age);
    let heightNumInput = parseFloat(height);
    const scrNum = parseFloat(serumCreatinine);

    if (isNaN(ageNum) || isNaN(heightNumInput) || isNaN(scrNum) || ageNum <= 0 || heightNumInput <= 0 || scrNum <= 0) {
      alert('Please enter valid positive numerical values.');
      return;
    }

    let heightInCm = heightNumInput;
    if (heightType === '2') {
      heightInCm = heightNumInput * 2.54;
    }

    let k_constant = 0;
    let crcl_equation = '';
    let ageTypeDisplay = '';

    // Determine k constant (logic remains the same, but relies on validated inputs)
    if (ageUnit === 'years' && ageType === 'pediatricabove1' && ageNum >= 1 && ageNum <= 18) {
        k_constant = 0.413;
        crcl_equation = '(0.413 * height_cm) / SCr';
        ageTypeDisplay = 'Child (1-18 years)';
    } else if (ageUnit === 'months' && ageNum >= 1 && ageNum < 12) {
        if (ageType === 'normalpediatricabelow1') {
            k_constant = 0.45;
            crcl_equation = '(0.45 * height_cm) / SCr';
            ageTypeDisplay = 'Term Infant (< 1 year)';
        } else if (ageType === 'prematurepediatricabelow1') {
            k_constant = 0.33;
            crcl_equation = '(0.33 * height_cm) / SCr';
            ageTypeDisplay = 'Premature Infant (< 1 year)';
        }
    }


    if (k_constant === 0) {
      // This alert might be less likely now due to input validation, but good as a fallback
      alert('Invalid age range/unit/type combination selected for Pediatric calculation.');
      return;
    }

    const CrCl = (k_constant * heightInCm) / scrNum || 0;

    const inputParams = {
        age: ageNum,
        ageUnit: ageUnit,
        ageType: ageTypeDisplay,
        height: heightNumInput,
        heightUnit: heightType === '1' ? 'cm' : 'inches',
        serumCreatinine: scrNum,
        heightInCm: heightInCm.toFixed(1),
        kConstant: k_constant,
    };

    setResults({
        crCl: CrCl.toFixed(2),
        equation: crcl_equation,
        inputParams
    });

    if (onCrClCalculated) {
      onCrClCalculated(CrCl);
    }
  };

  return (
    <div>
      {/* Input Fields - Modified Order and Logic */}
      <div>
        <label>Age:</label>
        <input type="number" value={inputs.age} onChange={(e) => handleInputChange('age', e.target.value)} />
        {/* Age Unit Dropdown (First) */}
        <select value={inputs.ageUnit} onChange={(e) => handleInputChange('ageUnit', e.target.value)}>
          <option value="years">Years</option> {/* Simplified text */}
          <option value="months">Months</option> {/* Simplified text */}
        </select>
        {/* Age Type Dropdown (Second - options depend on ageUnit) */}
        <select value={inputs.ageType} onChange={(e) => handleInputChange('ageType', e.target.value)}>
          {inputs.ageUnit === 'years' && (
            <option value="pediatricabove1">Child (1-18 years)</option>
          )}
          {inputs.ageUnit === 'months' && (
            <> {/* Use Fragment to group options */}
              <option value="normalpediatricabelow1">Term Infant (&lt; 1 year)</option>
              <option value="prematurepediatricabelow1">Premature Infant (&lt; 1 year)</option>
            </>
          )}
        </select>
      </div>
      {/* Other Inputs */}
      <div>
        <label>Serum Creatinine (mg/dL):</label>
        <input type="number" step="0.01" value={inputs.serumCreatinine} onChange={(e) => handleInputChange('serumCreatinine', e.target.value)} />
      </div>
      <div>
        <label>Height:</label>
        <input type="number" value={inputs.height} onChange={(e) => handleInputChange('height', e.target.value)} />
        <select value={inputs.heightType} onChange={(e) => handleInputChange('heightType', e.target.value)}>
          <option value="1">cm</option>
          <option value="2">inches</option>
        </select>
      </div>

      <button onClick={calculate}>Calculate CrCl</button>

      {/* Results Section (remains the same) */}
      {results && (
        <div className="results-section">
          <h3>Results</h3>
          <div className="input-parameters-display" style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <h4>Parameters Used:</h4>
            <p>Age: {results.inputParams.age} {results.inputParams.ageUnit} ({results.inputParams.ageType})</p>
            <p>Height: {results.inputParams.height} {results.inputParams.heightUnit} ({results.inputParams.heightInCm} cm)</p>
            <p>Serum Creatinine: {results.inputParams.serumCreatinine} mg/dL</p>
            <p><small>k Constant Used: {results.inputParams.kConstant}</small></p>
          </div>
          <div>Estimated GFR (Schwartz): {results.crCl} mL/min/1.73m²</div>
          <div className="equation"><small>Formula Used: {results.equation}</small></div>
        </div>
      )}

       {/* Disclaimer (remains the same) */}
       <div className="warning message-box" style={{ textAlign: 'left' }}>
         <div className="alert alert-warning">
           <ul>
              <li>Term: gestational age ≥ 37 weeks</li>
              <li>Premature: gestational age &lt; 37 weeks</li>
              <li>Utilizes the Bedside Schwartz equation (confirm k constant if specific variations are needed).</li>
            </ul>
         </div>
       </div>
    </div>
  );
};

export default PediatricCalculator;
