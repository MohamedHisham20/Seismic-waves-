
// MoonModel.js
// Renders a 3D interactive globe of the Moon with seismic event visualization.
// Uses globe.gl for rendering and D3 for color scaling.

import React, { useEffect, useRef } from 'react';
import Globe from 'globe.gl'; // 3D globe library
import lroc from './lroc_color_poles_8k.jpg'; // Moon surface texture
import ldem from './ldem_3_8bit.jpg';         // Moon elevation bump map
import * as d3 from 'd3'; // D3 for color scaling

// Color scale for seismic rings
const colorScale = d3.scaleOrdinal([
  t => `rgba(0,102,255,${Math.sqrt(1 - t)})`, // Blue
  t => `rgba(0,120,0,${Math.sqrt(1 - t)})`,   // Green
  t => `rgba(255,200,2,${Math.sqrt(1 - t)})`, // Yellow
  t => `rgba(255,42,4,${Math.sqrt(1 - t)})`   // Red
]);

/**
 * MoonModel component
 * @param {number} sentSpeed - Seismic event speed
 * @param {number} sentLat - Latitude of event
 * @param {number} sentLng - Longitude of event
 * @param {string} sentDate - Date of event
 * @param {string} sentTime - Time of event
 */
export default function MoonModel({ sentSpeed, sentLat, sentLng, sentDate, sentTime }) {
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
    const moon = Globe()
      .width(window.innerWidth/2)
      .height(window.innerHeight)
      .globeImageUrl(lroc)
      .bumpImageUrl(ldem)
      .backgroundColor('rgba(0,0,0,0)')
      // .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .showGraticules(false)
      .showAtmosphere(true)
      .atmosphereColor("gray")
      .atmosphereAltitude(0.2)
      .labelColor(() => "black")
      .labelText(() => 'moonquake')
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
    moon(globeRef.current);

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

      moon.labelsData([labels]);
      moon.ringsData([rings]);

      // Debug output
      console.log('Label:', labels);
      console.log('Ring:', rings);
    }
  }, [sentSpeed, sentLat, sentLng, sentDate, sentTime]);

  // Render globe container
  return (
    <div ref={globeRef} style={{ width: '100%', height: '100vh' }} />
  );
}