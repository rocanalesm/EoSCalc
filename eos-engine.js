/* ============================================================
   EoSCalc — Motor numérico
   Constantes, solucionador de cúbica, base de datos, EOS
   ============================================================ */
const R = 8.314472;        // J/(mol·K) — equivalentemente Pa·m³/(mol·K)

function fmt(x, dec=4){
  if(x===null||x===undefined||isNaN(x)) return "—";
  if(Math.abs(x)>=1e5 || (Math.abs(x)<1e-3 && x!==0))
    return x.toExponential(dec);
  return x.toFixed(dec);
}

function toK(T,unit){ return unit==='C' ? T+273.15 : T; }
function toPa(P,unit){
  switch(unit){
    case 'bar': return P*1e5;
    case 'atm': return P*101325;
    case 'kPa': return P*1000;
    case 'MPa': return P*1e6;
    case 'psi': return P*6894.757;
  }
  return P;
}

/* ------------------------------------------------------------
   Solucionador de cúbica (Cardano)
   Resuelve  z³ + a·z² + b·z + c = 0
   Devuelve raíces reales en orden ascendente.
   ------------------------------------------------------------ */
function solveCubic(a, b, c){
  const a2 = a*a;
  const p = b - a2/3;
  const q = (2*a2*a)/27 - (a*b)/3 + c;
  const disc = (q*q)/4 + (p*p*p)/27;
  const shift = -a/3;
  const roots = [];

  if(disc > 1e-14){
    const sq = Math.sqrt(disc);
    const u = Math.cbrt(-q/2 + sq);
    const v = Math.cbrt(-q/2 - sq);
    roots.push(u + v + shift);
  } else if(disc < -1e-14){
    const r = Math.sqrt(-(p*p*p)/27);
    const phi = Math.acos(-q/(2*r));
    const m = 2*Math.cbrt(r);
    roots.push(m*Math.cos(phi/3) + shift);
    roots.push(m*Math.cos((phi+2*Math.PI)/3) + shift);
    roots.push(m*Math.cos((phi+4*Math.PI)/3) + shift);
  } else {
    const u = Math.cbrt(-q/2);
    roots.push(2*u + shift);
    roots.push(-u + shift);
  }
  return roots.sort((x,y)=>x-y);
}

/* ------------------------------------------------------------
   Base de datos de componentes
   Tc [K], Pc [bar], omega [-]
   ------------------------------------------------------------ */
