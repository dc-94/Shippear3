// Contenido del curso PORTADO de la maqueta de Cesar (docs/mockups/index.html).
// OJO (coordinar con C): esta es la fuente que consume la app. Si se edita la
// maqueta, este archivo queda desincronizado. A futuro conviene migrarlo a content/.

export type Bloque = { h: string; p: string };
export type QuizOpt = { t: string; ok: boolean };
export type CursoQuiz = { q: string; opts: QuizOpt[]; fb: string };
export type Curso = {
  t: string;        // título
  cat: string;      // categoría (rf | rv | fondos | ma)
  c: string;        // color (valor para --tc)
  nivel: string;
  ic: string;       // interior de un <svg viewBox="0 0 24 24">
  frase: string;
  corta: string;
  bloques: Bloque[];
  claves: string[];
  rel: string[];
  quiz: CursoQuiz;
};
export type Cat = { n: string; c: string; d: string; ej: string[]; ic: string };

export const CAT: Record<string, Cat> ={
    rf:{n:"Renta fija", c:"var(--blue)", d:"Le prestás plata a alguien (un banco, una empresa, el Estado) y te la devuelve con un interés pactado. Sabés, en condiciones normales, cuánto y cuándo vas a cobrar: más previsible y de menor riesgo, pero con un rendimiento más acotado.", ej:["Plazo fijo","Bonos","Obligaciones Negociables","FCI money market"], ic:'<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>'},
    rv:{n:"Renta variable", c:"var(--violet)", d:"Comprás una parte de un activo (una empresa, una cripto) y tu resultado depende de cómo le vaya: no hay rendimiento asegurado. Podés ganar más que en renta fija, pero también podés perder. Más riesgo, más potencial.", ej:["Acciones","CEDEARs","Criptomonedas","FCI de acciones"], ic:'<path d="M4 18 L10 11 L14 15 L20 7"/><path d="M15 7h5v5"/>'},
    fondos:{n:"Fondos (FCI)", c:"#4F46E5", d:"Invertís en conjunto con otras personas y lo administra un profesional.", ej:[], ic:'<path d="M12 3v9l6 4"/><circle cx="12" cy="12" r="9"/>'},
    ma:{n:"Macro y ahorro", c:"var(--accent)", d:"No son instrumentos para invertir, sino variables y refugios que conviene entender.", ej:[], ic:'<path d="M4 20h16"/><rect x="6" y="12" width="3" height="6"/><rect x="11" y="8" width="3" height="10"/><rect x="16" y="4" width="3" height="14"/>'}
  };

