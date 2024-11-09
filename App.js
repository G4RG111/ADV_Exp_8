// src/App.js
import React from "react";
import HealthStatusPieChart from "./HealthStatusPieChart";
import ScatterPlot from "./ScatterPlot";
import FireRiskBoxPlot from "./FireRiskBoxPlot";
import DisturbanceBarPlot from "./DisturbanceBarPlot";

function App() {
  return (
    <div className="App" style={{ fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h1 style={{ marginTop: "20px", color: "#333", fontSize: "32px" }}>Forest Data Visualization Dashboard</h1>
      
      {/* Main Content Section */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        {/* Pie Chart */}
        <div style={{
          padding: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff"
        }}>
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Health Status Distribution</h2>
          <HealthStatusPieChart />
        </div>

        {/* Scatter Plot */}
        <div style={{
          padding: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff"
        }}>
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Scatter Plot of DBH vs Tree Height</h2>
          <ScatterPlot />
        </div>

        {/* Box Plot */}
        <div style={{
          padding: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff",
          gridColumn: "span 2",
        }}>
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Fire Risk Index vs Health Status</h2>
          <FireRiskBoxPlot />
        </div>

        {/* Bar Plot */}
        <div style={{
          padding: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff",
          gridColumn: "span 2",
        }}>
          <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Disturbance Level vs Soil AP</h2>
          <DisturbanceBarPlot />
        </div>
      </div>
    </div>
  );
}

export default App;
