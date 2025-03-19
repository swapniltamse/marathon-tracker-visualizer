// PerformanceCharts.jsx
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Sample race data for the entire route
const fullRaceData = {
  miles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13.1],
  pace: [8.75, 8.6, 8.83, 9.1, 9.25, 9.4, 9.15, 9.3, 9.45, 8.5, 8.7, 8.4, 8.25], // in min/mile (decimal)
  heartRate: [145, 150, 155, 158, 162, 164, 165, 167, 170, 172, 175, 177, 178], // in BPM
  elevation: [10, 15, 25, 40, 45, 35, 20, 10, 5, 8, 12, 10, 5] // in feet
};

// Convert decimal pace to MM:SS format for display
const formatPace = (decimalPace) => {
  const minutes = Math.floor(decimalPace);
  const seconds = Math.round((decimalPace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const PerformanceCharts = ({ selectedMarker, showFullRoute = false }) => {
  // Options for the pace chart
  const paceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pace Throughout Race',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Pace: ${formatPace(context.raw)} min/mile`;
          }
        }
      }
    },
    scales: {
      y: {
        reverse: true, // Lower pace (faster) appears higher on chart
        title: {
          display: true,
          text: 'Min/Mile'
        },
        ticks: {
          callback: function(value) {
            return formatPace(value);
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mile'
        }
      }
    }
  };

  // Options for the heart rate chart
  const heartRateOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Heart Rate Throughout Race',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'BPM'
        },
        suggestedMin: 130,
      },
      x: {
        title: {
          display: true,
          text: 'Mile'
        }
      }
    }
  };

  // Options for the elevation chart
  const elevationOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Elevation Profile',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Elevation (ft)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mile'
        }
      }
    }
  };

  // Data for pace chart
  const paceData = {
    labels: fullRaceData.miles,
    datasets: [
      {
        label: 'Pace (min/mile)',
        data: fullRaceData.pace,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3
      }
    ]
  };

  // Data for heart rate chart
  const heartRateData = {
    labels: fullRaceData.miles,
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: fullRaceData.heartRate,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3
      }
    ]
  };

  // Data for elevation chart
  const elevationData = {
    labels: fullRaceData.miles,
    datasets: [
      {
        label: 'Elevation (ft)',
        data: fullRaceData.elevation,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: true
      }
    ]
  };

  // If we're showing data for a specific marker, highlight that point
  if (selectedMarker && !showFullRoute) {
    // Find the index that corresponds to the selected marker's mile
    const index = fullRaceData.miles.findIndex(m => m === selectedMarker.mile || 
                                                (m === Math.floor(selectedMarker.mile) && selectedMarker.mile % 1 !== 0));
    
    if (index !== -1) {
      // Create a subset of data centered around the selected mile (1 mile before and after)
      const startIndex = Math.max(0, index - 2);
      const endIndex = Math.min(fullRaceData.miles.length - 1, index + 2);
      
      const milesSubset = fullRaceData.miles.slice(startIndex, endIndex + 1);
      const paceSubset = fullRaceData.pace.slice(startIndex, endIndex + 1);
      const heartRateSubset = fullRaceData.heartRate.slice(startIndex, endIndex + 1);
      const elevationSubset = fullRaceData.elevation.slice(startIndex, endIndex + 1);
      
      // Update chart data with the subset
      paceData.labels = milesSubset;
      paceData.datasets[0].data = paceSubset;
      
      heartRateData.labels = milesSubset;
      heartRateData.datasets[0].data = heartRateSubset;
      
      elevationData.labels = milesSubset;
      elevationData.datasets[0].data = elevationSubset;
      
      // Add a point annotation to highlight the current point
      const highlightIndex = milesSubset.indexOf(selectedMarker.mile) !== -1 
        ? milesSubset.indexOf(selectedMarker.mile) 
        : milesSubset.indexOf(Math.floor(selectedMarker.mile));
      
      if (highlightIndex !== -1) {
        paceData.datasets.push({
          label: 'Current Position',
          data: Array(milesSubset.length).fill(null),
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)',
          pointRadius: 8,
          pointHoverRadius: 10
        });
        paceData.datasets[1].data[highlightIndex] = paceSubset[highlightIndex];
        
        heartRateData.datasets.push({
          label: 'Current Position',
          data: Array(milesSubset.length).fill(null),
          pointBackgroundColor: 'rgb(53, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(53, 162, 235)',
          pointRadius: 8,
          pointHoverRadius: 10
        });
        heartRateData.datasets[1].data[highlightIndex] = heartRateSubset[highlightIndex];
        
        elevationData.datasets.push({
          label: 'Current Position',
          data: Array(milesSubset.length).fill(null),
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(75, 192, 192)',
          pointRadius: 8,
          pointHoverRadius: 10
        });
        elevationData.datasets[1].data[highlightIndex] = elevationSubset[highlightIndex];
      }
    }
  }

  return (
    <div className="performance-charts">
      <div className="chart-container">
        <Line options={paceOptions} data={paceData} />
      </div>
      
      <div className="chart-container">
        <Line options={heartRateOptions} data={heartRateData} />
      </div>
      
      <div className="chart-container">
        <Bar options={elevationOptions} data={elevationData} />
      </div>
    </div>
  );
};

export default PerformanceCharts;