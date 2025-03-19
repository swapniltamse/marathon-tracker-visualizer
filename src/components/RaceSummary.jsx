// RaceSummary.jsx
import React from 'react';

const RaceSummary = ({ onClose, showFullCharts }) => {
  // Sample race summary data
  const raceSummary = {
    date: "March 10, 2025",
    location: "San Francisco Half Marathon",
    finishTime: "1:52:36",
    averagePace: "8:35",
    totalDistance: "13.1 miles",
    avgHeartRate: "162 bpm",
    maxHeartRate: "178 bpm",
    caloriesBurned: "1,245",
    elevationGain: "385 ft",
    weather: "Sunny, 62°F",
    ageGroupRank: "15/234",
    overallRank: "342/2567",
    personalRecords: [
      { title: "Best Half Marathon Time", value: "Yes" },
      { title: "Fastest Mile", value: "Mile 13 (8:15/mile)" },
      { title: "Strongest Finish", value: "Last 5K was 4% faster than average pace" }
    ]
  };

  return (
    <div className="race-summary-panel">
      <div className="panel-header">
        <h2>Race Summary</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="summary-content">
        <div className="summary-header">
          <h3>{raceSummary.location}</h3>
          <p className="race-date">{raceSummary.date}</p>
        </div>
        
        <div className="primary-stats">
          <div className="stat-box">
            <span className="stat-value">{raceSummary.finishTime}</span>
            <span className="stat-label">Finish Time</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{raceSummary.averagePace}</span>
            <span className="stat-label">Avg Pace</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{raceSummary.totalDistance}</span>
            <span className="stat-label">Distance</span>
          </div>
        </div>
        
        <div className="stat-grid">
          <div className="stat-item">
            <span className="stat-label">Avg Heart Rate</span>
            <span className="stat-value">{raceSummary.avgHeartRate}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Max Heart Rate</span>
            <span className="stat-value">{raceSummary.maxHeartRate}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Calories</span>
            <span className="stat-value">{raceSummary.caloriesBurned}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Elevation Gain</span>
            <span className="stat-value">{raceSummary.elevationGain}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Weather</span>
            <span className="stat-value">{raceSummary.weather}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Age Group Rank</span>
            <span className="stat-value">{raceSummary.ageGroupRank}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Overall Rank</span>
            <span className="stat-value">{raceSummary.overallRank}</span>
          </div>
        </div>
        
        <div className="personal-records">
          <h4>Personal Records</h4>
          <ul>
            {raceSummary.personalRecords.map((record, index) => (
              <li key={index}>
                <span className="record-title">{record.title}:</span>
                <span className="record-value">{record.value}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <button 
          className="show-full-charts-button"
          onClick={showFullCharts}
        >
          View Complete Performance Data
        </button>
      </div>
    </div>
  );
};

export default RaceSummary;