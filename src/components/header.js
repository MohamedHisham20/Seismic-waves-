  

// header.js
// Renders the top header bar for the Seismic Waves application.
// Displays the project title and subtitle.

import React from "react";

/**
 * Header component
 * Displays the main title and subtitle for the app
 */
export default function Header() {
    return (
        <div style={styles.headerContainer}>
            {/* Main project title */}
            <h1 style={styles.title}>Hocus Focus</h1>
            {/* Subtitle centered below the title */}
            <h1 style={{...styles.title, textAlign: 'center'}}>
                Explore the Universe
            </h1>
        </div>
    )
}

// Inline styles for header layout
const styles = {
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0, // Stretch across the width
      // backgroundColor: 'rgba(1, 14, 54, 0.5)',
      display: 'flex',
      padding: '0 2%', // Horizontal padding
      zIndex: 1000,
    },
    title: {
        color: '#fff',
        // fontFamily: 'Courier',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
};
