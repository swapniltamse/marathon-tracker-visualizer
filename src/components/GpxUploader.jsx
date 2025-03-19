// GpxUploader.jsx
import React, { useState } from 'react';
import { parseGpxFile, generateRaceDataPoints } from '.utils/GpxParser';
import GpxParser from './utils/GpxParser'; 

const GpxUploader = ({ onRouteLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.gpx')) {
      setError('Please upload a valid GPX file');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
      
      // Read the file
      const fileContent = await readFileAsText(file);
      
      // Parse GPX file
      const routeData = parseGpxFile(fileContent);
      
      // Generate race data points for the map
      const raceDataPoints = generateRaceDataPoints(routeData, 5);
      
      // Clear progress simulation and set to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Pass the parsed data up to parent component
      onRouteLoaded({
        routeData,
        raceDataPoints
      });
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error processing GPX file:', err);
      setError(`Error processing file: ${err.message}`);
      setIsLoading(false);
      setUploadProgress(0);
    }
  };
  
  /**
   * Read file as text
   * @param {File} file - The file to read
   * @returns {Promise<string>} File content as text
   */
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsText(file);
    });
  };
  
  return (
    <div className="gpx-uploader">
      <div className="uploader-container">
        <label htmlFor="gpx-file" className="file-upload-label">
          <div className="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="upload-text">
            <span className="primary-text">Upload GPX File</span>
            <span className="secondary-text">Drag and drop or click to browse</span>
          </div>
          <input 
            type="file" 
            id="gpx-file" 
            accept=".gpx" 
            onChange={handleFileUpload} 
            disabled={isLoading}
            style={{ display: 'none' }}
          />
        </label>
        
        {isLoading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="progress-text">Processing... {uploadProgress}%</span>
          </div>
        )}
        
        {error && (
          <div className="upload-error">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
      
      <div className="upload-instructions">
        <h3>Get Started with GPX Files</h3>
        <ul>
          <li>Export GPX from Strava, Garmin, or other fitness apps</li>
          <li>File should contain your race route and optionally waypoints</li>
          <li>Maximum file size: 10MB</li>
        </ul>
        <p className="sample-link">
          No GPX file? <a href="#" onClick={(e) => {
            e.preventDefault();
            // Use an example route
            const exampleRoute = {
              routeData: {
                name: "Example Half Marathon",
                points: raceData.map(p => ({ lat: p.position[0], lng: p.position[1], elevation: 0, time: null })),
                statistics: {
                  totalDistance: 21.0975, // Half marathon in km
                  elevationGain: 385,
                  elevationLoss: 385,
                  maxElevation: 45,
                  minElevation: 5
                }
              },
              raceDataPoints: raceData
            };
            onRouteLoaded(exampleRoute);
          }}>Use example route</a>
        </p>
      </div>
    </div>
  );
};

// Sample race data for the example route
const raceData = [
  {
    id: 1,
    position: [37.7749, -122.4194],
    mile: 1,
    location: "Start Line - Embarcadero",
    description: "Race began with perfect weather conditions. Feeling strong!",
    pace: "8:45",
    heartRate: 145,
    photoUrl: "/api/placeholder/200/150",
    videoUrl: "https://example.com/start-video",
    videoThumbnail: "/api/placeholder/320/180"
  },
  {
    id: 2,
    position: [37.7775, -122.4253],
    mile: 3,
    location: "Fisherman's Wharf",
    description: "Scenic views of the bay, maintaining steady pace.",
    pace: "8:50",
    heartRate: 155,
    photoUrl: "/api/placeholder/200/150",
    videoUrl: "https://example.com/wharf-video",
    videoThumbnail: "/api/placeholder/320/180"
  },
  {
    id: 3,
    position: [37.7816, -122.4154],
    mile: 7,
    location: "Golden Gate Bridge Approach",
    description: "Starting to feel the incline, but views are motivating!",
    pace: "9:15",
    heartRate: 165,
    photoUrl: "/api/placeholder/200/150",
    videoUrl: "https://example.com/bridge-video",
    videoThumbnail: "/api/placeholder/320/180"
  },
  {
    id: 4,
    position: [37.7899, -122.4100],
    mile: 10,
    location: "Marina District",
    description: "The home stretch! Picking up pace for the strong finish.",
    pace: "8:30",
    heartRate: 172,
    photoUrl: "/api/placeholder/200/150",
    videoUrl: "https://example.com/finish-video",
    videoThumbnail: "/api/placeholder/320/180"
  },
  {
    id: 5,
    position: [37.7831, -122.4039],
    mile: 13.1,
    location: "Finish Line - Ferry Building",
    description: "Crossed the finish line with a new PR! Amazing experience.",
    pace: "8:15",
    heartRate: 178,
    photoUrl: "/api/placeholder/200/150",
    videoUrl: "https://example.com/finish-video",
    videoThumbnail: "/api/placeholder/320/180"
  }
];

export default GpxUploader;