const COMPONENTS = [
  {name:"Metano",         formula:"CH4",   Tc:190.56, Pc:45.99, omega:0.0115},
  {name:"Etano",          formula:"C2H6",  Tc:305.32, Pc:48.72, omega:0.0995},
  {name:"Propano",        formula:"C3H8",  Tc:369.83, Pc:42.48, omega:0.1523},
  {name:"n-Butano",       formula:"C4H10", Tc:425.12, Pc:37.96, omega:0.2002},
  {name:"i-Butano",       formula:"C4H10", Tc:407.85, Pc:36.40, omega:0.1835},
  {name:"n-Pentano",      formula:"C5H12", Tc:469.70, Pc:33.70, omega:0.2515},
  {name:"n-Hexano",       formula:"C6H14", Tc:507.60, Pc:30.25, omega:0.3013},
  {name:"n-Heptano",      formula:"C7H16", Tc:540.20, Pc:27.40, omega:0.3495},
  {name:"n-Octano",       formula:"C8H18", Tc:568.70, Pc:24.90, omega:0.3996},
  {name:"n-Nonano",       formula:"C9H20", Tc:594.60, Pc:22.90, omega:0.4435},
  {name:"n-Decano",       formula:"C10H22",Tc:617.70, Pc:21.10, omega:0.4923},
  {name:"Etileno",        formula:"C2H4",  Tc:282.34, Pc:50.41, omega:0.0866},
  {name:"Propileno",      formula:"C3H6",  Tc:364.90, Pc:46.00, omega:0.1408},
  {name:"1-Buteno",       formula:"C4H8",  Tc:419.50, Pc:40.20, omega:0.1867},
  {name:"Benceno",        formula:"C6H6",  Tc:562.05, Pc:48.95, omega:0.2103},
  {name:"Tolueno",        formula:"C7H8",  Tc:591.75, Pc:41.08, omega:0.2640},
  {name:"o-Xileno",       formula:"C8H10", Tc:630.30, Pc:37.30, omega:0.3120},
  {name:"Metanol",        formula:"CH3OH", Tc:512.64, Pc:80.97, omega:0.5640},
  {name:"Etanol",         formula:"C2H5OH",Tc:513.92, Pc:61.48, omega:0.6450},
  {name:"1-Propanol",     formula:"C3H7OH",Tc:536.78, Pc:51.75, omega:0.6240},
  {name:"1-Butanol",      formula:"C4H9OH",Tc:563.00, Pc:44.14, omega:0.5900},
  {name:"Agua",           formula:"H2O",   Tc:647.14, Pc:220.64,omega:0.3440},
  {name:"Dióxido de carbono",formula:"CO2",Tc:304.13, Pc:73.75, omega:0.2236},
  {name:"Monóxido de carbono",formula:"CO",Tc:132.85, Pc:34.94, omega:0.0480},
  {name:"Nitrógeno",      formula:"N2",    Tc:126.20, Pc:33.98, omega:0.0377},
  {name:"Oxígeno",        formula:"O2",    Tc:154.58, Pc:50.43, omega:0.0222},
  {name:"Hidrógeno",      formula:"H2",    Tc:33.18,  Pc:13.13, omega:-0.2160},
  {name:"Helio",          formula:"He",    Tc:5.19,   Pc:2.27,  omega:-0.3900},
  {name:"Argón",          formula:"Ar",    Tc:150.86, Pc:48.98, omega:0.0000},
  {name:"Amoniaco",       formula:"NH3",   Tc:405.65, Pc:113.53,omega:0.2526},
  {name:"Sulfuro de hidrógeno",formula:"H2S",Tc:373.40,Pc:89.63,omega:0.0942},
  {name:"Dióxido de azufre",formula:"SO2", Tc:430.80, Pc:78.84, omega:0.2451},
  {name:"R-134a",         formula:"C2H2F4",Tc:374.21, Pc:40.59, omega:0.3268},
  {name:"R-22",           formula:"CHClF2",Tc:369.30, Pc:49.90, omega:0.2210},
  {name:"R-32",           formula:"CH2F2", Tc:351.26, Pc:57.82, omega:0.2769},
  {name:"Acetona",        formula:"C3H6O", Tc:508.20, Pc:47.01, omega:0.3071},
  {name:"Cloroformo",     formula:"CHCl3", Tc:536.40, Pc:53.70, omega:0.2222},
  {name:"Tetracloruro de carbono",formula:"CCl4",Tc:556.40,Pc:45.60,omega:0.1926},
  {name:"Acido acético",  formula:"C2H4O2",Tc:592.71, Pc:57.86, omega:0.4665},
  {name:"Ciclohexano",    formula:"C6H12", Tc:553.50, Pc:40.73, omega:0.2118}
];

/* ------------------------------------------------------------
   Ecuaciones de estado
   Cada EOS: calc(T,P,comp) -> { Z:[...], a, b, A, B, [c, C],
                                  residuals(Z) -> {HR, SR, GR, phi, lnPhi} }
   ------------------------------------------------------------ */

const EOS_VDW = {
  name:"Van der Waals",
  eq:"P = RT/(V-b) - a/V^2",
  calc(T,P,comp){
    const Tc=comp.Tc, Pc=comp.Pc*1e5;
    const a = 27/64 * R*R*Tc*Tc / Pc;
    const b = R*Tc/(8*Pc);
    const A = a*P/(R*R*T*T);
    const B = b*P/(R*T);
    const roots = solveCubic(-(1+B), A, -A*B).filter(z=>z>B);
    return {
      a, b, A, B,
      Z: roots,
      residuals(Z){
        const HR = (Z - 1 - A/Z) * R*T;
        const SR = Math.log(Z - B) * R;
        const GR = HR - T*SR;
        const lnPhi = Z - 1 - Math.log(Z - B) - A/Z;
        return {HR, SR, GR, phi:Math.exp(lnPhi), lnPhi};
      }
    };
  }
};

const EOS_RK = {
  name:"Redlich-Kwong",
  eq:"P = RT/(V-b) - a/[sqrt(T)*V(V+b)]",
  calc(T,P,comp){
    const Tc=comp.Tc, Pc=comp.Pc*1e5;
    const aT = 0.42748 * R*R * Math.pow(Tc,2.5) / (Pc * Math.sqrt(T));
    const b = 0.08664 * R*Tc/Pc;
    const A = aT*P/(R*R*T*T);
    const B = b*P/(R*T);
    const roots = solveCubic(-1, A - B - B*B, -A*B).filter(z=>z>B);
    return {
      a:aT, b, A, B,
      Z: roots,
      residuals(Z){
        const ln1 = Math.log((Z + B)/Z);
        const HR = R*T * (Z - 1 - (3/2)*(A/B)*ln1);
        const SR = R * (Math.log(Z - B) - (A/(2*B))*ln1);
        const GR = HR - T*SR;
        const lnPhi = Z - 1 - Math.log(Z - B) - (A/B)*ln1;
        return {HR, SR, GR, phi:Math.exp(lnPhi), lnPhi};
      }
    };
  }
};

