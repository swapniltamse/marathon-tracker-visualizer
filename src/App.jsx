// App.jsx - Main Application Component
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';
import PerformanceCharts from './components/PerformanceCharts';
import RaceSummary from './components/RaceSummary';
import GpxUploader from './components/GpxUploader';
import WelcomeScreen from './components/WelcomeScreen';
import GpxParser from './utils/GpxParser';   

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Sample half marathon data points
const defaultRaceData = [
  {
    id: 1,
    position: [37.7749, -122.4194], // Example coordinates (San Francisco)
    mile: 1,
    location: "Start Line - Embarcadero",
    description: "Race began with perfect weather conditions. Feeling strong!",
    pace: "8:45",
    heartRate: 145,
    photoUrl: "/api/placeholder/200/150", // Placeholder for now
    videoUrl: "https://example.com/start-video",
    videoThumbnail: "/api/placeholder/320/180"
  },
  {
    id: 2,
    position: [37.7775, -122.4253], // Moving west slightly
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
    position: [37.7816, -122.4154], // Moving north slightly
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
    position: [37.7899, -122.4100], // North end
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
    position: [37.7831, -122.4039], // Finish line
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

// Map View Toggle Component
function MapViewToggle({ view, setView }) {
  return (
    <div className="map-toggle">
      <button 
        className={view === 'streets' ? 'active' : ''} 
        onClick={() => setView('streets')}
      >
        Street View
      </button>
      <button 
        className={view === 'satellite' ? 'active' : ''} 
        onClick={() => setView('satellite')}
      >
        Satellite View
      </button>
    </div>
  );
}

// Component to change map view
function ChangeMapView({ view }) {
  const map = useMap();
  
  React.useEffect(() => {
    // Apply different tile layers based on view selection
  }, [view, map]);
  
  return null;
}

function App() {
  // Application state
  const [appState, setAppState] = useState('welcome'); // welcome, upload, map
  const [mapView, setMapView] = useState('streets');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showFullPerformance, setShowFullPerformance] = useState(false);
  const [raceData, setRaceData] = useState(defaultRaceData);
  const [routeData, setRouteData] = useState(null);
  
  // Handle route data loading from GPX
  const handleRouteLoaded = (data) => {
    setRouteData(data.routeData);
    setRaceData(data.raceDataPoints);
    setAppState('map');
  };
  
  // Start with example route
  const handleStartWithExample = () => {
    setAppState('map');
  };
  
  // Show GPX upload screen
  const handleShowUpload = () => {
    setAppState('upload');
  };
  
  // Center the map on the average of all race points
  const getMapCenter = () => {
    const lats = raceData.map(point => point.position[0]);
    const lngs = raceData.map(point => point.position[1]);
    const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
    return [avgLat, avgLng];
  };
  
  // Toggle race summary panel
  const toggleSummary = () => {
    setShowSummary(!showSummary);
    if (!showSummary) {
      setShowFullPerformance(false);
      setSelectedMarker(null);
    }
  };
  
  // Show full performance view
  const showFullCharts = () => {
    setShowFullPerformance(true);
    setShowSummary(false);
    setSelectedMarker(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>My Half Marathon Journey</h1>
        <p>Interactive map and performance tracking of my race experience</p>
      </header>
      
      {appState === 'welcome' && (
        <WelcomeScreen 
          onStart={handleStartWithExample}
          onUploadGpx={handleShowUpload}
        />
      )}
      
      {appState === 'upload' && (
        <GpxUploader onRouteLoaded={handleRouteLoaded} />
      )}
      
      {appState === 'map' && (
        <>
          <div className="controls-bar">
            <div className="view-controls">
              <button 
                className={!showSummary && !showFullPerformance ? 'active' : ''} 
                onClick={() => {
                  setShowSummary(false);
                  setShowFullPerformance(false);
                }}
              >
                Map View
              </button>
              {showFullPerformance && (
                <button 
                  className="active" 
                  onClick={() => {}}
                >
                  Performance Data
                </button>
              )}
            </div>
            <button 
              className="summary-button" 
              onClick={toggleSummary}
            >
              {showSummary ? 'Hide Race Summary' : 'Show Race Summary'}
            </button>
          </div>
          
          {showSummary && (
            <RaceSummary 
              onClose={toggleSummary}
              showFullCharts={showFullCharts}
            />
          )}
          
          {showFullPerformance && (
            <div className="full-performance-view">
              <h2>Complete Race Performance</h2>
              <div className="charts-container">
                <PerformanceCharts showFullRoute={true} />
              </div>
              <button 
                className="close-button" 
                onClick={() => setShowFullPerformance(false)}
              >
                Back to Map
              </button>
            </div>
          )}
          
          {!showSummary && !showFullPerformance && (
            <div className="map-container">
              <MapViewToggle view={mapView} setView={setMapView} />
              <MapContainer center={getMapCenter()} zoom={13} style={{ height: '600px', width: '100%' }}>
                {/* Base map layer - changes based on selected view */}
                {mapView === 'streets' ? (
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                ) : (
                  <TileLayer
                    attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                )}
                
                {/* Race route polyline */}
                <Polyline 
                  positions={raceData.map(point => point.position)}
                  pathOptions={{ color: 'var(--primary-color)', weight: 4, opacity: 0.7 }}
                />
                
                {/* Race markers */}
                {raceData.map(point => (
                  <Marker 
                    key={point.id} 
                    position={point.position}
                    eventHandlers={{
                      click: () => setSelectedMarker(point),
                    }}
                  >
                    <Popup>
                      <div className="marker-popup">
                        <h3>Mile {point.mile}: {point.location}</h3>
                        <div className="popup-content">
                          <div className="popup-image">
                            <img src={point.photoUrl} alt={`Mile ${point.mile}`} />
                          </div>
                          <div className="popup-info">
                            <p><strong>Pace:</strong> {point.pace} min/mile</p>
                            <p><strong>Heart Rate:</strong> {point.heartRate} bpm</p>
                            <p>{point.description}</p>
                            <div className="video-preview">
                              <h4>Race Video</h4>
                              <img 
                                src={point.videoThumbnail} 
                                alt="Video thumbnail" 
                                onClick={() => window.open(point.videoUrl, '_blank')}
                                style={{ cursor: 'pointer' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                
                <ChangeMapView view={mapView} />
              </MapContainer>
            </div>
          )}
          
          {!showSummary && !showFullPerformance && selectedMarker && (
            <div className="detail-panel">
              <h2>Mile {selectedMarker.mile}: {selectedMarker.location}</h2>
              <div className="detail-content">
                <div className="detail-media">
                  <img src={selectedMarker.photoUrl} alt={selectedMarker.location} className="detail-photo" />
                  <div className="detail-video">
                    <h3>Race Video</h3>
                    <img 
                      src={selectedMarker.videoThumbnail} 
                      alt="Video preview" 
                      onClick={() => window.open(selectedMarker.videoUrl, '_blank')}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
                <div className="detail-info">
                  <p>{selectedMarker.description}</p>
                  <div className="performance-data">
                    <h3>Performance Data</h3>
                    <p><strong>Pace:</strong> {selectedMarker.pace} min/mile</p>
                    <p><strong>Heart Rate:</strong> {selectedMarker.heartRate} bpm</p>
                    <PerformanceCharts selectedMarker={selectedMarker} />
                  </div>
                </div>
              </div>
              <button className="close-button" onClick={() => setSelectedMarker(null)}>Close</button>
            </div>
          )}
        </>
      )}
      
      <footer>
        <p>Built with React and Leaflet | Data from my half marathon on March 10, 2025</p>
      </footer>
    </div>
  );
}

export default App;