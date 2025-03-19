// GpxParser.js - Utility to parse GPX files
import { XMLParser } from "fast-xml-parser";

/**
 * Parse a GPX file and extract route data
 * @param {string} gpxContent - The GPX file content
 * @returns {Object} Parsed route data
 */
export const parseGpxFile = (gpxContent) => {
  try {
    // Configure XML parser
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      isArray: (name) => ["trkpt", "trk", "trkseg", "wpt"].includes(name),
    });

    // Parse GPX XML content
    const result = parser.parse(gpxContent);

    if (!result.gpx) {
      throw new Error("Invalid GPX file format");
    }

    // Extract track points (from tracks)
    let points = [];
    let waypoints = [];

    // Process track segments
    if (result.gpx.trk && result.gpx.trk.length > 0) {
      const track = result.gpx.trk[0]; // Use first track

      if (track.trkseg && track.trkseg.length > 0) {
        const segment = track.trkseg[0]; // Use first segment

        if (segment.trkpt && segment.trkpt.length > 0) {
          points = segment.trkpt.map((point) => ({
            lat: parseFloat(point["@_lat"]),
            lng: parseFloat(point["@_lon"]),
            elevation: point.ele ? parseFloat(point.ele) : null,
            time: point.time ? new Date(point.time) : null,
          }));
        }
      }
    }

    // Process waypoints (markers)
    if (result.gpx.wpt && result.gpx.wpt.length > 0) {
      waypoints = result.gpx.wpt.map((wp) => ({
        lat: parseFloat(wp["@_lat"]),
        lng: parseFloat(wp["@_lon"]),
        name: wp.name || "Waypoint",
        description: wp.desc || "",
        elevation: wp.ele ? parseFloat(wp.ele) : null,
        time: wp.time ? new Date(wp.time) : null,
      }));
    }

    // Calculate route statistics
    const statistics = calculateRouteStatistics(points);

    return {
      name:
        result.gpx.trk && result.gpx.trk.length > 0
          ? result.gpx.trk[0].name || "GPX Route"
          : "GPX Route",
      points,
      waypoints,
      statistics,
    };
  } catch (error) {
    console.error("Error parsing GPX file:", error);
    throw new Error(`Failed to parse GPX file: ${error.message}`);
  }
};

/**
 * Calculate statistics from route points
 * @param {Array} points - Array of route points
 * @returns {Object} Route statistics
 */
const calculateRouteStatistics = (points) => {
  if (!points || points.length === 0) {
    return {
      totalDistance: 0,
      elevationGain: 0,
      elevationLoss: 0,
      maxElevation: 0,
      minElevation: 0,
      startTime: null,
      endTime: null,
      duration: 0,
    };
  }

  let totalDistance = 0;
  let elevationGain = 0;
  let elevationLoss = 0;
  let elevations = points.map((p) => p.elevation).filter((e) => e !== null);

  // Calculate distance and elevation
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const currentPoint = points[i];

    // Calculate distance between consecutive points
    totalDistance += calculateDistance(
      prevPoint.lat,
      prevPoint.lng,
      currentPoint.lat,
      currentPoint.lng
    );

    // Calculate elevation changes
    if (prevPoint.elevation !== null && currentPoint.elevation !== null) {
      const elevationChange = currentPoint.elevation - prevPoint.elevation;
      if (elevationChange > 0) {
        elevationGain += elevationChange;
      } else {
        elevationLoss += Math.abs(elevationChange);
      }
    }
  }

  // Calculate time-based statistics
  const validTimes = points.map((p) => p.time).filter((t) => t !== null);
  const startTime = validTimes.length > 0 ? validTimes[0] : null;
  const endTime =
    validTimes.length > 0 ? validTimes[validTimes.length - 1] : null;

  // Duration in milliseconds
  const duration = startTime && endTime ? endTime - startTime : 0;

  return {
    totalDistance: totalDistance, // in kilometers
    elevationGain: elevationGain, // in meters
    elevationLoss: elevationLoss, // in meters
    maxElevation: elevations.length > 0 ? Math.max(...elevations) : 0,
    minElevation: elevations.length > 0 ? Math.min(...elevations) : 0,
    startTime,
    endTime,
    duration, // in milliseconds
  };
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert route points to a format usable by leaflet
 * @param {Array} points - Array of route points
 * @returns {Array} Array of [lat, lng] pairs for Leaflet
 */
export const convertPointsToLeafletFormat = (points) => {
  return points.map((point) => [point.lat, point.lng]);
};

/**
 * Generate race data points at regular intervals along the route
 * @param {Object} routeData - Parsed route data
 * @param {number} numPoints - Number of points to generate
 * @returns {Array} Generated race data points
 */
export const generateRaceDataPoints = (routeData, numPoints = 5) => {
  const { points, statistics } = routeData;
  if (!points || points.length === 0) return [];

  // Calculate total route distance in miles
  const totalDistanceInMiles = statistics.totalDistance * 0.621371;

  // Calculate indices at which to place marker points
  const indices = [];
  const interval = Math.floor(points.length / (numPoints - 1));

  for (let i = 0; i < numPoints - 1; i++) {
    indices.push(i * interval);
  }
  indices.push(points.length - 1); // Add the last point

  // Generate race data points
  return indices.map((index, i) => {
    const point = points[index];
    const mile =
      i === numPoints - 1
        ? totalDistanceInMiles
        : Math.round(((i * totalDistanceInMiles) / (numPoints - 1)) * 10) / 10;

    // Create distance-based description
    let description = "";
    if (i === 0) {
      description =
        "Race began with perfect weather conditions. Feeling strong!";
    } else if (i === numPoints - 1) {
      description =
        "Crossed the finish line with a new PR! Amazing experience.";
    } else if (i < numPoints / 3) {
      description = "Maintaining a steady pace. Feeling good and strong.";
    } else if (i < (numPoints * 2) / 3) {
      description =
        "Starting to feel the effort but pushing through. Great crowd support.";
    } else {
      description = "The home stretch! Picking up pace for the strong finish.";
    }

    // Generate random but realistic heart rate based on progress
    const baseHeartRate = 140;
    const maxIncrease = 40;
    const heartRate = Math.round(
      baseHeartRate + (maxIncrease * i) / (numPoints - 1)
    );

    // Generate random but realistic pace based on progress (U-shaped curve)
    const basePace = 9.0; // 9:00 min/mile
    const middle = numPoints / 2;
    const distFromMiddle = Math.abs(i - middle);
    const paceChange = -0.5 + (distFromMiddle / middle) * 0.75;
    const pace = (basePace + paceChange).toFixed(2);

    // Format pace for display (convert to min:sec)
    const paceMin = Math.floor(parseFloat(pace));
    const paceSec = Math.round((parseFloat(pace) - paceMin) * 60);
    const paceFormatted = `${paceMin}:${paceSec.toString().padStart(2, "0")}`;

    return {
      id: i + 1,
      position: [point.lat, point.lng],
      mile: mile,
      location:
        i === 0
          ? "Start Line"
          : i === numPoints - 1
          ? "Finish Line"
          : `Mile ${mile}`,
      description,
      pace: paceFormatted,
      heartRate: heartRate,
      photoUrl: "/api/placeholder/200/150",
      videoUrl: "https://example.com/race-video",
      videoThumbnail: "/api/placeholder/320/180",
      elevation: point.elevation,
      time: point.time,
    };
  });
};
