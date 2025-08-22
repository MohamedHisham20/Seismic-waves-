
# Seismic Waves Project

Welcome to the Seismic Waves project! This repository contains a web application and supporting API for visualizing and analyzing seismic wave data for lunar and Martian environments. The project is organized into several main folders and files, each serving a specific purpose in the overall application.

---

## Full Project Files & Resources

All supporting materials for this project—including the demo, presentation, abstract, models used, and results—are available in the following Google Drive folder:

[Seismic Waves Project Resources (Google Drive)](https://drive.google.com/drive/folders/1IQoFpMAVsxhsXQvsTuxDc2uOmU-Ed-L9)

This single link provides access to all relevant files and documentation for the project.

---

## Table of Contents
- [Project Structure](#project-structure)
- [API](#api)
- [hisham (React Frontend)](#hisham-react-frontend)
- [public](#public)
- [src](#src)
- [How to Run](#how-to-run)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure

```
Seismic-waves-
│   package.json
│
├── API/
│   ├── app.py
│   ├── transQuick_final_lunar.pth
│   ├── transQuick_mars.pth
│   ├── static/
│   └── templates/
│       └── index.html
│
├── hisham/
│   ├── package.json
│   ├── README.md
│   ├── public/
│   ├── src/
│   └── ...
│
├── public/
│   ├── data.json
│   ├── favicon.ico
│   ├── icon.jpg
│   ├── index.html
│   └── ...
│
├── src/
│   ├── App.js
│   ├── index.js
│   ├── assets/
│   ├── components/
│   ├── mars/
│   ├── moon/
│   ├── pages/
│   └── ...
```

---

## API
**Folder:** `API/`
- `app.py`: Main Python backend (Flask or FastAPI) serving ML models and endpoints for seismic wave analysis.
- `transQuick_final_lunar.pth`, `transQuick_mars.pth`: Pre-trained PyTorch models for lunar and Martian seismic data.
- `static/`: Static files served by the API (e.g., images, CSS).
- `templates/index.html`: HTML template for API web interface or documentation.

### Comments:
- The API folder is responsible for all backend logic, including serving ML predictions and handling requests from the frontend.
- Model files are loaded by `app.py` to provide inference capabilities.

---

## hisham (React Frontend)
**Folder:** `hisham/`
- `package.json`: Lists dependencies and scripts for the React app.
- `README.md`: Documentation for the frontend (can be expanded).
- `public/`: Static assets for the React app (favicon, images, manifest, etc.).
- `src/`: Source code for the React app, including components, pages, and assets.

### Comments:
- This folder contains a standalone React application for visualizing seismic data and interacting with the backend API.
- The `src/` folder is organized by features (components, pages, assets).

---

## public
**Folder:** `public/`
- Shared static assets for the main web application (outside the React app).
- Includes data files (`data.json`, `nakamurasmlocations.json`), images, and the main `index.html`.

### Comments:
- These files are accessible to the client and may be used for initial data loading or static content.

---

## src
**Folder:** `src/`
- Main source code for the web application (outside the React app).
- Contains:
  - `App.js`, `index.js`: Entry points for the application.
  - `assets/`: Images and other static resources.
  - `components/`: Reusable UI components (e.g., `header.js`).
  - `mars/`, `moon/`: Feature folders for planetary models and images.
  - `pages/`: Page-level components and assets.

### Comments:
- The `src/` folder is modular, separating planetary features and UI components for maintainability.
- Each section (moon, mars) contains relevant models and images for visualization.

---

## How to Run

### Backend (API)
1. Navigate to the `API/` folder.
2. Install dependencies (e.g., `pip install -r requirements.txt`).
3. Run the API server:
   ```powershell
   python app.py
   ```

### Frontend (React)
1. Navigate to the `hisham/` folder.
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm start
   ```

---

## Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

---

## License
This project is licensed under the MIT License.

---

## Comprehensive Comments
- Each folder and file is organized for clarity and scalability.
- Backend and frontend are separated for modular development.
- ML models are versioned and stored in the API folder for easy updates.
- Static assets are grouped for efficient access and deployment.
- All major sections are commented and documented for ease of onboarding.

---

For further details, please refer to comments within individual source files.
