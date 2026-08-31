/* FÓRMULAS SIMBÓLICAS (LaTeX) — para visualización pedagógica */
const FORMULAS = {
  vdw: {
    title: "Van der Waals (1873)",
    eos: "P = \\dfrac{RT}{V-b} - \\dfrac{a}{V^2}",
    params: [
      "a = \\dfrac{27}{64}\\,\\dfrac{R^2 T_c^2}{P_c}",
      "b = \\dfrac{R\\,T_c}{8\\,P_c}",
      "A = \\dfrac{aP}{R^2 T^2}",
      "B = \\dfrac{bP}{RT}"
    ],
    cubic: "Z^3 - (1+B)\\,Z^2 + A\\,Z - AB = 0",
    HR:    "H^R = RT(Z-1) - \\dfrac{a}{V}",
    SR:    "S^R = R\\,\\ln(Z-B)",
    GR:    "G^R = H^R - T\\,S^R",
    lnPhi: "\\ln\\phi = Z - 1 - \\ln(Z-B) - \\dfrac{A}{Z}",
    note:  "note.vdw",
    refs: [
      "van der Waals, J.D. Doctoral dissertation, Leiden (1873).",
      "Smith-Van Ness-Abbott, Introduction to Chemical Engineering Thermodynamics, 7th ed., Cap. 3 y 6 (2005)."
    ]
  },
  rk: {
    title: "Redlich-Kwong (1949)",
    eos: "P = \\dfrac{RT}{V-b} - \\dfrac{a(T)}{V(V+b)}",
    params: [
      "a(T) = \\dfrac{0.42748\\,R^2 T_c^{2.5}}{P_c\\,\\sqrt{T}}",
      "b = \\dfrac{0.08664\\,R\\,T_c}{P_c}",
      "A = \\dfrac{a(T)\\,P}{R^2 T^2}",
      "B = \\dfrac{bP}{RT}"
    ],
    cubic: "Z^3 - Z^2 + (A - B - B^2)\\,Z - AB = 0",
    HR:    "H^R = RT(Z-1) - \\dfrac{3\\,a(T)}{2\\,b}\\,\\ln\\dfrac{Z+B}{Z}",
    SR:    "S^R = R\\,\\ln(Z-B) - \\dfrac{a(T)}{2\\,b\\,T}\\,\\ln\\dfrac{Z+B}{Z}",
    GR:    "G^R = H^R - T\\,S^R",
    lnPhi: "\\ln\\phi = Z - 1 - \\ln(Z-B) - \\dfrac{A}{B}\\,\\ln\\dfrac{Z+B}{Z}",
    note:  "note.rk",
    refs: [
      "Redlich, O.; Kwong, J.N.S. Chem. Rev. 44, 233-244 (1949).",
      "Smith-Van Ness-Abbott, Cap. 3, Ec. 3.42."
    ]
  },
  srk: {
    title: "Soave-Redlich-Kwong (1972)",
    eos: "P = \\dfrac{RT}{V-b} - \\dfrac{a(T)}{V(V+b)}",
    params: [
      "a(T) = a_c\\,\\alpha(T,\\omega)",
      "a_c = \\dfrac{0.42748\\,R^2 T_c^2}{P_c}",
      "\\alpha(T,\\omega) = [1 + m(1-\\sqrt{T_r})]^2",
      "m = 0.480 + 1.574\\,\\omega - 0.176\\,\\omega^2",
      "b = \\dfrac{0.08664\\,R\\,T_c}{P_c}",
      "A = \\dfrac{a(T)\\,P}{R^2 T^2}",
      "B = \\dfrac{bP}{RT}"
    ],
    cubic: "Z^3 - Z^2 + (A - B - B^2)\\,Z - AB = 0",
    HR:    "H^R = RT(Z-1) + \\dfrac{T\\frac{da}{dT} - a}{b}\\,\\ln\\dfrac{Z+B}{Z}",
    SR:    "S^R = R\\,\\ln(Z-B) + \\dfrac{1}{b}\\dfrac{da}{dT}\\,\\ln\\dfrac{Z+B}{Z}",
    GR:    "G^R = H^R - T\\,S^R",
    lnPhi: "\\ln\\phi = Z - 1 - \\ln(Z-B) - \\dfrac{A}{B}\\,\\ln\\dfrac{Z+B}{Z}",
    note:  "note.srk",
    refs: [
      "Soave, G. Chem. Eng. Sci. 27, 1197-1203 (1972).",
      "Smith-Van Ness-Abbott, Cap. 6, Ec. 6.66."
    ]
  },
  pr: {
    title: "Peng-Robinson (1976)",
    eos: "P = \\dfrac{RT}{V-b} - \\dfrac{a(T)}{V(V+b) + b(V-b)}",
    params: [
      "a(T) = a_c\\,\\alpha(T,\\omega)",
      "a_c = \\dfrac{0.45724\\,R^2 T_c^2}{P_c}",
      "\\alpha(T,\\omega) = [1 + m(1-\\sqrt{T_r})]^2",
      "m = 0.37464 + 1.54226\\,\\omega - 0.26992\\,\\omega^2",
      "b = \\dfrac{0.07780\\,R\\,T_c}{P_c}",
      "A = \\dfrac{a(T)\\,P}{R^2 T^2}",
      "B = \\dfrac{bP}{RT}"
    ],
    cubic: "Z^3 - (1-B)Z^2 + (A - 3B^2 - 2B)Z - (AB - B^2 - B^3) = 0",
    HR:    "H^R = RT(Z-1) + \\dfrac{T\\frac{da}{dT} - a}{2\\sqrt{2}\\,b}\\,\\ln\\dfrac{Z+(1+\\sqrt{2})B}{Z+(1-\\sqrt{2})B}",
    SR:    "S^R = R\\,\\ln(Z-B) + \\dfrac{1}{2\\sqrt{2}\\,b}\\dfrac{da}{dT}\\,\\ln\\dfrac{Z+(1+\\sqrt{2})B}{Z+(1-\\sqrt{2})B}",
    GR:    "G^R = H^R - T\\,S^R",
    lnPhi: "\\ln\\phi = Z - 1 - \\ln(Z-B) - \\dfrac{A}{2\\sqrt{2}\\,B}\\,\\ln\\dfrac{Z+(1+\\sqrt{2})B}{Z+(1-\\sqrt{2})B}",
    note:  "note.pr",
    refs: [
      "Peng, D.Y.; Robinson, D.B. Ind. Eng. Chem. Fundam. 15, 59-64 (1976).",
      "Smith-Van Ness-Abbott, Cap. 6, Ec. 6.66 (forma generalizada)."
    ]
  },
  prsv: {
    title: "Peng-Robinson-Stryjek-Vera (1986)",
    eos: "P = \\dfrac{RT}{V-b} - \\dfrac{a(T)}{V(V+b) + b(V-b)}",
    params: [
      "m = \\kappa_0 + \\kappa_1(1+\\sqrt{T_r})(0.7 - T_r)",
      "\\kappa_0 = 0.378893 + 1.4897153\\,\\omega - 0.17131848\\,\\omega^2 + 0.0196554\\,\\omega^3",
      "\\kappa_1\\;\\text{específico por componente (default 0)}",
      "a_c = \\dfrac{0.45724\\,R^2 T_c^2}{P_c},\\;b = \\dfrac{0.07780\\,R\\,T_c}{P_c}",
      "A = \\dfrac{a(T)\\,P}{R^2 T^2},\\;B = \\dfrac{bP}{RT}"
    ],
    cubic: "Z^3 - (1-B)Z^2 + (A - 3B^2 - 2B)Z - (AB - B^2 - B^3) = 0",
    HR:    "H^R = RT(Z-1) + \\dfrac{T\\frac{da}{dT} - a}{2\\sqrt{2}\\,b}\\,\\ln\\dfrac{Z+(1+\\sqrt{2})B}{Z+(1-\\sqrt{2})B}",
    SR:    "S^R = R\\,\\ln(Z-B) + \\dfrac{1}{2\\sqrt{2}\\,b}\\dfrac{da}{dT}\\,\\ln\\dfrac{Z+(1+\\sqrt{2})B}{Z+(1-\\sqrt{2})B}",
    GR:    "G^R = H^R - T\\,S^R",
    lnPhi: "\\ln\\phi = Z - 1 - \\ln(Z-B) - \\dfrac{A}{2\\sqrt{2}\\,B}\\,\\ln\\dfrac{Z+(1+\\sqrt{2})B}{Z+(1-\\sqrt{2})B}",
    note:  "note.prsv",
    refs: [
      "Stryjek, R.; Vera, J.H. Can. J. Chem. Eng. 64, 323-333 (1986).",
      "Reid-Prausnitz-Poling, The Properties of Gases and Liquids, 5th ed., Cap. 4 (2001)."
    ]
  },
  pt: {
    title: "Patel-Teja (1982)",
    eos: "P = \\dfrac{RT}{V-b} - \\dfrac{a(T)}{V(V+b) + c(V-b)}",
    params: [
      "a(T) = a_c\\,\\alpha,\\;a_c = \\Omega_a\\dfrac{R^2 T_c^2}{P_c}",
      "b = \\Omega_b\\dfrac{R\\,T_c}{P_c},\\;c = \\Omega_c\\dfrac{R\\,T_c}{P_c}",
      "\\alpha = [1 + F(1-\\sqrt{T_r})]^2",
      "F = 0.452413 + 1.30982\\,\\omega - 0.295937\\,\\omega^2",
      "\\zeta_c = 0.329032 - 0.076799\\,\\omega + 0.0211947\\,\\omega^2",
      "\\Omega_c = 1 - 3\\zeta_c",
      "\\Omega_b\\;\\text{= raíz menor positiva de:}\\;\\Omega_b^3 + (2-3\\zeta_c)\\Omega_b^2 + 3\\zeta_c^2\\Omega_b - \\zeta_c^3 = 0",
      "\\Omega_a = 3\\zeta_c^2 + 3(1-2\\zeta_c)\\Omega_b + \\Omega_b^2 + (1-3\\zeta_c)",
      "A = \\dfrac{a(T)\\,P}{R^2 T^2},\\;B = \\dfrac{bP}{RT},\\;C = \\dfrac{cP}{RT}"
    ],
    cubic: "Z^3 - (1-C)Z^2 + (A - 2BC - B - B^2 - C)Z - (AB - BC - B^2 C) = 0",
    HR:    "H^R = RT(Z-1) + \\dfrac{T\\frac{da}{dT} - a}{d}\\,\\ln\\dfrac{V - V_\\beta}{V - V_\\alpha}",
    SR:    "S^R = R\\,\\ln(Z-B) + \\dfrac{1}{d}\\dfrac{da}{dT}\\,\\ln\\dfrac{V - V_\\beta}{V - V_\\alpha}",
    GR:    "G^R = H^R - T\\,S^R",
    lnPhi: "\\ln\\phi = Z - 1 - \\ln(Z-B) - \\dfrac{a}{RT\\,d}\\,\\ln\\dfrac{V - V_\\beta}{V - V_\\alpha}",
    note:  "d = \\sqrt{b^2 + 6bc + c^2},\\;V_\\alpha = \\tfrac{-(b+c)+d}{2},\\;V_\\beta = \\tfrac{-(b+c)-d}{2}.",
    refs: [
      "Patel, N.C.; Teja, A.S. Chem. Eng. Sci. 37, 463-473 (1982).",
      "Reid-Prausnitz-Poling, Cap. 4, Sec. 4.6."
    ]
  },
  ptv: {
    title: "Patel-Teja-Valderrama (1990)",
    eos: "P = \\dfrac{RT}{V-b} - \\dfrac{a(T)}{V(V+b) + c(V-b)}",
    params: [
      "\\zeta_c = 0.329032 - 0.076799\\,\\omega + 0.0211947\\,\\omega^2",
      "\\Omega_a = 0.66121 - 0.76105\\,\\zeta_c",
      "\\Omega_b = 0.02207 + 0.20868\\,\\zeta_c",
      "\\Omega_c = 0.57765 - 1.87080\\,\\zeta_c",
      "F = 0.46286 + 3.58230\\,(\\omega\\zeta_c) + 8.19417\\,(\\omega\\zeta_c)^2",
      "\\alpha = [1 + F(1-\\sqrt{T_r})]^2",
      "A = \\dfrac{a(T)\\,P}{R^2 T^2},\\;B = \\dfrac{bP}{RT},\\;C = \\dfrac{cP}{RT}"
    ],
    cubic: "Z^3 - (1-C)Z^2 + (A - 2BC - B - B^2 - C)Z - (AB - BC - B^2 C) = 0",
    HR:    "H^R = RT(Z-1) + \\dfrac{T\\frac{da}{dT} - a}{d}\\,\\ln\\dfrac{V - V_\\beta}{V - V_\\alpha}",
    SR:    "S^R = R\\,\\ln(Z-B) + \\dfrac{1}{d}\\dfrac{da}{dT}\\,\\ln\\dfrac{V - V_\\beta}{V - V_\\alpha}",
    GR:    "G^R = H^R - T\\,S^R",
    lnPhi: "\\ln\\phi = Z - 1 - \\ln(Z-B) - \\dfrac{a}{RT\\,d}\\,\\ln\\dfrac{V - V_\\beta}{V - V_\\alpha}",
    note:  "note.ptv",
    refs: [
      "Valderrama, J.O. J. Chem. Eng. Japan 23, 87-91 (1990).",
      "Valderrama, J.O.; Alfaro, M. Latin Am. Appl. Res. 30, 89-94 (2000)."
    ]
  },
  csvdw: {
    title: "Carnahan-Starling-vdW (no cúbica)",
    eos: "Z = \\dfrac{1 + \\eta + \\eta^2 - \\eta^3}{(1-\\eta)^3} - \\dfrac{a}{RT\\,V}",
    params: [
      "\\eta = \\dfrac{b}{4V}\\quad\\text{(fracción de empaquetamiento)}",
      "a = \\dfrac{27}{64}\\,\\dfrac{R^2 T_c^2}{P_c}\\quad\\text{(parámetros vdW)}",
      "b = \\dfrac{R\\,T_c}{8\\,P_c}",
      "A = \\dfrac{aP}{R^2 T^2},\\;B = \\dfrac{bP}{RT}"
    ],
    cubic: "\\text{No es cúbica — se resuelve por iteración numérica en V.}",
    HR:    "H^R = RT(Z-1) + RT\\left[\\dfrac{\\eta(4-3\\eta)}{(1-\\eta)^2} - \\dfrac{a}{RT\\,V}\\right]",
    SR:    "S^R = R\\,\\ln Z",
    GR:    "G^R = H^R - T\\,S^R",
    lnPhi: "\\ln\\phi = \\dfrac{\\eta(4-3\\eta)}{(1-\\eta)^2} - \\dfrac{a}{RT\\,V} + (Z-1) - \\ln Z",
    note:  "note.csvdw",
    refs: [
      "Carnahan, N.F.; Starling, K.E. J. Chem. Phys. 51, 635-636 (1969).",
      "Sandler, S.I. Chemical, Biochemical, and Engineering Thermodynamics, 4th ed., Cap. 6 (2006)."
    ]
  }
};

