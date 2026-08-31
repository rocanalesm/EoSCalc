/* EOS Calc — Internacionalización / Internationalization
   ES por defecto, EN a un clic. Fuente única de todos los textos de la
   interfaz: si se agrega un texto nuevo, va acá y no en el HTML.
   Para agregar otro idioma, basta con una clave más en cada entrada.
*/

var LANG = "es";

try {
  var guardado = localStorage.getItem("eoscalc-lang");
  if (guardado === "es" || guardado === "en") LANG = guardado;
} catch (e) { /* modo privado o storage bloqueado: se queda en es */ }

/* ------------------------------------------------------------------ */
/* Nombres de los compuestos. El buscador acepta cualquiera de los dos, */
/* en cualquier idioma, para que "agua" y "water" encuentren lo mismo.  */
/* ------------------------------------------------------------------ */
var NOMBRES_EN = {
  "Metano": "Methane",
  "Etano": "Ethane",
  "Propano": "Propane",
  "n-Butano": "n-Butane",
  "i-Butano": "i-Butane",
  "n-Pentano": "n-Pentane",
  "n-Hexano": "n-Hexane",
  "n-Heptano": "n-Heptane",
  "n-Octano": "n-Octane",
  "n-Nonano": "n-Nonane",
  "n-Decano": "n-Decane",
  "Etileno": "Ethylene",
  "Propileno": "Propylene",
  "1-Buteno": "1-Butene",
  "Benceno": "Benzene",
  "Tolueno": "Toluene",
  "o-Xileno": "o-Xylene",
  "Metanol": "Methanol",
  "Etanol": "Ethanol",
  "1-Propanol": "1-Propanol",
  "1-Butanol": "1-Butanol",
  "Agua": "Water",
  "Dióxido de carbono": "Carbon dioxide",
  "Monóxido de carbono": "Carbon monoxide",
  "Nitrógeno": "Nitrogen",
  "Oxígeno": "Oxygen",
  "Hidrógeno": "Hydrogen",
  "Helio": "Helium",
  "Argón": "Argon",
  "Amoniaco": "Ammonia",
  "Sulfuro de hidrógeno": "Hydrogen sulfide",
  "Dióxido de azufre": "Sulfur dioxide",
  "R-134a": "R-134a",
  "R-22": "R-22",
  "R-32": "R-32",
  "Acetona": "Acetone",
  "Cloroformo": "Chloroform",
  "Tetracloruro de carbono": "Carbon tetrachloride",
  "Acido acético": "Acetic acid",
  "Ciclohexano": "Cyclohexane"
};

/* Nombre a mostrar según el idioma activo */
function nombreComp(c) {
  if (LANG === "en" && NOMBRES_EN[c.name]) return NOMBRES_EN[c.name];
  return c.name;
}

/* Texto contra el que filtra el buscador: siempre los dos idiomas */
function textoBusqueda(c) {
  var en = NOMBRES_EN[c.name] || "";
  return (c.name + " " + en + " " + c.formula).toLowerCase();
}

