import React, { useState, useEffect } from "react";
import "./styles.css";
// import habimodal from "../../assets/img/habi-v-new.png";
import habimodal from "../../../assets/img/habi-v-new.png";
import lottie from "lottie-web";
import { useContext } from "react";
import RentabilidadContext from "../../../context/rentabilidad/rentabilidadContext";

import CircularProgress from '@mui/material/CircularProgress';

const StcResultado = () => {
  const [animationPlayedFirst, setAnimationPlayedFirst] = useState(false);
  const [animationPlayedSecond, setAnimationPlayedSecond] = useState(false);
  const [animationPlayedThird, setAnimationPlayedThird] = useState(false);

  const [completaDatos, setCompletaDatos] = useState(false);
  const [step, setStep] = useState(2);

  const [total, setTotal] = useState(null);
  const [inversionIni, setInversionIni] = useState(null);
  const [renta, setRenta] = useState(null);
  const [porcentajeGana, setPorcentajeGana] = useState(null);
  const [invertidoAnios, setInvertidoAnios] = useState(null);
  const [isLoadingValues, setIsLoadingValues] = useState(false)

  const [diaActual, setDiaActual] = useState(new Date().getDate())

  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre']

  const [mesActual, setMesActual] = useState(new Date().getMonth())
  const [anioActual, setAnioActual] = useState(new Date().getFullYear())
  const rentabilidadContext = useContext(RentabilidadContext);
  const {
    mes,
    anio,
    dia,
    fondo,
    saldoTotal,
    porcentaje,
    rentabilidad,
    inversionInicial,
    obtenerValorCuota,
    ocultarRenta,
    changeVisualRentabilidad
  } = rentabilidadContext;

  const handleFound = async (step) => {
    if (mes !== null && anio !== null) {
      if (inversionInicial !== null) {
        // console.log("mes", mes);
        // console.log("anio", anio);
        // console.log("dia", dia);
        // //console.log("saldoTotal", saldoTotal);
        // //console.log("porcentaje", porcentaje);
        // //console.log("rentabilidad", rentabilidad);
        // //console.log("inversionInicial", inversionInicial);
        setIsLoadingValues(true)
        setTotal(saldoTotal);
        setStep(step);
        setInversionIni(inversionInicial);
        const valorCuotaLast = await obtenerValorCuota(mes, anio, false);
        let valorCuotaActual = await obtenerValorCuota(mes, anio, true);
        // console.log('valorCuotaActual TOP : ', valorCuotaActual)
        if (valorCuotaActual.rows.length === 0) {
          setIsLoadingValues(true)
          const fechaActual = new Date();
          for (let index = 1; index < 13; index++) {
            fechaActual.setMonth(fechaActual.getMonth() - index);
            let mesNewActual = fechaActual.getMonth();
            let anioNewActual = fechaActual.getFullYear();

            let actualNewValue = await obtenerValorCuota(mesNewActual, anioNewActual, false);

            if (actualNewValue.rows.length !== 0) {
              setIsLoadingValues(false)
              // console.log('mesNewActual RESULTADO: ', mesNewActual)
              // console.log('actualNewValue RESULTADO: ', actualNewValue)
              valorCuotaActual = actualNewValue
              break;
            }
          }
        } else {
          setIsLoadingValues(false)
        }
        // console.log('valorCuotaActualvalorCuotaActual :', valorCuotaActual)
        let lastValue;
        let actualValue;
        console.log('valor del dia', dia)
        switch (step) {
          case 1:
            lastValue = valorCuotaLast.rows[dia - 1].fund1;
            console.log('valor couta fondo 1 fecha seleccion', lastValue)
            actualValue = valorCuotaActual.rows.pop().fund1;
            console.log('valor couta fondo 1 fecha actual', actualValue)
            break;
          case 2:
            lastValue = valorCuotaLast.rows[dia - 1].fund2;
            actualValue = valorCuotaActual.rows.pop().fund2;
            break;
          case 3:
            lastValue = valorCuotaLast.rows[dia - 1].fund3;
            actualValue = valorCuotaActual.rows.pop().fund3;
            break;
          default:
            break;
        }
        const lastValueNumber = lastValue.replace(/^S\/\s/, "");
        const actualValueNumber = actualValue.replace(/^S\/\s/, "");

        const lastRent = parseFloat(lastValueNumber);
        const nowRent = parseFloat(actualValueNumber);

        let inversionUltima = inversionInicial / lastRent;
        let inversionActual = inversionUltima * nowRent;

        let rentabilidadF = inversionActual - inversionInicial;
        let saldoTotalF = inversionActual.toFixed(2);
        console.log("rentabilidadF", rentabilidadF);
        var rentabilidadRedondeada = Math.round(rentabilidadF * 100) / 100;

        if (rentabilidadRedondeada === -0) {
          rentabilidadF = -0.01;
          saldoTotalF = saldoTotalF - 0.01;
        }


        setTotal(saldoTotalF);
        setRenta(rentabilidadF);
        setInversionIni(inversionInicial);

        const porcentajetotal = (rentabilidadF / inversionInicial) * 100;
        setPorcentajeGana(parseInt(porcentajetotal));

        const fecha = new Date();
        const anioActual = fecha.getFullYear();

        const invertidoAnios = anioActual - anio;
        setInvertidoAnios(invertidoAnios);
      }
    }
  };

  const handleStartAnimation = async () => {
    let animationStep;
    if (step === 1) {
      await setAnimationPlayedFirst(true);
      animationStep = animationPlayedFirst;
    } else if (step === 2) {
      await setAnimationPlayedSecond(true);
      animationStep = animationPlayedSecond;
    } else {
      await setAnimationPlayedThird(true);
      animationStep = animationPlayedThird;
    }

    const animation = lottie.loadAnimation({
      container: document.getElementById(`json-animation-here-${step}`),
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "https://lottie.host/1b1df540-207e-49e1-819b-042ee1dd1d69/te8cgJPNGC.json",
    });

    if (!animationStep && inversionInicial) {
      console.log("PLAY2");
      animation.goToAndPlay(0, true);
    } else {
      console.log("REPLAY");
      const div = document.getElementById(`json-animation-here-${step}`);
      if (div) {
        const svgElement = div.querySelector("svg");
        if (svgElement) {
          svgElement.remove();
        }
      }
      animation.goToAndPlay(0, true);
    }
  };

  const formatearNumero = (numero) => {

    if (numero === null) return null;
    if (numero === 0.99) return 0.99;
    const numeroRedondeado = Math.round(numero * 100) / 100;


    let partes = numeroRedondeado.toString().split(".");

    if (parseInt(partes[0]) >= 1000000) {
      partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/, "'");

      partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }




    return partes.join(".");
  };

  const mostrarSimulador = () => {
    console.log('entra en mostrar simulador')
    console.log('ocultarRenta', ocultarRenta)
    changeVisualRentabilidad(!ocultarRenta)
    var div = document.getElementById("resultado");
    div.classList.remove("d-none");
    div.classList.add("oculto");
  }

  useEffect(() => {
    console.log('resultado del valor ocultaREnta', ocultarRenta)
    var div = document.getElementById("resultado");
    if (ocultarRenta) {
      console.log('entra en ocultar')
      div.classList.remove("d-none");
      div.classList.remove("oculto");
      div.classList.add("mostrar");
    } else {
      div.classList.add("mostrar");

      div.classList.add("d-none");
    }
  }, [ocultarRenta]);

  useEffect(() => {
    const handleScroll = async () => {
      if (saldoTotal) {
        handleStartAnimation();
      }
    };
    handleScroll();
  }, [step, inversionInicial]);

  useEffect(() => {
    // console.log("mandarlo a fondo ", fondo);
    if (fondo) {
      // console.log("mandarlo a fondo ", fondo);
      handleFound(fondo);
    }
  }, [fondo]);

  useEffect(() => {
    // console.log(diaActual.getDay())
    const fecha = new Date();
    console.log('dia actuaaal',fecha.getDate())
    setAnimationPlayedSecond(false);
    var div = document.getElementById("resultado");
    div.classList.add("d-none");
  }, []);

  useEffect(() => {
    // console.log("mes seleccionado", mes);
    // console.log("anio seleccionado", anio);
    setInversionIni(inversionInicial);
    setTotal(saldoTotal);
    setRenta(rentabilidad);

    setPorcentajeGana(porcentaje);
    // //console.log("porcentaje", porcentajetotal.toFixed(2));
    const fecha = new Date();
    const anioActual = fecha.getFullYear();

    const invertidoAnios = anioActual - anio;
    setInvertidoAnios(invertidoAnios);
    // console.log("invertidoAnios", invertidoAnios);
    if (porcentajeGana !== null && invertidoAnios !== null) {
      setCompletaDatos(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inversionInicial, saldoTotal]);

  return (
    <div className="stc-hbt-resutl-rent py-5" id="resultado">

      <div className="container" style={{ padding: '0 4.5rem' }}>
        <div className="d-block box_general">
          <div className="row">
            <div className=" d-block col-lg-8">
              <h3 >
                <em>Simulador</em>
              </h3>
              <span>
                Realiza una simulación de la rentabilidad que podrías generar si empiezas a invertir con nosotros.
              </span>
            </div>

            <div className="container row box_resultado justify-content-center col-xs-8">
              <div className="header-pills d-flex align-items-center  mb-4  col-xs-12" style={{ marginTop: '1rem' }}>
                <div className="col-lg-6 col-xs-12">
                  <h5 className="card-title me-3 renta-title">Rentabilidad proyectada</h5>
                  <h5 className="card-title me-3 "> de {meses[mes]} {dia} del {anio} a {meses[mesActual]} {diaActual} del {anioActual} en : </h5>
                </div>
                <div className="col-lg-6 col-xs-12 ">
                  <div className="d-flex">
                    <div
                      className={step === 1 ? "btn-active" : "btn-inactive"}
                      onClick={() => handleFound(1)}
                    >
                      Fondo 1
                    </div>
                    <div
                      className={step === 2 ? "btn-active" : "btn-inactive"}
                      onClick={() => handleFound(2)}
                    >
                      Fondo 2
                    </div>
                    <div
                      className={step === 3 ? "btn-active" : "btn-inactive"}
                      onClick={() => handleFound(3)}
                    >
                      Fondo 3
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-content ">
                <div className="row ">
                  <div className="col-lg-6 col-xs-12 col1-tab">
                    <div className="card rounded-4 mb-4 inver-margen">
                      <div className="card-body px-0">
                        <div className="card-hd px-3">
                          <div className="d-flex">
                            <div className="col-auto">
                              <div className="card-icon d-flex align-items-center rounded-4 p-2">
                                <span className="icon material-symbols-rounded">
                                  trending_up
                                </span>
                              </div>
                            </div>
                            <div className="col ps-3">
                              <span className="card-caption body2">
                                Saldo total
                              </span>
                              <span className="card-mounth d-block">
                                {
                                  isLoadingValues ? <CircularProgress color="error" /> : (<>
                                    {/* S/ {total ? formatearNumero(total) : "35,000.67"} */}
                                    S/ {total ? formatearNumero(total) : "35,000.67"}
                                  </>
                                  )
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        <hr className="hr"></hr>
                        <div className="card-ft px-3">
                          <div className="d-flex align-item-center justify-content-between">
                            <div className="col-auto d-flex align-items-center">
                              <strong className="ft-txt">
                                Porcentaje de ganancia:
                              </strong>{" "}
                              <span className="ps-2 ft-number">
                                {
                                  isLoadingValues ? <CircularProgress color="error" /> : (<>
                                    {porcentajeGana}%
                                  </>)
                                }
                              </span>
                            </div>
                            <div className="col-auto">
                              <button
                                type="button"
                                className="btn btn-tooltip-icon p-1 d-flex align-items-center"
                              >
                                <span
                                  className="material-symbols-rounded"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  info_i
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card rounded-4 mb-4 inver-margen">
                      <div className="card-body px-0">
                        <div className="card-hd px-3">
                          <div className="d-flex">
                            <div className="col-auto">
                              <div className="card-icon d-flex align-items-center rounded-4 p-2">
                                <span className="icon material-symbols-rounded">
                                  business_center
                                </span>
                              </div>
                            </div>
                            <div className="col ps-3">
                              <span className="card-caption body2">
                                Inversión inicial
                              </span>
                              <span className="card-mounth d-block">
                                {
                                  isLoadingValues ? <CircularProgress color="error" /> : (<>S/ {formatearNumero(inversionIni)}</>)
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        <hr className="hr"></hr>
                        <div className="card-ft px-3">
                          <div className="d-flex align-item-center justify-content-between">
                            <div className="col-auto d-flex align-items-center">
                              <strong className="ft-txt">Invertido en:</strong>{" "}
                              <span className="ps-2 ft-number">
                                {
                                  isLoadingValues ? <CircularProgress color="error" /> : (<>{invertidoAnios} años</>)
                                }
                              </span>
                            </div>
                            <div className="col-auto">
                              <button
                                type="button"
                                className="btn btn-tooltip-icon p-1 d-flex align-items-center"
                              >
                                <span
                                  className="material-symbols-rounded"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  info_i
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-xs-12 col2-tab">
                    <div className="card card-rent rounded-4 mb-4 text-center">
                      <div className="card-body">
                        <div className="d-flex justify-content-center">
                          <div className="card-icon d-flex align-items-center rounded-4 p-2">
                            <span className="icon material-symbols-rounded">
                              savings
                            </span>
                          </div>
                        </div>
                        <div className="caption mt-2">Fondo {step}</div>
                        <h5 className="card-title m-0">
                          Rentabilidad proyectada
                        </h5>
                        <p className="card-text">
                          Tu fondo hubiera generado la siguiente rentabilidad
                        </p>
                        <span className="mounth-rentabilidad">
                          {
                            isLoadingValues ? <CircularProgress color="error" /> : (
                              <>
                                S/ {formatearNumero(renta)}{" "}
                                <span className="icon-disclaimer">*</span>
                              </>
                            )
                          }
                        </span>
                        {step === 1 && (
                          <div className="mt-n4" id="json-animation-here-1"></div>
                        )}
                        {step === 2 && (
                          <div className="mt-n4" id="json-animation-here-2"></div>
                        )}
                        {step === 3 && (
                          <div className="mt-n4" id="json-animation-here-3"></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="disclaimer col-lg-12 col-xs-12" style={{ marginTop: "1rem" }}>
                    * Los resultados de los montos de rentabilidad se basan en una
                    estimación que toma como referencia el último valor cuota vigente.
                    Es importante tener en cuenta que estos resultados son proyecciones y
                    no constituyen un compromiso por parte de la AFP para garantizar
                    un monto de rentabilidad específico.
                  </div>
                  <div style={{ textAlign: 'center', margin: '1rem' }} >
                    <a href="#ocultarSimulador" onClick={mostrarSimulador} className="btn hbt-btn-primary mb-2">
                      Invierte ahora
                    </a>
                  </div>
                </div>
              </div>


{/* 
              <div style={{ textAlign: 'center', margin: '1rem' }} >
                <a href="#ocultarSimulador" onClick={mostrarSimulador} className="btn hbt-btn-primary mb-2">
                  Invierte ahora
                </a>
              </div> */}

            </div>



          </div>

        </div>

        {/* MODAL */}
        <div
          className="modal fade modal-sm"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="col d-flex align-items-center w-100">
                  <img
                    src={habimodal}
                    alt="Habi BOT"
                    className="img-fluid img-modal m-auto"
                  />
                </div>
                <button
                  type="button"
                  className="btn-close position-absolute top-0 end-0"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body pb-1">
                <h5 className="mb-3">
                  Maximiza tus Fondos con las mejores opciones de servicio
                  que tenemos para ti.
                </h5>
                <p>
                  En <strong>AFP Habitat</strong> nos preocupamos por tu
                  bienestar por eso te brindamos las mejores alternativas de
                  servicio para que puedas sacarle el mejor provecho a tus
                  fondos.
                </p>
                <div className="">
                  <div className="col">
                    <div className="d-flex align-items-center pillar bg-paper rounded-3 p-2 mb-2">
                      <span className="material-symbols-rounded icons">
                        monitoring
                      </span>
                      <span className="txt-services ps-2">
                        AFP líder en rentabilidad
                      </span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="d-flex align-items-center pillar bg-paper rounded-3 p-2 mb-2">
                      <span className="material-symbols-rounded icons">
                        handshake
                      </span>
                      <span className="txt-services ps-2">
                        Mejor experiencia al cliente
                      </span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="d-flex align-items-center pillar bg-paper rounded-3 p-2">
                      <span className="material-symbols-rounded icons">
                        support_agent
                      </span>
                      <span className="txt-services ps-2">
                        Canales de atención digital
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="hr mx-3"></hr>
              <div className="modal-footer pt-0">
                <button type="button" href="#ocultarSimulador" className="btn hbt-btn-primary w-100">
                  Simular ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-lg-none text-center">
        <span className="disclaimer">
          * La rentabilidad es un factor que{" "}
          <a
            href="https://www.afphabitat.com.pe/rentabilidad/"
            target="_blank"
          >
            se evalúa anualmente y varía.
          </a>
        </span>
      </div>
    </div>
  );
};

export default StcResultado;
