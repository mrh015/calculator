// src/App.js
import React from 'react';
// Import the main calculator container component
import CreatinineClearanceCalculator from './components/calculator.jsx';
// DosingRecommendation is no longer needed here, it's used inside the specific calculators
import './App.css'; // Keep your styles

function App() {
  // No need to manage crCl state here anymore, unless you need it
  // for something else outside the calculator component itself.
  // const [crCl, setCrCl] = useState(null); // Removed

  // The onCrClCalculated prop is also optional now, only needed if App
  // itself requires the calculated CrCl value for other purposes.
  // If not, you can remove it from the CreatinineClearanceCalculator props.
  const handleCrClUpdate = (calculatedCrCl) => {
    console.log("CrCl calculated in App:", calculatedCrCl); // Example: Log it or use it if needed
  };


  return (
    <div className="container">
      {/* You can keep or adjust the main title */}
      <h1>Anticoagulant Dosing Calculator</h1>

      {/* Render the main calculator component */}
      {/* Pass the handler only if App needs the value */}
      <CreatinineClearanceCalculator onCrClCalculated={handleCrClUpdate} />

      {/* DosingRecommendation is no longer rendered here */}
      {/* <DosingRecommendation crCl={crCl} /> // Removed */}
    </div>
  );
}

export default App;
