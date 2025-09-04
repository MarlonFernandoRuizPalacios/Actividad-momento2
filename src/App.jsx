// src/app/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import routes from "./Routes"; // 👈 Importas todas las rutas definidas

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes.map(({ path, element, index }) => (
            <Route key={path} path={path} element={element} index={index} />
          ))}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