const EOS_SRK = {
  name:"Soave-Redlich-Kwong",
  eq:"P = RT/(V-b) - a(T)/[V(V+b)]",
  calc(T,P,comp){
    const Tc=comp.Tc, Pc=comp.Pc*1e5, w=comp.omega;
    const ac = 0.42748 * R*R*Tc*Tc / Pc;
    const m  = 0.480 + 1.574*w - 0.176*w*w;
    const Tr = T/Tc;
    const sqAlpha = 1 + m*(1 - Math.sqrt(Tr));
    const alpha   = sqAlpha*sqAlpha;
    const aT = ac*alpha;
    const b  = 0.08664*R*Tc/Pc;
    const dadT = -ac * m * sqAlpha / Math.sqrt(T*Tc);
    const A = aT*P/(R*R*T*T);
    const B = b*P/(R*T);
    const roots = solveCubic(-1, A - B - B*B, -A*B).filter(z=>z>B);
    return {
      a:aT, b, A, B, m, alpha,
      Z: roots,
      residuals(Z){
        const ln1 = Math.log((Z + B)/Z);
        const HR = R*T*(Z - 1) + (T*dadT - aT)/b * ln1;
        const SR = R*Math.log(Z - B) + dadT/b * ln1;
        const GR = HR - T*SR;
        const lnPhi = Z - 1 - Math.log(Z - B) - (A/B)*ln1;
        return {HR, SR, GR, phi:Math.exp(lnPhi), lnPhi};
      }
    };
  }
};

const EOS_PR = {
  name:"Peng-Robinson",
  eq:"P = RT/(V-b) - a(T)/[V(V+b)+b(V-b)]",
  calc(T,P,comp){
    const Tc=comp.Tc, Pc=comp.Pc*1e5, w=comp.omega;
    const ac = 0.45724 * R*R*Tc*Tc / Pc;
    const m  = 0.37464 + 1.54226*w - 0.26992*w*w;
    const Tr = T/Tc;
    const sqAlpha = 1 + m*(1 - Math.sqrt(Tr));
    const alpha   = sqAlpha*sqAlpha;
    const aT = ac*alpha;
    const b  = 0.07780*R*Tc/Pc;
    const dadT = -ac * m * sqAlpha / Math.sqrt(T*Tc);
    const A = aT*P/(R*R*T*T);
    const B = b*P/(R*T);
    const roots = solveCubic(-(1-B), A - 3*B*B - 2*B,
                             -(A*B - B*B - B*B*B)).filter(z=>z>B);
    const sq2 = Math.SQRT2;
    return {
      a:aT, b, A, B, m, alpha,
      Z: roots,
      residuals(Z){
        const ln1 = Math.log((Z + (1+sq2)*B)/(Z + (1-sq2)*B));
        const fac = 1/(2*sq2*b);
        const HR = R*T*(Z - 1) + (T*dadT - aT)*fac*ln1;
        const SR = R*Math.log(Z - B) + dadT*fac*ln1;
        const GR = HR - T*SR;
        const lnPhi = Z - 1 - Math.log(Z - B)
                      - (A/(2*sq2*B))*ln1;
        return {HR, SR, GR, phi:Math.exp(lnPhi), lnPhi};
      }
    };
  }
};

