import React, { useReducer } from "react";
import RentabilidadReducer from "./rentabilidadReducer";
import RentabilidadContext from "./rentabilidadContext";

const RentabilidadState = (props) => {
  const initialState = {
    saldoTotal: null,
    porcentaje: null,
    inversionInicial: null,
    rentabilidad: null,
    dia:null,
    mes: null,
    anio: null,
    fondo: null,
    ocultarRenta: false,
  };

  const rentabilidadFondo2 = (montoInicial, rentabilidad) => {

    dispatch({
      typeo: "RENTABILIDAD_FONDO2",
      payload: {
        montoInicial: montoInicial,
        rentabilidad: rentabilidad,
      },
    });
  };

  const setMesAnio = (mes, anio) => {
    dispatch({
      type: "OBTENER_MES_ANIO",
      payload: {
        mes: mes,
        anio: anio,
      },
    });
  };
  const setStepRenta = (step) => {
    dispatch({
      type: "REINICIAR_FONDO",
      payload: {
        fondo: step,
      }
    });
  }
  const setDataFecha =(dia,mes,anio) => {
    dispatch({
      type: "SETEAR_FECHA",
      payload: {
        dia: dia,
        mes: mes,
        anio: anio,
      }
    });
  }
  const setFondoMayor = (fondo) => {
    dispatch({
      type: "FONDO_MAYOR",
      payload: {
        fondo: fondo,
      },
    });
  }
  const setDatosInversion = (
    inversionInicial,
    rentabilidad,
    saldoTotal,
    porcentaje
  ) => {
    dispatch({
      type: "OBTENER_DATOS",
      payload: {
        saldoTotal: saldoTotal,
        inversionInicial: inversionInicial,
        rentabilidad: rentabilidad,
        porcentaje: porcentaje,
      },
    });
  };

  const changeVisualRentabilidad = (ocultarRenta) => {
    dispatch({
      type: "OCULTAR_RENTABILIDAD",
      payload: {
        ocultarRenta: ocultarRenta,
      },
    });
  }
  const obtenerValorCuota = async (monthValue, yearValue, isActualMonth) => {
    try {
      let mesActual;
      let anioActual;
      if (isActualMonth) {
        const fechaActual = new Date();

        mesActual = fechaActual.getMonth() + 1;
        anioActual = fechaActual.getFullYear();
      } else {
        mesActual = monthValue + 1;
        anioActual = yearValue;
      }
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: mesActual, year: anioActual }),
      };

      const url =
        "https://zeusqa02.afphabitat.com.pe/api/privatezone/valores-cuota/dates";
      const response = await fetch(url, requestOptions);
      const resultado = await response.json();

      return resultado;
    } catch (error) {
      //console.log(error);
    }
  };
  const [state, dispatch] = useReducer(RentabilidadReducer, initialState);

  return (
    <RentabilidadContext.Provider
      value={{
        saldoTotal: state.saldoTotal,
        porcentaje: state.porcentaje,
        inversionInicial: state.inversionInicial,
        rentabilidad: state.rentabilidad,
        mes: state.mes,
        anio: state.anio,
        dia: state.dia,
        fondo: state.fondo,
        ocultarRenta: state.ocultarRenta,
        rentabilidadFondo2,
        setMesAnio,
        setDatosInversion,
        obtenerValorCuota,
        setStepRenta,
        setDataFecha,
        setFondoMayor,
        changeVisualRentabilidad
      }}
    >
      {props.children}
    </RentabilidadContext.Provider>
  );
};
export default RentabilidadState;
