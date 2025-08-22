
// marModel.js
// Renders a 3D interactive globe of Mars with seismic event visualization.
// Uses globe.gl for rendering and D3 for color scaling.

import React, { useEffect, useRef } from 'react';
import Globe from 'globe.gl'; // 3D globe library
import marsimg from './marsimg.jpg'; // Mars surface texture
import * as d3 from 'd3'; // D3 for color scaling

// Color scale for seismic rings
const colorScale = d3.scaleOrdinal([
  t => `rgba(0,102,255,${Math.sqrt(1 - t)})`, // Blue
  t => `rgba(0,120,0,${Math.sqrt(1 - t)})`,   // Green
  t => `rgba(255,200,2,${Math.sqrt(1 - t)})`, // Yellow
  t => `rgba(255,42,4,${Math.sqrt(1 - t)})`   // Red
]);

/**
 * MarsModel component
 * @param {number} sentSpeed - Seismic event speed
 * @param {number} sentLat - Latitude of event
 * @param {number} sentLng - Longitude of event
 * @param {string} sentDate - Date of event
 * @param {string} sentTime - Time of event
 */
export default function MarsModel({ sentSpeed, sentLat, sentLng, sentDate, sentTime }) {
  const globeRef = useRef(); // Ref for globe DOM element

  // Triggers device vibration and sound on label click
  const vibratepattern = (n, audioPath) => {
    const canVibrate = navigator.vibrate;
    if (canVibrate) {
      navigator.vibrate(500 * (n + 1));  // Vibrate based on magnitude
    }
    play(audioPath, n);
  };

  // Plays sound for vibration feedback
  const play = (audioPath, ms) => {
    const beep = new Audio(audioPath);
    beep.loop = true;
    beep.play();
    setTimeout(() => {
      beep.pause();  // Stop playing after the timeout
    }, 500 * (ms + 1));
  };

  // Initialize and update globe visualization
  useEffect(() => {
    // Create globe instance
    const mars = Globe()
      .width(window.innerWidth/2)
      .height(window.innerHeight)
      .globeImageUrl(marsimg)
      // .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .backgroundColor('rgba(0,0,0,0)')
      .showGraticules(false)
      .showAtmosphere(true)
      .atmosphereColor("orange")
      .atmosphereAltitude(0.18)
      .labelColor(() => "black")
      .labelText(() => 'marsquake')
      .labelSize(2.5)
      .labelDotRadius(0.3)
      // Custom label with event details
      .labelLabel(() => `
        <div> Magnitude: <b>${sentSpeed}</b></div>
        <div> Lat, Long: <b>${sentLat}</b>\u00B0, <b>${sentLng}</b>\u00B0</div>
        <div>Date: <i>${new Date(sentDate).toLocaleDateString()}</i></div>
        <div>Time: <i>${sentTime}</i></div>
      `)
      .onLabelClick(() => vibratepattern(sentSpeed, `${process.env.PUBLIC_URL}/vibrate_sound.wav`))
      .ringColor(() => colorScale(Math.min(Math.max(sentSpeed, 0), 10)))
      .ringMaxRadius(() => Math.min(10, 6 * sentSpeed))
      .ringPropagationSpeed(() => Math.min(5, Math.max(1, sentSpeed)))
      .ringRepeatPeriod(() => Math.max(100, (1 / sentSpeed) * 200 + 100));

    // Attach globe to DOM
    mars(globeRef.current);

    // If event data is available, show label and ring
    if (sentSpeed && sentLat && sentLng && sentDate && sentTime) {
      // Label data for seismic event
      const labels = {
        "lat": sentLat,
        "lng": sentLng,
        "magnitude": sentSpeed,
        "date": sentDate,
        "time": sentTime,
      };

      // Ring data for seismic event
      const rings = {
        "lat": sentLat,
        "lng": sentLng,
        "magnitude": sentSpeed,
        "date": sentDate,
        "time": sentTime,
      };

      mars.labelsData([labels]);
      mars.ringsData([rings]);
    }
  }, [sentSpeed, sentLat, sentLng, sentDate, sentTime]);

  // Render globe container
  return (
    <div ref={globeRef} />
  );
}

