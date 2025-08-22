
// App.js
// Main entry point for the Seismic Waves React frontend.
// Handles file upload, planet selection, and displays seismic event visualization.

import React, { useState } from 'react';
import Header from './components/header'; // Top header bar
import MoonModel from './moon/MoonModel'; // 3D Moon visualization
import MarsModel from './mars/marModel';  // 3D Mars visualization

export default function App() {
  // State variables for selected planet and seismic event data
  const [planet, setPlanet] = useState('moon'); // 'moon' or 'mars'
  const [speed, setSpeed] = useState('');      // Seismic event speed
  const [lat, setLat] = useState('');          // Latitude of event
  const [lng, setLng] = useState('');          // Longitude of event
  const [date, setDate] = useState('');        // Date of event
  const [time, setTime] = useState('');        // Time of event

  // Handles switching between Moon and Mars
  const handleOptionChange = (event) => {
    setPlanet(event.target.value); // Update selected planet
    setImageUrl(null); // Reset image and event data
    setSpeed(null);
    setLat(null);
    setLng(null);
    setDate(null);
    setTime(null);
  };

  // State for uploaded image (seismic plot)
  const [imageUrl, setImageUrl] = useState(null);

  // Handles file upload and API request
  const uploadFile = () => {
    // Reset previous results
    setImageUrl(null);
    setSpeed(null);
    setLat(null);
    setLng(null);
    setDate(null);
    setTime(null);
    // Get file from input
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    // Choose API endpoint based on planet
    if (planet === 'moon') {
      fetch('https://www.nasa.great-eagle.net/upload_mseed_lunar', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        // If image returned, update state with event data
        if (data.image) {
          setImageUrl('data:image/png;base64,' + data.image);
          setSpeed(data.speed);
          setLat(data.lat);
          setLng(data.lng);
          setDate(data.date);
          setTime(data.time);
        } else {
          console.error('Error:', data.error);
        }
      })
      .catch(error => console.error('Error:', error));
    } else {
      fetch('https://www.nasa.great-eagle.net/upload_mseed_mars', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.image) {
          setImageUrl('data:image/png;base64,' + data.image);
          setSpeed(data.speed);
          setLat(data.lat);
          setLng(data.lng);
          setDate(data.date);
          setTime(data.time);
        } else {
          console.error('Error:', data.error);
        }
      })
      .catch(error => console.error('Error:', error));
    }
  };

  // Main UI rendering
  return (
    <div style={styles.container}>
      <Header /> {/* Top header bar */}
      <div style={styles.columnsContainer}>
        <div style={styles.columnLeft}>
          <main style={styles.main}>
            {/* File input for seismic data upload */}
            <input type="file" id="fileInput" 
            style={{
              ...styles.input, marginLeft: 10, 
              backgroundColor: planet === 'moon' 
                ? 'rgba(150, 150, 150, 0.75)' 
                : 'rgba(209, 149, 92, 0.75)'
            }} />
            {/* Upload button triggers API call */}
            <button 
              onClick={uploadFile} 
              style={{
                ...styles.input, 
                backgroundColor: planet === 'moon' 
                  ? 'rgba(150, 150, 150, 0.75)' 
                  : 'rgba(209, 149, 92, 0.75)'
              }}>
              Upload
            </button>

            {/* Radio buttons for planet selection */}
            <div>
              <label style={styles.label}>
                <input
                  type="radio"
                  value="moon"
                  checked={planet === 'moon'}
                  onChange={handleOptionChange}
                />
                Moon
              </label>

              <label style={styles.label}>
                <input
                  type="radio"
                  value="mars"
                  checked={planet === 'mars'}
                  onChange={handleOptionChange}
                />
                Mars
              </label>
            </div>
            {/* Display seismic plot image if available */}
            <div style={{alignItems: 'center', justifyContent: 'center'}}>
            {imageUrl && <img id="image" alt="Uploaded" src={imageUrl} style={styles.image} />}
            </div>
          </main>
        </div>
        <div style={styles.columnRight}>
          {/* Render Moon or Mars 3D model with event data */}
          {planet === 'moon' ? 
            <MoonModel sentSpeed={speed * 1e10} sentLat={lat} sentLng={lng} sentDate={date} sentTime={time} /> 
          : 
            <MarsModel sentSpeed={speed * 1e13} sentLat={lat} sentLng={lng} sentDate={date} sentTime={time} />
          }
        </div>
      </div>
    </div>
  );
}

// Styles for layout and UI components
const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundImage: "url('//unpkg.com/three-globe/example/img/night-sky.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: -1,
  },
  columnsContainer: {
    display: 'flex',
    flex: 1, // Make the container take the full remaining space
  },
  columnLeft: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  columnRight: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // border: '2px solid rgba(1, 14, 54, 0.5)',
    // height: '99vh',
  },
  main: {
    marginLeft: 15,
    paddingTop: "90px",
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    marginLeft: 15,
    // backgroundColor: 'rgba(167, 177, 207, 0.85)',
    // backgroundColor: 'rgba(150, 150, 150, 0.75)',
    padding: 5,
    fontSize: 15,
    // color: '#010e36',
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: 10,
    marginBottom: '10px'
  },
  label: {
    fontSize: 20,
    color: '#fff',
    margin: 20,
    marginBottom: '10px'
  },
  image: {
    width: '80%'
  }
};
