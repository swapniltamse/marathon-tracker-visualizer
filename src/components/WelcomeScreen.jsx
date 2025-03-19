// WelcomeScreen.jsx
import React from 'react';

const WelcomeScreen = ({ onStart, onUploadGpx }) => {
  return (
    <div className="welcome-screen">
      <h2>Your Half Marathon Journey</h2>
      
      <p>
        Welcome to your personalized half marathon tracker! This interactive application
        allows you to visualize and relive your half marathon experience with detailed maps,
        performance data, photos, and videos.
      </p>
      
      <div>
        <img 
          src="/api/placeholder/600/300" 
          alt="Half Marathon Runner" 
          style={{ 
            maxWidth: '100%', 
            borderRadius: '8px', 
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
          }} 
        />
      </div>
      
      <p>
        Customize your experience by uploading your own GPX data from Strava, Garmin, or any other
        fitness tracking app, or use our example route to explore the application's features.
      </p>
      
      <div className="welcome-actions">
        <button 
          className="welcome-btn primary-btn"
          onClick={onUploadGpx}
        >
          Upload Your GPX Data
        </button>
        
        <button 
          className="welcome-btn secondary-btn"
          onClick={onStart}
        >
          Use Example Route
        </button>
      </div>
      
      <div style={{ marginTop: '40px', maxWidth: '600px' }}>
        <h3>Features</h3>
        <ul style={{ textAlign: 'left' }}>
          <li>Interactive map with detailed route visualization</li>
          <li>Toggle between street and satellite views</li>
          <li>Performance data analysis with pace, heart rate, and elevation charts</li>
          <li>Add photos and videos from your race</li>
          <li>Comprehensive race summary with key statistics</li>
          <li>Share your experience with friends and family</li>
        </ul>
      </div>
    </div>
  );
};

export default WelcomeScreen;