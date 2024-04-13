import "./App.css";

import Prueba from "./sections/Simulador/Prueba/Prueba";
import "./App.css";
import { useMediaQuery, useTheme } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css"; // Importar los estilos CSS de Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React from "react";

// import Simulator from "./sections/simulator";
import StcResultado from "./sections/Simulador/stcResultado/index";

import RentabilidadState from "./context/rentabilidad/rentabilidadState";

function App() {
  const theme = useTheme();
  const screenMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <RentabilidadState>
      <div className="App">
   
        <Prueba/>
        <StcResultado />
     
      </div>
    </RentabilidadState>
  );
}

export default App;
