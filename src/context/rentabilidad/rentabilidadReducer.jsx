
export default (state, action) => {
    switch(action.type) {
        case 'RENTABILIDAD_FONDO2':
            return {
                ...state,
                inversionInicial:  action.payload.montoInicial,
                rentabilidad: action.payload.rentabilidad
            }
            break;
        
        case 'OBTENER_MES_ANIO':
            return {
                ...state,
                mes: action.payload.mes,
                anio: action.payload.anio
            }
            break;
        case 'OBTENER_DATOS':
            return {
                ...state,
                inversionInicial: action.payload.inversionInicial,
                rentabilidad: action.payload.rentabilidad,
                saldoTotal: action.payload.saldoTotal,
                porcentaje: action.payload.porcentaje
                
            }
        case 'FONDO_MAYOR':
            return {
                ...state,
                fondo: action.payload.fondo
            }
            break;
        case 'SETEAR_FECHA':
            return {
                ...state,
                dia: action.payload.dia,
                mes: action.payload.mes,
                anio: action.payload.anio
            }
            break;
        case 'REINICIAR_FONDO':
            return {
                ...state,
                fondo: action.payload.fondo
            }
            break;
        case 'OCULTAR_RENTABILIDAD':
            return {
                ...state,
                ocultarRenta: action.payload.ocultarRenta
            }
            break;
    }
}

// saldoTotal : null,
// porcentaje : null,
// inversionInicial : null,
// rentabilidad : null,