const EOS_PRSV = {
  name:"Peng-Robinson-Stryjek-Vera",
  eq:"PR con kappa = k0 + k1*(1+sqrt(Tr))*(0.7-Tr)",
  calc(T,P,comp){
    const Tc=comp.Tc, Pc=comp.Pc*1e5, w=comp.omega;
    const k1 = comp.k1 || 0;
    const ac = 0.45724 * R*R*Tc*Tc / Pc;
    const k0 = 0.378893 + 1.4897153*w - 0.17131848*w*w + 0.0196554*w*w*w;
    const Tr = T/Tc;
    const sqTr = Math.sqrt(Tr);
    const m = k0 + k1*(1 + sqTr)*(0.7 - Tr);
    const sqAlpha = 1 + m*(1 - sqTr);
    const alpha   = sqAlpha*sqAlpha;
    const aT = ac*alpha;
    const b  = 0.07780*R*Tc/Pc;
    const dmdT = k1*((0.7 - Tr)/(2*sqTr*Tc) - (1 + sqTr)/Tc);
    const dsqAlphadT = dmdT*(1 - sqTr) + m*(-1/(2*sqTr*Tc));
    const dadT = ac * 2 * sqAlpha * dsqAlphadT;
    const A = aT*P/(R*R*T*T);
    const B = b*P/(R*T);
    const roots = solveCubic(-(1-B), A - 3*B*B - 2*B,
                             -(A*B - B*B - B*B*B)).filter(z=>z>B);
    const sq2 = Math.SQRT2;
    return {
      a:aT, b, A, B, m, alpha,
      Z: roots,
      residuals(Z){
        const ln1 = Math.log((Z + (1+sq2)*B)/(Z + (1-sq2)*B));
        const fac = 1/(2*sq2*b);
        const HR = R*T*(Z - 1) + (T*dadT - aT)*fac*ln1;
        const SR = R*Math.log(Z - B) + dadT*fac*ln1;
        const GR = HR - T*SR;
        const lnPhi = Z - 1 - Math.log(Z - B) - (A/(2*sq2*B))*ln1;
        return {HR, SR, GR, phi:Math.exp(lnPhi), lnPhi};
      }
    };
  }
};

const EOS_PT = {
  name:"Patel-Teja",
  eq:"P = RT/(V-b) - a(T)/[V(V+b)+c(V-b)]",
  calc(T,P,comp){
    const Tc=comp.Tc, Pc=comp.Pc*1e5, w=comp.omega;
    const F  = comp.F  || (0.452413 + 1.30982*w - 0.295937*w*w);
    const zc = comp.zc || (0.329032 - 0.076799*w + 0.0211947*w*w);
    const Wb_roots = solveCubic(2 - 3*zc, 3*zc*zc, -zc*zc*zc)
                     .filter(x=>x>0 && x<1);
    const Wb = Wb_roots.length ? Wb_roots[0] : 0.077796;
    const Wc = 1 - 3*zc;
    const Wa = 3*zc*zc + 3*(1 - 2*zc)*Wb + Wb*Wb + 1 - 3*zc;
    const Tr = T/Tc;
    const sqAlpha = 1 + F*(1 - Math.sqrt(Tr));
    const alpha   = sqAlpha*sqAlpha;
    const ac = Wa * R*R*Tc*Tc/Pc;
    const aT = ac*alpha;
    const b  = Wb * R*Tc/Pc;
    const c  = Wc * R*Tc/Pc;
    const dadT = -ac*F*sqAlpha/Math.sqrt(T*Tc);
    const A = aT*P/(R*R*T*T);
    const B = b*P/(R*T);
    const C = c*P/(R*T);
    const a2 = -(1 - C);
    const a1 = A - 2*B*C - B - B*B - C;
    const a0 = -(A*B - B*C - B*B*C);
    const roots = solveCubic(a2, a1, a0).filter(z=>z>B);
    return {
      a:aT, b, c, A, B, C, F, zc, Wa, Wb, Wc,
      Z: roots,
      residuals(Z){
        const d = Math.sqrt(b*b + 6*b*c + c*c);
        const Vm = Z*R*T/P;
        const V_a = (-(b+c) + d)/2;
        const V_b = (-(b+c) - d)/2;
        const lnV = Math.log((Vm - V_b)/(Vm - V_a));
        const HR = R*T*(Z - 1) + (T*dadT - aT)/d * lnV;
        const SR = R*Math.log(Z - B) + dadT/d * lnV;
        const GR = HR - T*SR;
        const lnPhi = Z - 1 - Math.log(Z - B) - aT/(R*T*d) * lnV;
        return {HR, SR, GR, phi:Math.exp(lnPhi), lnPhi};
      }
    };
  }
};