/* ------------------------------------------------------------------ */
/* Diccionario                                                         */
/* ------------------------------------------------------------------ */
var I18N = {

  /* --- encabezado y estructura --- */
  "app.subtitle":        ["Ecuaciones de estado · propiedades residuales",
                          "Equations of state · residual properties"],
  "card.eos":            ["Ecuación de estado", "Equation of state"],
  "card.component":      ["Componente", "Component"],
  "card.conditions":     ["Condiciones", "Conditions"],
  "card.results":        ["Resultados", "Results"],
  "card.psat":           ["Presión de saturación (Segura-Wisniak)",
                          "Saturation pressure (Segura-Wisniak)"],

  /* --- controles --- */
  "eos.noncubic":        ["Carnahan-Starling-vdW (no cúbica)",
                          "Carnahan-Starling-vdW (non-cubic)"],
  "tab.db":              ["Base de datos", "Database"],
  "tab.manual":          ["Manual", "Manual"],
  "ph.search":           ["Buscar (ej: metano, agua, CO2)",
                          "Search (e.g. methane, water, CO2)"],
  "ph.substance":        ["Mi sustancia", "My substance"],
  "lbl.name":            ["Nombre (opcional)", "Name (optional)"],
  "lbl.omega":           ["&omega; (factor acéntrico)", "&omega; (acentric factor)"],
  "lbl.temperature":     ["Temperatura", "Temperature"],
  "lbl.pressure":        ["Presión", "Pressure"],
  "lbl.tsat":            ["Temperatura de saturación", "Saturation temperature"],
  "btn.calc":            ["Calcular", "Calculate"],
  "btn.calcsat":         ["Calcular P<sup>sat</sup>", "Calculate P<sup>sat</sup>"],
  "toggle.eos":          ["Ver ecuaciones y parámetros",
                          "Show equations and parameters"],
  "toggle.formulas":     ["Ver fórmulas usadas", "Show formulas used"],
  "toggle.values":       ["Ver parámetros con valores numéricos",
                          "Show parameters with numerical values"],
  "toggle.iterations":   ["Ver iteraciones y método", "Show iterations and method"],
  "psat.blurb":          ["Para una T dada (T &lt; Tc), encuentra P<sup>sat</sup> imponiendo &phi;<sup>V</sup> = &phi;<sup>L</sup>. No aplica a CS-vdW.",
                          "For a given T (T &lt; Tc), finds P<sup>sat</sup> by imposing &phi;<sup>V</sup> = &phi;<sup>L</sup>. Not applicable to CS-vdW."],

  /* --- paneles de ecuaciones --- */
  "panel.eos":           ["Ecuación de estado", "Equation of state"],
  "panel.params":        ["Parámetros y grupos adimensionales",
                          "Parameters and dimensionless groups"],
  "panel.solution":      ["Resolución", "Solution"],
  "panel.cubicZ":        ["Cúbica en Z", "Cubic in Z"],
  "panel.HR":            ["Entalpía residual", "Residual enthalpy"],
  "panel.SR":            ["Entropía residual", "Residual entropy"],
  "panel.GR":            ["Energía de Gibbs residual", "Residual Gibbs energy"],
  "panel.lnphi":         ["Coeficiente de fugacidad", "Fugacity coefficient"],
  "panel.refs":          ["Referencias", "References"],
  "panel.calcfirst":     ["Calcula primero para ver los parámetros con valores numéricos.",
                          "Calculate first to see the parameters with numerical values."],
  "panel.evaluatedAt":   ["Parámetros evaluados a T = ", "Parameters evaluated at T = "],
  "panel.valuesNote":    ["Estos son los valores numéricos calculados con las correlaciones del componente.",
                          "These are the numerical values obtained from the component correlations."],
  "panel.objective":     ["Función objetivo", "Objective function"],
  "panel.initFL0":       ["Inicialización: f<sup>L,0</sup> (Ec. 32 SW)",
                          "Initialization: f<sup>L,0</sup> (Eq. 32 SW)"],
  "panel.initSpin":      ["Inicialización: promedio espinodal (Ec. 27 SW)",
                          "Initialization: spinodal average (Eq. 27 SW)"],
  "panel.trace":         ["Trayectoria de iteración", "Iteration path"],
  "panel.satfirst":      ["Primero calcula P<sup>sat</sup>.",
                          "Calculate P<sup>sat</sup> first."],

  /* --- fases y estabilidad --- */
  "phase.liquid":        ["líquido", "liquid"],
  "phase.vapor":         ["vapor", "vapor"],
  "phase.supercritical": ["supercrítico", "supercritical"],
  "phase.middle":        ["raíz central", "middle root"],
  "phase.root":          ["raíz ", "root "],
  "phase.stableIs":      ["Fase estable: ", "Stable phase: "],
  "phase.equilibrium":   ["Equilibrio L-V (P ≈ P<sup>sat</sup>)",
                          "L-V equilibrium (P ≈ P<sup>sat</sup>)"],
  "stab.title":          ["Comparación de raíces — la fase estable es la de menor &phi; (menor ln&phi;)",
                          "Root comparison — the stable phase is the one with the lower &phi; (lower ln&phi;)"],
  "stab.nonphysical":    [" (no física)", " (non-physical)"],
  "stab.mark":           ["estable", "stable"],
  "stab.coexist":        ["&phi;<sup>L</sup> &asymp; &phi;<sup>V</sup> &rArr; <strong>equilibrio L-V</strong> (P &asymp; P<sup>sat</sup>). Ambas fases coexisten.",
                          "&phi;<sup>L</sup> &asymp; &phi;<sup>V</sup> &rArr; <strong>L-V equilibrium</strong> (P &asymp; P<sup>sat</sup>). Both phases coexist."],
  "stab.concl1":         [" &rArr; <strong>fase estable: ", " &rArr; <strong>stable phase: "],
  "stab.concl2":         ["</strong> (menor energía de Gibbs).",
                          "</strong> (lower Gibbs energy)."],

  /* --- tablas --- */
  "tbl.component":       ["Componente", "Component"],
  "tbl.regime":          ["Régimen", "Regime"],
  "tbl.iterations":      ["Iteraciones", "Iterations"],
  "tbl.method":          ["Método", "Method"],
  "tbl.lowTr":           ["Baja Tr (ξ ≥ ξ_min)", "Low Tr (ξ ≥ ξ_min)"],
  "tbl.highTr":          ["Alta Tr (ξ < ξ_min)", "High Tr (ξ < ξ_min)"],
  "info.allroots":       ["\nRaíces de Z (todas): ", "\nZ roots (all): "],
  "info.morestable":     [" más estable", " more stable"],
  "info.saturation":     ["\nφ_l ≈ φ_v → Saturación.", "\nφ_l ≈ φ_v → Saturation."],

  /* --- mensajes de error --- */
  "err.pickComponent":   ["Selecciona un componente.", "Select a component."],
  "err.tcpc":            ["Tc y Pc deben ser > 0.", "Tc and Pc must be > 0."],
  "err.omega":           ["ω requerido.", "ω required."],
  "err.Tpos":            ["T debe ser > 0.", "T must be > 0."],
  "err.Ppos":            ["P debe ser > 0.", "P must be > 0."],
  "err.noroots":         ["No hay raíces físicas (Z > B).", "No physical roots (Z > B)."],
  "err.disc":            ["Discriminante negativo en u^L,0.",
                          "Negative discriminant in u^L,0."],
  "err.u1":              ["u <= 1; raíz líquida no física.",
                          "u <= 1; non-physical liquid root."],
  "err.tau0":            ["tau0 <= 0; caso no implementado.",
                          "tau0 <= 0; case not implemented."],
  "err.log":             ["Argumento del log negativo en lambda0.",
                          "Negative log argument in lambda0."],
  "err.spinodal":        ["No se encontraron 2 puntos espinodales (T cerca o sobre Tc?).",
                          "Could not find 2 spinodal points (T near or above Tc?)."],
  "err.P0":              ["Presión inicial no positiva.", "Initial pressure is not positive."],
  "err.nrfail":          ["NR no convergió.", "NR did not converge."],
  "err.csvdw":           ["Segura-Wisniak solo aplica a EOS cúbicas. CS-vdW no soportado.",
                          "Segura-Wisniak applies to cubic EOS only. CS-vdW not supported."],
  "err.aboveTc":         ["T >= Tc. No hay equilibrio L-V.",
                          "T >= Tc. There is no L-V equilibrium."],
  "err.dbsq":            ["d^2/b^2 > 2 — no aplicable.", "d^2/b^2 > 2 — not applicable."],

  /* --- métodos de Psat --- */
  "met.nrFL0":           ["NR desde f^{L,0} (Ecs. 22 + 32 SW)",
                          "NR from f^{L,0} (Eqs. 22 + 32 SW)"],
  "met.asymptote":       ["Asíntota f^{L,0} (NR no convergió)",
                          "f^{L,0} asymptote (NR did not converge)"],
  "met.nrSpin":          ["NR + inicialización espinodal (Ecs. 22, 27 SW)",
                          "NR + spinodal initialization (Eqs. 22, 27 SW)"],

  /* --- notas de las ecuaciones de estado (van en LaTeX) --- */
  "note.vdw":            ["Como\\;a\\;no\\;depende\\;de\\;T,\\;da/dT = 0.",
                          "Since\\;a\\;does\\;not\\;depend\\;on\\;T,\\;da/dT = 0."],
  "note.rk":             ["Para\\;RK:\\;T\\,da/dT = -a(T)/2.",
                          "For\\;RK:\\;T\\,da/dT = -a(T)/2."],
  "note.srk":            ["Donde\\;\\dfrac{da}{dT} = -\\dfrac{a_c\\,m\\,\\sqrt{\\alpha}}{\\sqrt{T\\,T_c}}.",
                          "Where\\;\\dfrac{da}{dT} = -\\dfrac{a_c\\,m\\,\\sqrt{\\alpha}}{\\sqrt{T\\,T_c}}."],
  "note.pr":             ["PR\\;es\\;la\\;EOS\\;c\\acute{u}bica\\;m\\acute{a}s\\;usada\\;en\\;hidrocarburos.",
                          "PR\\;is\\;the\\;most\\;widely\\;used\\;cubic\\;EOS\\;for\\;hydrocarbons."],
  "note.prsv":           ["PRSV\\;mejora\\;PR\\;cerca\\;del\\;cr\\acute{i}tico\\;y\\;sustancias\\;polares.",
                          "PRSV\\;improves\\;PR\\;near\\;the\\;critical\\;point\\;and\\;for\\;polar\\;fluids."],
  "note.pt":             ["d = \\sqrt{b^2 + 6bc + c^2},\\;V_\\alpha = \\tfrac{-(b+c)+d}{2},\\;V_\\beta = \\tfrac{-(b+c)-d}{2}.",
                          "d = \\sqrt{b^2 + 6bc + c^2},\\;V_\\alpha = \\tfrac{-(b+c)+d}{2},\\;V_\\beta = \\tfrac{-(b+c)-d}{2}."],
  "note.ptv":            ["Valderrama\\;(1990)\\;generaliza\\;PT\\;con\\;correlaciones\\;expl\\acute{i}citas.",
                          "Valderrama\\;(1990)\\;generalizes\\;PT\\;with\\;explicit\\;correlations."],
  "note.csvdw":          ["Combina\\;CS\\;repulsivo\\;con\\;atracci\\acute{o}n\\;vdW.\\;Educacional.",
                          "Combines\\;the\\;CS\\;repulsive\\;term\\;with\\;vdW\\;attraction.\\;Educational."],

  /* --- referencia de las notas de clase --- */
  "ref.classnotes":      ["Notas Clase 9 — Termodinámica Avanzada (PUC, 2026-1).",
                          "Course notes, Chemical Engineering Thermodynamics (PUC, 2026)."]
};

