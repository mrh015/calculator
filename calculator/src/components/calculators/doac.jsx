import React, { useState } from 'react';
// Assuming you might still want to use DosingRecommendation later,
// but correcting the import path based on the file name provided in context.
// If you are truly not using it, you can remove this import and the component usage below.
import DosingRecommendation from '../DosingRecommendation'; // Corrected path based on context

const DoacCalculator = ({ onCrClCalculated }) => {
  const [inputs, setInputs] = useState({
    age: '',
    weight: '',
    weightType: 'kg', // Default to kg, add state for weight type
    serumCreatinine: '',
    gender: 'Male',
  });
  const [results, setResults] = useState(null); // { crCl: number, recommendationData: object }

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    setResults(null); // Clear results on input change
  };

  const calculate = () => {
    // Destructure weightType along with other inputs
    const { age, weight, weightType, serumCreatinine, gender } = inputs;

    if (!age || !weight || !serumCreatinine) {
      alert('Please enter Age, Weight, and Serum Creatinine.');
      return;
    }

    const ageNum = parseFloat(age);
    let weightNum = parseFloat(weight); // Use let as it might be reassigned
    const scrNum = parseFloat(serumCreatinine);

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(scrNum) || ageNum <= 18) {
      alert('Please enter valid numerical values for an adult (Age > 18).');
      return;
    }

    // --- Weight Conversion ---
    let weightInKg = weightNum; // Initialize with the input value
    if (weightType === 'lbs') {
      weightInKg = weightNum / 2.2; // Convert lbs to kg
    }
    // --- End Weight Conversion ---

    const sex = gender === 'Female' ? 0.85 : 1;
    // Use weightInKg for the CrCl calculation
    const CrCl = ((140 - ageNum) * weightInKg * sex) / (72 * scrNum) || 0;

    // --- DOAC Recommendation Logic ---
    // Use weightInKg for any weight-dependent criteria
    let pradaxa_afib = '';
    if (CrCl < 15) pradaxa_afib = 'NOT RECOMMENDED';
    else if (CrCl <= 30) pradaxa_afib = '75 mg twice daily';
    else pradaxa_afib = '150 mg twice daily';

    const pradaxa_vte = CrCl <= 30 ? 'Not Recommended' : '150 mg twice daily after LMWH for at least 5 days';

    let eliquis_afib = '';
    // Use weightInKg here
    const meetsEliquisCriteria = (ageNum >= 80 || weightInKg <= 60) && scrNum >= 1.5;
    if (meetsEliquisCriteria) {
        eliquis_afib = '2.5mg twice daily';
    } else {
        eliquis_afib = '5mg twice daily';
    }

    const eliquis_vte = '10 mg twice daily x 7 days, then 5 mg twice daily';

    let xarelto_afib = '';
    if (CrCl < 15) xarelto_afib = 'NOT RECOMMENDED';
    else if (CrCl <= 50) xarelto_afib = '15mg once daily with food';
    else xarelto_afib = '20mg once daily with food';

    const xarelto_vte = CrCl <= 15 ? 'NOT RECOMMENDED' : '15mg twice daily x21 days followed by 20mg once daily (with food)';


    let savaysa_afib = '';
    if (CrCl < 15 || CrCl > 95) savaysa_afib = 'NOT RECOMMENDED';
    else if (CrCl <= 50) savaysa_afib = '30mg once daily';
    else savaysa_afib = '60mg once daily';


    let savaysa_vte = '';
     if (CrCl < 15 || CrCl > 95) {
        savaysa_vte = 'NOT RECOMMENDED';
     // Use weightInKg here
     } else if (CrCl >= 15 && CrCl <= 50) {
        savaysa_vte = '30mg once daily, after at least 5 days of LMWH';
     // Use weightInKg here
     } else if (CrCl > 50 && weightInKg <= 60) {
        savaysa_vte = '30mg once daily, after at least 5 days of LMWH';
     // Use weightInKg here
     } else if (CrCl > 50 && weightInKg > 60) {
        savaysa_vte = '60mg once daily, after at least 5 days of LMWH';
     } else {
        savaysa_vte = 'NOT RECOMMENDED';
     }

    // Pass the original input values needed by DosingRecommendation if using it
    // Or structure as needed if displaying directly
    const recommendationData = {
        // Pass necessary raw values if DosingRecommendation needs them
        // Or pass the calculated strings if displaying directly
        CrCl: CrCl, // Pass calculated CrCl
        calculatorType: 'doac',
        weightNum: weightInKg, // Pass weight in KG
        SCr_C: scrNum,
        ageNum: ageNum,
        // Alternatively, if DosingRecommendation expects the strings:
        // doac: { pradaxa_afib, pradaxa_vte, ... }
    };
    // --- End Recommendation Logic ---
    // Store input parameters used in calculation for display
    const inputParams = {
      age: ageNum,
      // Display original weight and unit, plus the calculated kg value if converted
      weight: weightNum,
      weightUnit: weightType,
      weightInKg: weightInKg.toFixed(1), // Store calculated kg value
      serumCreatinine: scrNum,
      gender: gender,
    };

    // Note: The structure passed to DosingRecommendation depends on what it expects.
    // The context DosingRecommendation.js expects { CrCl, calculatorType, weightNum, SCr_C, ageNum }
    // So we pass that structure in recommendationData.
    setResults({ crCl: CrCl.toFixed(2), recommendationData , inputParams}); // Pass the structured data
    if (onCrClCalculated) {
      onCrClCalculated(CrCl); // Notify parent if needed
    }
  };

  return (
    <div>
      {/* Input Fields */}
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
      {/* Modified Weight Input */}
      <div>
        <label>Weight:</label>
        <input type="number" value={inputs.weight} onChange={(e) => handleInputChange('weight', e.target.value)} />
        {/* Add dropdown for weight unit */}
        <select value={inputs.weightType} onChange={(e) => handleInputChange('weightType', e.target.value)}>
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
        </select>
      </div>
      {/* Height input removed as it's not used */}

      <button onClick={calculate}>Calculate CrCl & Dose</button>

      {/* Results Section */}
      {results && (
        <div className="results-section">
          <h3>Results</h3>
          {/* Display Input Parameters */}
          <div className="input-parameters-display" style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <h4>Parameters Used:</h4>
            <p>Age: {results.inputParams.age} years</p>
            <p>Gender: {results.inputParams.gender}</p>
            {/* Show original weight and calculated kg weight */}
            <p>Weight: {results.inputParams.weight} {results.inputParams.weightUnit} ({results.inputParams.weightInKg} kg used in calculation)</p>
            <p>Serum Creatinine: {results.inputParams.serumCreatinine} mg/dL</p>
          </div>

          {/* Display CrCl */}
          
          <div>Creatinine Clearance: {results.crCl} mL/min</div>
          {/* Pass the recommendationData object to DosingRecommendation */}
          {/* Ensure DosingRecommendation.js expects a prop named 'recommendation' */}
          {/* based on the context file provided */}
          <DosingRecommendation
            recommendation={results.recommendationData}
            // calculatorType="doac" // calculatorType is now inside recommendationData
          />
        </div>
      )}

      {/* Disclaimer (Keep as is) */}
      <div className="warning message-box">
      <div className="alert alert-warning">
         <p>
            Professional judgement should be exercised when using dosing recommendations provided as the patient’s medical condition may not be reflected in the recommendations (i.e., DVT prophylactic dosing). Pharmacists should use the provided information in conjunction with other approved drug information resources (i.e., Micromedex, Lexicomp) for dosing decisions and recommendations.
            <br /><br />
            For more information on medications that require actual body weight for creatinine clearance calculation, visit
            <a href="https://www.pharmacytimes.com/view/medications-that-always-use-actual-body-weight-to-calculate-creatinine-clearance" target="_blank" rel="noopener noreferrer">Pharmacy Times</a>.
          </p>
      </div>
      </div>

      {/* Criteria (Keep as is) */}
      <div className="criteria calculator-section">
         <h2>DOAC Calculator Criteria:</h2>
          <p>The above calculations are based on the following:</p>
          <ul>
            <li> Cockroft and Gault equation using actual body weight (converted to kg) is used to calculate creatinine clearance.</li>
            <li>
          <div className="equation">
            (140 - age) × (weight in kg) × (0.85 if female) 
            &divide; (72 × SrCr)
          </div>
          </li>
          </ul>
      </div>

      {/* Warning (Keep as is) */}
      <div className="warning message-box">
         <div className="alert alert-warning">Warning</div>
          <p>
            Dose suggestion takes weight/age restrictions as well as renal function into account. Drug-drug interactions may alter the treatment dose recommendation. Suggested dosing is intended for maintenance treatment dose for atrial fibrillation or VTE only. Patients with BMI&gt;40 kg/m2, or weight &gt;120 kg should be evaluated closely. DOACs have not been well-studied in patients with CrCL &lt;30 ml/min and should be carefully considered prior to use. In some cases, renal dosing may be used in patients who have CrCL&gt; 30 ml/min. <b>  Dosing may change due to therapy indication. Please refer to standardized drug references (i.e., Lexi-Comp, Micromedex) for detailed information.</b>  Providers are expected to use clinical judgment in considering all patient variables to determine if a more conservative dose is necessary.
          </p>
      </div>
    </div>
  );
};

export default DoacCalculator;