export const CURSOS: Record<string, Curso> ={
    acciones:{t:"Acciones", cat:"rv", c:"var(--accent)", nivel:"Principiante", ic:'<path d="M4 18 L10 11 L14 15 L20 7"/><path d="M15 7h5v5"/>',
      frase:"Ser dueño de un pedacito de una empresa.",
      corta:"Ser dueño de una parte de una empresa.",
      bloques:[
        {h:"¿Qué es?", p:"Una acción es una parte muy chiquita de la propiedad de una empresa. Cuando comprás acciones, te convertís en socio en miniatura de esa empresa."},
        {h:"¿Cómo se gana (o se pierde)?", p:"De dos maneras: si el precio de la acción sube y la vendés más cara (ganancia de capital), y por los dividendos, que son una parte de las ganancias que la empresa reparte entre sus accionistas."},
        {h:"Riesgo y rendimiento", p:"Es renta variable: nadie te asegura cuánto vas a ganar. El precio sube y baja todos los días según cómo le va a la empresa y a la economía. Podés ganar mucho, pero también perder parte de lo invertido."},
        {h:"En Argentina", p:"Se compran y venden en el mercado local (BYMA) a través de un bróker, abriendo una cuenta comitente. Hay acciones de empresas argentinas y también podés acceder a las del exterior con CEDEARs."}
      ],
      claves:["Sos dueño de una parte de la empresa","Ganás por suba de precio y por dividendos","Renta variable: sin rendimiento asegurado"],
      rel:["CEDEAR","Riesgo","Diversificación"],
      quiz:{q:"¿De qué dos formas podés ganar con una acción?", opts:[{t:"Solo si la empresa quiebra",ok:false},{t:"Por la suba del precio y por los dividendos",ok:true},{t:"Por un interés fijo mensual",ok:false}], fb:"Ganás si el precio sube y además por los dividendos que reparte la empresa. El interés fijo es de la renta fija."}
    },
    cedears:{t:"CEDEARs", cat:"rv", c:"var(--pink)", nivel:"Principiante", ic:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
      frase:"Acciones del exterior, compradas en pesos.",
      corta:"Acciones del exterior, en pesos.",
      bloques:[
        {h:"¿Qué es?", p:"Un CEDEAR (Certificado de Depósito Argentino) representa una acción de una empresa extranjera —como Apple, Tesla o Coca-Cola— pero cotiza en pesos en el mercado argentino."},
        {h:"¿Cómo funciona?", p:"Comprás en pesos y tu inversión sigue dos cosas: el precio de la acción en el exterior y el valor del dólar (CCL). Así tenés exposición a empresas globales y al dólar sin sacar la plata del país."},
        {h:"Riesgo y rendimiento", p:"Es renta variable: sumás el riesgo de la acción y el del tipo de cambio. Si la acción sube o el dólar sube, te favorece; si bajan, te perjudica."}
      ],
      claves:["Representan acciones del exterior","Se compran en pesos, en Argentina","Te dan exposición al dólar"],
      rel:["Acción","Dólar MEP"],
      quiz:{q:"¿Qué permite un CEDEAR?", opts:[{t:"Invertir en acciones del exterior pagando en pesos",ok:true},{t:"Un plazo fijo garantizado por el Estado",ok:false},{t:"Comprar dólar billete en el banco",ok:false}], fb:"Un CEDEAR te deja invertir en empresas del exterior, en pesos y desde Argentina."}
    },
    cripto:{t:"Criptomonedas", cat:"rv", c:"var(--violet)", nivel:"Principiante", ic:'<circle cx="12" cy="12" r="8"/><path d="M9.5 8.5h4a2 2 0 0 1 0 4h-4m0 0h4.3a2 2 0 0 1 0 4H9.5m0-8V6.5m0 11V16m2.5-9.5V6m0 12v-.5"/>',
      frase:"Dinero digital, descentralizado y muy volátil.",
      corta:"Qué es Bitcoin y cómo funciona.",
      bloques:[
        {h:"¿Qué es?", p:"Una criptomoneda es dinero digital que vive en una red llamada blockchain, sin un banco central ni un gobierno que la controle. Las más conocidas son Bitcoin y Ethereum."},
        {h:"¿Cómo funciona?", p:"Se compran y venden en plataformas (exchanges), las 24 horas. El precio lo fija la oferta y la demanda, y puede cambiar muchísimo en poco tiempo."},
        {h:"Riesgo y rendimiento", p:"Es de lo más volátil: puede subir o bajar fuerte en pocos días. No tiene respaldo de un Estado y hay que tener cuidado con las estafas y con dónde se guardan las monedas."},
        {h:"Un apunte útil", p:"Existen las stablecoins (como USDT o USDC), que buscan mantener el valor de un dólar. No todas las cripto se mueven igual."}
      ],
      claves:["Dinero digital sin banco central","Muy volátil","Cuidado con estafas y con la custodia"],
      rel:["Volatilidad","Dólar MEP"],
      quiz:{q:"¿Qué caracteriza a la mayoría de las criptomonedas?", opts:[{t:"Tienen rendimiento fijo asegurado",ok:false},{t:"Son muy volátiles y no las controla un banco central",ok:true},{t:"Las garantiza el Banco Central argentino",ok:false}], fb:"Son digitales, descentralizadas y suelen ser muy volátiles."}
    },
    plazofijo:{t:"Plazo fijo", cat:"rf", c:"var(--amber)", nivel:"Principiante", ic:'<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>',
      frase:"Prestarle al banco a cambio de un interés fijo.",
      corta:"Guardar plata a cambio de interés.",
      bloques:[
        {h:"¿Qué es?", p:"Dejás una cantidad de plata depositada en el banco por un plazo (por ejemplo 30 días) y el banco te paga un interés pactado de antemano."},
        {h:"¿Cómo funciona?", p:"Cuando se cumple el plazo, te devuelven tu plata más los intereses. Desde el primer día sabés cuánto vas a cobrar: por eso es el ejemplo más claro de renta fija."},
        {h:"La variante UVA", p:"El plazo fijo UVA ajusta tu plata por la inflación más un pequeño plus. Suele pedir un plazo mínimo más largo, pero te protege de que los precios suban."},
        {h:"Riesgo y rendimiento", p:"Es de bajo riesgo (los depósitos están cubiertos por una garantía hasta cierto monto). El verdadero riesgo es que la inflación o el dólar le ganen a la tasa y pierdas poder de compra."}
      ],
      claves:["Sabés cuánto cobrás desde el día 1","Bajo riesgo","Ojo: la inflación puede ganarle a la tasa"],
      rel:["UVA","Inflación"],
      quiz:{q:"¿Por qué el plazo fijo es renta fija?", opts:[{t:"Porque el interés se pacta de antemano y sabés cuánto vas a cobrar",ok:true},{t:"Porque el rendimiento depende de la bolsa",ok:false},{t:"Porque nunca pierde contra la inflación",ok:false}], fb:"Porque el interés está pactado: sabés cuánto y cuándo vas a cobrar."}
    },
    bonos:{t:"Bonos", cat:"rf", c:"#0891B2", nivel:"Intermedio", ic:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>',
      frase:"Prestarle al Estado o a una empresa a cambio de intereses.",
      corta:"Prestarle al Estado o a una empresa.",
      bloques:[
        {h:"¿Qué es?", p:"Un bono es un préstamo que vos le hacés al Estado o a una empresa. A cambio, te pagan intereses (llamados cupón) y te devuelven el capital en una fecha de vencimiento."},
        {h:"¿Cómo funciona?", p:"Cada bono tiene un cronograma de pagos. Podés quedártelo y cobrar los cupones, o venderlo antes en el mercado al precio que esté en ese momento."},
        {h:"Tipos de bonos", p:"Hay bonos soberanos (del Estado nacional), provinciales y corporativos. A los bonos de empresas se los llama Obligaciones Negociables (ON)."},
        {h:"Riesgo y rendimiento", p:"El riesgo principal es que quien te debe no pague (default), y que el precio baje si querés vender antes de tiempo. En Argentina, el riesgo país mide justamente la desconfianza sobre la deuda del Estado."}
      ],
      claves:["Le prestás al Estado o a una empresa","Cobrás intereses (cupón) + el capital","Riesgo: que no te paguen (default)"],
      rel:["Acción","Riesgo"],
      quiz:{q:"¿Qué sos cuando comprás un bono?", opts:[{t:"Dueño de la empresa",ok:false},{t:"Prestamista: te deben plata y te pagan intereses",ok:true},{t:"Dueño de un inmueble",ok:false}], fb:"Con un bono prestás plata; no sos dueño. Dueño serías con una acción."}
    },
    fci:{t:"Fondos (FCI)", cat:"fondos", c:"#4F46E5", nivel:"Principiante", ic:'<path d="M12 3v9l6 4"/><circle cx="12" cy="12" r="9"/>',
      frase:"Invertir en conjunto, administrado por profesionales, desde poca plata.",
      corta:"Invertir junto a otros, de a poco.",
      bloques:[
        {h:"¿Qué es?", p:"Un Fondo Común de Inversión (FCI) junta tu plata con la de muchas otras personas, y un equipo profesional la invierte por vos en un montón de activos a la vez."},
        {h:"¿Cómo funciona?", p:"Comprás cuotapartes del fondo. El valor de tu cuotaparte sube o baja según cómo le va a la cartera del fondo. Podés empezar con montos chicos."},
        {h:"Tipos (importante)", p:"Hay fondos money market (muy conservadores, con liquidez casi inmediata), de renta fija, de renta variable y mixtos. Por eso un FCI puede ser de renta fija O de renta variable, según en qué invierta."},
        {h:"Riesgo y rendimiento", p:"Depende del tipo de fondo: un money market es muy tranquilo; uno de acciones, mucho más movido. Conviene mirar siempre en qué invierte antes de elegir."}
      ],
      claves:["Invertís en conjunto, lo maneja un profesional","Desde montos chicos","El riesgo depende del tipo de fondo"],
      rel:["Riesgo","Diversificación"],
      quiz:{q:"¿Un FCI es siempre renta fija?", opts:[{t:"No: puede ser de renta fija o variable según en qué invierta",ok:true},{t:"Sí, siempre es renta fija",ok:false},{t:"Sí, siempre es renta variable",ok:false}], fb:"Depende del fondo: los hay conservadores (money market, renta fija) y de renta variable."}
    },
    dolar:{t:"El dólar", cat:"ma", c:"var(--blue)", nivel:"Principiante", ic:'<path d="M12 2v20"/><path d="M16 6.5C16 4.6 14 4 12 4S8 4.6 8 7s2 3 4 3.5 4 1.3 4 3.5-2 3-4 3-4-.6-4-2.5"/>',
      frase:"La forma más común de ahorrar en moneda dura en Argentina.",
      corta:"Oficial, blue, MEP, CCL: qué es cada uno.",
      bloques:[
        {h:"¿Por qué importa?", p:"Para muchas personas en Argentina, comprar dólares es la manera de protegerse de la inflación y de la devaluación del peso."},
        {h:"Los distintos dólares", p:"Oficial (el del banco, con límites), MEP o bolsa (legal, comprando y vendiendo bonos), CCL o contado con liqui (para dejar los dólares afuera), blue (mercado informal) y el dólar tarjeta (consumos en el exterior)."},
        {h:"¿Cómo se accede legalmente?", p:"La forma habitual y legal de dolarizarse desde una cuenta de inversión es el dólar MEP, operando con bonos o a través de tu bróker."}
      ],
      claves:["Es un refugio contra la inflación","Hay varios: oficial, MEP, CCL, blue","El MEP es la vía legal más usada para dolarizarse"],
      rel:["Dólar MEP","Dólar blue","Inflación"],
      quiz:{q:"¿Cuál es una forma legal de comprar dólares para inversión?", opts:[{t:"El dólar MEP, operando con bonos",ok:true},{t:"El dólar blue",ok:false},{t:"Ninguna es legal",ok:false}], fb:"El dólar MEP es la vía legal habitual. El blue es del mercado informal."}
    },
    inflacion:{t:"Inflación e IPC", cat:"ma", c:"var(--neg)", nivel:"Principiante", ic:'<path d="M4 16 L10 10 L14 13 L20 5"/><path d="M15 5h5v5"/>',
      frase:"Cuánto suben los precios y cuánto pierde valor tu plata.",
      corta:"Por qué la plata pierde valor.",
      bloques:[
        {h:"¿Qué es la inflación?", p:"Es la suba general y sostenida de los precios. Con el tiempo, con la misma plata comprás menos cosas."},
        {h:"¿Qué es el IPC?", p:"El Índice de Precios al Consumidor es el número que publica el INDEC todos los meses y que mide cuánto subieron los precios en promedio."},
        {h:"¿Por qué te importa?", p:"Si tu plata o tu inversión rinde menos que la inflación, estás perdiendo poder de compra aunque tengas más pesos que antes. Ganarle a la inflación es el objetivo mínimo de cualquier ahorro."}
      ],
      claves:["Inflación = suba general de precios","El IPC (INDEC) la mide cada mes","Si no le ganás, perdés poder de compra"],
      rel:["IPC","UVA"],
      quiz:{q:"Si tu inversión rinde menos que la inflación...", opts:[{t:"Ganás poder de compra",ok:false},{t:"Perdés poder de compra aunque tengas más pesos",ok:true},{t:"No pasa nada",ok:false}], fb:"Aunque tengas más pesos, si rinden menos que la inflación comprás menos que antes."}
    },
    uva:{t:"UVA", cat:"ma", c:"#C026D3", nivel:"Intermedio", ic:'<path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10z"/><circle cx="12" cy="11" r="2.4"/>',
      frase:"Una unidad que se mueve con la inflación.",
      corta:"La unidad que ajusta por inflación.",
      bloques:[
        {h:"¿Qué es?", p:"La UVA (Unidad de Valor Adquisitivo) es una unidad cuyo valor se actualiza todos los días según la inflación."},
        {h:"¿Para qué se usa?", p:"Se usa en créditos hipotecarios UVA, plazos fijos UVA y algunos contratos. Sirve para que los montos no queden desactualizados cuando los precios suben."},
        {h:"Una idea para tener clara", p:"Como la UVA sigue a la inflación, lo que está expresado en UVA mantiene su poder de compra en el tiempo; pero ojo, las cuotas de un crédito UVA también suben con la inflación."}
      ],
      claves:["Se ajusta por inflación, todos los días","Se usa en créditos y plazos fijos UVA","Mantiene el poder de compra"],
      rel:["Inflación","Plazo fijo"],
      quiz:{q:"¿Según qué se ajusta la UVA?", opts:[{t:"Según la inflación",ok:true},{t:"Según el precio del dólar blue",ok:false},{t:"Según la bolsa de Nueva York",ok:false}], fb:"La UVA se actualiza según la inflación (índice CER)."}
    },
    pbi:{t:"PBI", cat:"ma", c:"#65A30D", nivel:"Intermedio", ic:'<path d="M4 20h16"/><rect x="6" y="12" width="3" height="6"/><rect x="11" y="8" width="3" height="10"/><rect x="16" y="4" width="3" height="14"/>',
      frase:"Cuánto produce un país.",
      corta:"Qué mide y por qué importa.",
      bloques:[
        {h:"¿Qué es?", p:"El PBI (Producto Bruto Interno) es el valor de todos los bienes y servicios que produce un país en un período, por ejemplo un año o un trimestre."},
        {h:"¿Por qué importa?", p:"Mide el tamaño de la economía y si está creciendo o cayendo. Si el PBI crece, en general el país produce más y suele haber más actividad y empleo."},
        {h:"Cómo se lo suele leer", p:"Se mira sobre todo su variación: cuánto creció o cayó respecto del período anterior o del mismo período del año pasado."}
      ],
      claves:["Es el valor de todo lo que produce un país","Mide el tamaño y el crecimiento de la economía","Se mira su variación (creció/cayó)"],
      rel:["Inflación"],
      quiz:{q:"¿Qué mide el PBI?", opts:[{t:"El valor de todo lo que produce un país",ok:true},{t:"La cantidad de dólares en el Banco Central",ok:false},{t:"El precio de las acciones",ok:false}], fb:"El PBI mide el valor de todo lo que produce un país en un período."}
    }
  };
export const ORDER: string[] =["acciones","cedears","cripto","plazofijo","bonos","fci","dolar","inflacion","uva","pbi"];
export const GROUPS: [string, string[]][] =[["rf",["plazofijo","bonos"]],["rv",["acciones","cedears","cripto"]],["fondos",["fci"]],["ma",["dolar","inflacion","uva","pbi"]]];