/* Acceso a un texto. Si falta la clave, devuelve la clave, que hace
   evidente el olvido en vez de dejar un hueco en blanco. */
function t(clave) {
  var e = I18N[clave];
  if (!e) return clave;
  return LANG === "en" ? e[1] : e[0];
}

/* ------------------------------------------------------------------ */
/* Aplicar los textos estáticos del HTML                               */
/*   data-i18n       -> innerHTML                                      */
/*   data-i18n-ph    -> atributo placeholder                           */
/* ------------------------------------------------------------------ */
function aplicarTextos() {
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.innerHTML = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
    el.placeholder = t(el.getAttribute("data-i18n-ph"));
  });
  document.documentElement.lang = LANG;
}

/* Cambia el idioma y redibuja todo lo que ya estaba en pantalla */
function setLang(nuevo) {
  if (nuevo !== "es" && nuevo !== "en") return;
  LANG = nuevo;
  try { localStorage.setItem("eoscalc-lang", LANG); } catch (e) { /* ignorar */ }

  aplicarTextos();

  var btn = document.getElementById("lang-toggle");
  if (btn) {
    btn.textContent = LANG === "es" ? "EN" : "ES";
    btn.title = LANG === "es" ? "Switch to English" : "Cambiar a español";
    btn.setAttribute("aria-label", btn.title);
  }

  /* Redibujar lo dinámico. Las funciones viven en eos-ui.js, que se
     carga después, así que se comprueba antes de llamarlas. */
  if (typeof populateComponents === "function") {
    var buscador = document.getElementById("search");
    populateComponents(buscador ? buscador.value : "");
  }
  if (typeof updateEosEq === "function") updateEosEq();

  var res = document.getElementById("results");
  if (res && res.classList.contains("show") && typeof calculate === "function") {
    calculate();
  }
  var sat = document.getElementById("results-sat");
  if (sat && sat.classList.contains("show") && typeof calculateSat === "function") {
    calculateSat();
  }
  var panelSat = document.getElementById("eq-panel-sat");
  if (panelSat && panelSat.classList.contains("open") && typeof renderSatPanel === "function") {
    renderSatPanel();
  }
}