const EOS_PTV = {
  name:"Patel-Teja-Valderrama",
  eq:"PT con correlaciones de Valderrama (1990)",
  calc(T,P,comp){
    const Tc=comp.Tc, Pc=comp.Pc*1e5, w=comp.omega;
    const zc = comp.zc || (0.329032 - 0.076799*w + 0.0211947*w*w);
    const Wa = 0.66121 - 0.76105*zc;
    const Wb = 0.02207 + 0.20868*zc;
    const Wc = 0.57765 - 1.87080*zc;
    const F  = comp.F || (0.46286 + 3.58230*(w*zc) + 8.19417*(w*zc)*(w*zc));
    const Tr = T/Tc;
    const sqAlpha = 1 + F*(1 - Math.sqrt(Tr));
    const alpha   = sqAlpha*sqAlpha;
    const ac = Wa * R*R*Tc*Tc/Pc;
    const aT = ac*alpha;
    const b  = Wb * R*Tc/Pc;
    const c  = Wc * R*Tc/Pc;
    const dadT = -ac*F*sqAlpha/Math.sqrt(T*Tc);
    const A = aT*P/(R*R*T*T);
    const B = b*P/(R*T);
    const C = c*P/(R*T);
    const a2 = -(1 - C);
    const a1 = A - 2*B*C - B - B*B - C;
    const a0 = -(A*B - B*C - B*B*C);
    const roots = solveCubic(a2, a1, a0).filter(z=>z>B);
    return {
      a:aT, b, c, A, B, C, F, zc, Wa, Wb, Wc,
      Z: roots,
      residuals(Z){
        const d = Math.sqrt(b*b + 6*b*c + c*c);
        const Vm = Z*R*T/P;
        const V_a = (-(b+c) + d)/2;
        const V_b = (-(b+c) - d)/2;
        const lnV = Math.log((Vm - V_b)/(Vm - V_a));
        const HR = R*T*(Z - 1) + (T*dadT - aT)/d * lnV;
        const SR = R*Math.log(Z - B) + dadT/d * lnV;
        const GR = HR - T*SR;
        const lnPhi = Z - 1 - Math.log(Z - B) - aT/(R*T*d) * lnV;
        return {HR, SR, GR, phi:Math.exp(lnPhi), lnPhi};
      }
    };
  }
};

const EOS_CSVDW = {
  name:"Carnahan-Starling-vdW",
  eq:"Z = (1+eta+eta^2-eta^3)/(1-eta)^3 - a/(RT*V); eta = b/(4V)",
  calc(T,P,comp){
    const Tc=comp.Tc, Pc=comp.Pc*1e5;
    const a = 27/64 * R*R*Tc*Tc / Pc;
    const b = R*Tc/(8*Pc);
    const Zcs = (eta) => (1 + eta + eta*eta - eta*eta*eta)/Math.pow(1-eta,3);
    const Pcalc = (V) => {
      const eta = b/(4*V);
      return R*T/V * Zcs(eta) - a/(V*V);
    };
    const V_ig = R*T/P;
    const V_min = b/4 * 1.01;
    const roots = [];
    let nPts = 400;
    let logV0 = Math.log(V_min), logV1 = Math.log(V_ig*100);
    let prevV = Math.exp(logV0), prevF = Pcalc(prevV) - P;
    for(let i=1;i<=nPts;i++){
      const V = Math.exp(logV0 + (logV1-logV0)*i/nPts);
      const F = Pcalc(V) - P;
      if(prevF*F < 0){
        let lo=prevV, hi=V, flo=prevF, fhi=F;
        for(let k=0;k<60;k++){
          const mid=(lo+hi)/2, fm=Pcalc(mid)-P;
          if(flo*fm<0){hi=mid;fhi=fm;} else {lo=mid;flo=fm;}
        }
        roots.push((lo+hi)/2);
      }
      prevV=V; prevF=F;
    }
    const Z_arr = roots.map(V => P*V/(R*T)).sort((x,y)=>x-y);
    return {
      a, b, A:a*P/(R*R*T*T), B:b*P/(R*T),
      Z: Z_arr,
      residuals(Z){
        const V = Z*R*T/P;
        const eta = b/(4*V);
        const A_repRT = eta*(4 - 3*eta)/Math.pow(1-eta,2);
        const A_attRT = -a/(R*T*V);
        const AR_TV = A_repRT + A_attRT;
        const SR = R*Math.log(Z);
        const HR = R*T*(Z - 1 + AR_TV);
        const GR = HR - T*SR;
        const lnPhi = AR_TV + (Z - 1) - Math.log(Z);
        return {HR, SR, GR, phi:Math.exp(lnPhi), lnPhi};
      }
    };
  }
};

const EOS_MAP = {
  vdw:EOS_VDW, rk:EOS_RK, srk:EOS_SRK, pr:EOS_PR,
  prsv:EOS_PRSV, pt:EOS_PT, ptv:EOS_PTV, csvdw:EOS_CSVDW
};

function classifyPhases(Z_arr, T, Tc){
  if(Z_arr.length===0) return {label:"Sin solución física",cls:"phase-mix"};
  if(Z_arr.length===1){
    if(T > Tc) return {label:"Supercrítico", cls:"phase-sup"};
    return Z_arr[0] > 0.3
      ? {label:"Vapor", cls:"phase-vap"}
      : {label:"Líquido", cls:"phase-liq"};
  }
  return {label:"Equilibrio L-V (2 fases)", cls:"phase-mix"};
}
