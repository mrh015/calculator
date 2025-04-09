// src/components/calculators/lovenox.js
import React, { useState } from 'react';
// Correcting the import path based on the context file name
import DosingRecommendation from '../DosingRecommendation';

const LovenoxCalculator = ({ onCrClCalculated }) => {
  const [inputs, setInputs] = useState({
    age: '',
    weight: '',
    weightType: 'kg',
    height: '',
    heightType: '1', // '1' for cm, '2' for inches
    serumCreatinine: '',
    gender: 'Male',
  });
  // Update results state to include inputParams
  const [results, setResults] = useState(null);
  // Example structure: { crCl: string, recommendationData: object, inputParams: object }

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
     setResults(null); // Clear results on input change
  };

  const calculate = () => {
    const { age, weight, weightType, height, heightType, serumCreatinine, gender } = inputs;

    if (!age || !weight || !height || !serumCreatinine) {
      alert('Please enter Age, Weight, Height, and Serum Creatinine.');
      return;
    }

    const ageNum = parseFloat(age);
    let weightNumInput = parseFloat(weight); // Store original input weight
    let heightNumInput = parseFloat(height); // Store original input height
    const scrNum = parseFloat(serumCreatinine);

    if (isNaN(ageNum) || isNaN(weightNumInput) || isNaN(heightNumInput) || isNaN(scrNum) || ageNum <= 18) {
      alert('Please enter valid numerical values for an adult (Age > 18).');
      return;
    }

    // --- Unit Conversion ---
    let weightInKg = weightNumInput;
    if (weightType === 'lbs') {
      weightInKg = weightNumInput / 2.20462; // Convert lbs to kg
    }

    let heightInCm = heightNumInput;
    if (heightType === '2') {
      heightInCm = heightNumInput * 2.54; // Convert inches to cm
    }
    // --- End Unit Conversion ---


    // Calculate Ideal Body Weight (IBW) and Adjusted Body Weight (ABW) using converted values
    const heightInInches = heightInCm / 2.54;
    const inchesOver5Feet = heightInInches > 60 ? heightInInches - 60 : 0;
    const ideal_weight_base = gender === 'Female' ? 45.5 : 50;
    const ideal_weight = ideal_weight_base + 2.3 * inchesOver5Feet;

    let weight_C = weightInKg; // Weight used in CrCl calculation (start with actual kg weight)
    let adjusted_weight = null; // Initialize adjusted weight as null
    const weightRatio = ideal_weight > 0 ? weightInKg / ideal_weight : 1; // Avoid division by zero

    if (weightRatio > 1.25) {
      // Calculate and Use Adjusted Body Weight
      adjusted_weight = ideal_weight + 0.4 * (weightInKg - ideal_weight); // Calculate ABW
      weight_C = adjusted_weight; // Use ABW for CrCl calculation
    } else if (weightRatio > 1.0 && weightRatio <= 1.25) {
       // Use Ideal Body Weight (only if actual > ideal)
       weight_C = ideal_weight;
    }
    // else: Use Actual Body Weight (weight_C remains weightInKg)


    const sex = gender === 'Female' ? 0.85 : 1;
    const CrCl = ((140 - ageNum) * weight_C * sex) / (72 * scrNum) || 0;

    // --- Lovenox Recommendation Logic ---
    // Dosing is based on ACTUAL body weight in KG (weightInKg)
    const bid_dose = CrCl > 30 ? `${weightInKg.toFixed(0)}mg twice daily` : 'See Renal Dosing';
    const qd_dose = CrCl > 30 ? `${(1.5 * weightInKg).toFixed(0)}mg once daily` : 'See Renal Dosing';
    const renal_dose = CrCl <= 30 ? `${weightInKg.toFixed(0)}mg once daily` : 'Not Applicable';

    // Structure data for DosingRecommendation component
    // Pass the values it expects based on DosingRecommendation.js context
    const recommendationData = {
        CrCl: CrCl,
        calculatorType: 'lovenox',
        weightNum: weightInKg, // Pass actual weight in KG
        SCr_C: scrNum,
        ageNum: ageNum,
        // Include calculated doses if DosingRecommendation expects them directly
        // bid_dose: bid_dose,
        // qd_dose: qd_dose,
        // renal_dose: renal_dose,
    };
    // --- End Recommendation Logic ---

    // Store input parameters used in calculation for display
    const inputParams = {
        age: ageNum,
        gender: gender,
        weight: weightNumInput, // Original input value
        weightUnit: weightType,
        height: heightNumInput, // Original input value
        heightUnit: heightType === '1' ? 'cm' : 'inches', // Display unit name
        serumCreatinine: scrNum,
        // Optionally store calculated values used
        weightInKg: weightInKg.toFixed(1),
        heightInCm: heightInCm.toFixed(1),
        idealBodyWeight: ideal_weight.toFixed(1), // Store IBW
        adjustedBodyWeight: adjusted_weight ? adjusted_weight.toFixed(1) : null, // Store ABW if calculated
        weightUsedInCrCl: weight_C.toFixed(1) // Show which weight (Actual, Ideal, Adjusted) was used
    };

    // Update results state
    setResults({
        crCl: CrCl.toFixed(2),
        recommendationData,
        inputParams // Add input parameters here
    });

    if (onCrClCalculated) {
      onCrClCalculated(CrCl); // Notify parent if needed
    }
  };

  return (
    <div>
      {/* Input Fields (remain the same) */}
      <div>
        <label>Age (Years, &gt;18):</label>
        <input type="number" value={inputs.age} onChange={(e) => handleInputChange('age', e.target.value)} />
      </div>
      <div>
        <label>Gender:</label>
        <select value={inputs.gender} onChange={(e) => handleInputChange('gender', e.target.value)}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div>
        <label>Serum Creatinine (mg/dL):</label>
        <input type="number" step="0.01" value={inputs.serumCreatinine} onChange={(e) => handleInputChange('serumCreatinine', e.target.value)} />
      </div>
      <div>
        <label>Weight:</label>
        <input type="number" value={inputs.weight} onChange={(e) => handleInputChange('weight', e.target.value)} />
        <select value={inputs.weightType} onChange={(e) => handleInputChange('weightType', e.target.value)}>
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
        </select>
      </div>
      <div>
        <label>Height:</label>
        <input type="number" value={inputs.height} onChange={(e) => handleInputChange('height', e.target.value)} />
        <select value={inputs.heightType} onChange={(e) => handleInputChange('heightType', e.target.value)}>
          <option value="1">cm</option>
          <option value="2">inches</option>
        </select>
      </div>

      <button onClick={calculate}>Calculate CrCl & Dose</button>

      {/* Results Section - Modified */}
      {results && (
        <div className="results-section">
          <h3>Results</h3>
          {/* Display Input Parameters */}
          <div className="input-parameters-display" style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <h4>Parameters Used:</h4>
            <p>Age: {results.inputParams.age} years</p>
            <p>Gender: {results.inputParams.gender}</p>
            <p>Weight: {results.inputParams.weight} {results.inputParams.weightUnit} ({results.inputParams.weightInKg} kg)</p>
            <p>Height: {results.inputParams.height} {results.inputParams.heightUnit} ({results.inputParams.heightInCm} cm)</p>
            <p>Serum Creatinine: {results.inputParams.serumCreatinine} mg/dL</p>
            {/* Display calculated weights */}
            <p><small>Ideal Body Weight (IBW): {results.inputParams.idealBodyWeight} kg</small></p>
            {/* Conditionally display ABW */}
            {results.inputParams.adjustedBodyWeight && (
              <p><small>Adjusted Body Weight (ABW): {results.inputParams.adjustedBodyWeight} kg</small></p>
            )}
            <p><small>Weight used for CrCl calculation: {results.inputParams.weightUsedInCrCl} kg</small></p>
          </div>

          {/* Display CrCl */}
          <div>Creatinine Clearance: {results.crCl} mL/min</div>

          {/* Pass structured data to DosingRecommendation */}
          {/* Ensure DosingRecommendation expects 'recommendation' prop */}
          <DosingRecommendation
             recommendation={results.recommendationData}
             // calculatorType="lovenox" // Already inside recommendationData
           />
        </div>
      )}

       {/* Disclaimer (remains the same) */}
       <div className="warning message-box">
       <div className="alert alert-warning">
       
         <p>
            Professional judgement should be exercised when using dosing recommendations provided as the patient’s medical condition may not be reflected in the recommendations (i.e., DVT prophylactic dosing). Pharmacists should use the provided information in conjunction with other approved drug information resources (i.e., Micromedex, Lexicomp) for dosing decisions and recommendations.
          </p>
       </div>
       </div>

       {/* Criteria (remains the same) */}
       <div className="criteria calculator-section">
          <h2>Lovenox Calculator Criteria:</h2>
          <p>The above calculations are based on the following:</p>
          <ul>
            <li>If actual weight is less than or equal to ideal body weight (IBW), actual weight is used to calculate CrCl.</li>
            <li> If actual weight/IBW ≤ 1.25 but &gt; 1, IBW is used to calculate CrCl.</li>
            <li> If actual weight/IBW &gt; 1.25, adjusted body weight (ABW) is used to calculate CrCl.</li>
            <li> ABW = IBW + 0.4 (Actual body weight - IBW).</li>
            <li> Female IBW = 45.5 kg + 2.3 kg for each inch over 5 feet.</li>
            <li> Male IBW = 50 kg + 2.3 kg for each inch over 5 feet.</li>
            <li>Cockroft and Gault equation is used to calculate creatinine clearance.</li>
            <li>
          <div className="equation">
            (140 - age) × (Weight*) × (0.85 if female)
            &divide; (72 × SrCr)
            
            <br/>
            <small>*Weight used is Actual, Ideal, or Adjusted based on criteria above.</small>
          </div>
          </li>
          </ul>
       </div>
       {/* No specific warning for Lovenox in the original code */}
    </div>
  );
};

export default LovenoxCalculator;