function getSubstitutedParams(eosKey, comp, T, P, eosResult){
  const r = eosResult;
  const fmtN = (x, dec) => {
    dec = dec || 4;
    if(x===null || x===undefined || isNaN(x)) return "—";
    if(Math.abs(x)>=1e4 || (Math.abs(x)<1e-3 && x!==0))
      return x.toExponential(dec);
    return x.toFixed(dec);
  };
  const Tr = T/comp.Tc;
  const out = [];
  out.push(["T_r", fmtN(Tr,4)]);
  out.push(["a", fmtN(r.a,4) + "\\;\\mathrm{Pa\\,m^6/mol^2}"]);
  out.push(["b", fmtN(r.b*1e6,4) + "\\;\\mathrm{cm^3/mol}"]);
  if(r.c !== undefined) out.push(["c", fmtN(r.c*1e6,4) + "\\;\\mathrm{cm^3/mol}"]);
  if(r.m !== undefined) out.push(["m", fmtN(r.m,5)]);
  if(r.F !== undefined) out.push(["F", fmtN(r.F,5)]);
  if(r.alpha !== undefined) out.push(["\\alpha", fmtN(r.alpha,5)]);
  if(r.zc !== undefined) out.push(["\\zeta_c", fmtN(r.zc,5)]);
  if(r.Wa !== undefined) out.push(["\\Omega_a", fmtN(r.Wa,5)]);
  if(r.Wb !== undefined) out.push(["\\Omega_b", fmtN(r.Wb,5)]);
  if(r.Wc !== undefined) out.push(["\\Omega_c", fmtN(r.Wc,5)]);
  out.push(["A", fmtN(r.A,5)]);
  out.push(["B", fmtN(r.B,5)]);
  if(r.C !== undefined) out.push(["C", fmtN(r.C,5)]);
  return out;
}
