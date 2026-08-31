/* ============================================================
   EOS Calc — Presión de saturación P_sat (Segura-Wisniak 1997)
   • Baja T_r:  ξ ≥ ξ_min → init f^{L,0} (Ec. 32) + NR (Ec. 22)
   • Alta T_r:  ξ < ξ_min → init promedio espinodal (Ec. 27) + NR
   Ref: Segura, H.; Wisniak, J.
        Computers & Chemical Engineering 21(12), 1339-1347 (1997).
   ============================================================ */

/* Coeficientes Trebble-Bishnoi (a, b, c, d, da/dT) por EOS.
   d = 0 para todas las EOS implementadas.                        */
function getTBCoeffs(eosKey, T, comp){
  const Tc = comp.Tc, Pc = comp.Pc * 1e5, w = comp.omega;
  const Tr = T/Tc;

  switch(eosKey){
    case 'vdw': {
      const a = 27/64 * R*R*Tc*Tc / Pc;
      const b = R*Tc/(8*Pc);
      return {a, b, c:0, d:0, dadT:0, alpha:1};
    }
    case 'rk': {
      const aT = 0.42748 * R*R * Math.pow(Tc, 2.5) / (Pc * Math.sqrt(T));
      const b = 0.08664 * R*Tc/Pc;
      const dadT = -0.5 * aT / T;
      return {a:aT, b, c:0, d:0, dadT, alpha:1/Math.sqrt(Tr)};
    }
    case 'srk': {
      const ac = 0.42748 * R*R*Tc*Tc / Pc;
      const m = 0.480 + 1.574*w - 0.176*w*w;
      const sqAlpha = 1 + m*(1 - Math.sqrt(Tr));
      const alpha = sqAlpha*sqAlpha;
      const aT = ac * alpha;
      const b = 0.08664*R*Tc/Pc;
      const dadT = -ac*m*sqAlpha/Math.sqrt(T*Tc);
      return {a:aT, b, c:0, d:0, dadT, alpha, m};
    }
    case 'pr': case 'prsv': {
      const ac = 0.45724 * R*R*Tc*Tc / Pc;
      const b = 0.07780*R*Tc/Pc;
      let m, sqAlpha, dadT;
      if(eosKey === 'pr'){
        m = 0.37464 + 1.54226*w - 0.26992*w*w;
        sqAlpha = 1 + m*(1 - Math.sqrt(Tr));
        dadT = -ac*m*sqAlpha/Math.sqrt(T*Tc);
      } else {
        const k1 = comp.k1 || 0;
        const sqTr = Math.sqrt(Tr);
        const k0 = 0.378893 + 1.4897153*w - 0.17131848*w*w + 0.0196554*w*w*w;
        m = k0 + k1*(1 + sqTr)*(0.7 - Tr);
        sqAlpha = 1 + m*(1 - sqTr);
        const dmdT = k1*((0.7 - Tr)/(2*sqTr*Tc) - (1 + sqTr)/Tc);
        const dsqAlphadT = dmdT*(1 - sqTr) + m*(-1/(2*sqTr*Tc));
        dadT = ac * 2 * sqAlpha * dsqAlphadT;
      }
      const alpha = sqAlpha*sqAlpha;
      const aT = ac * alpha;
      return {a:aT, b, c:b, d:0, dadT, alpha, m};
    }
    case 'pt': case 'ptv': {
      let zc = comp.zc;
      let Wa, Wb, Wc, F;
      if(eosKey === 'pt'){
        zc = zc || (0.329032 - 0.076799*w + 0.0211947*w*w);
        F  = comp.F || (0.452413 + 1.30982*w - 0.295937*w*w);
        const Wb_roots = solveCubic(2 - 3*zc, 3*zc*zc, -zc*zc*zc)
                         .filter(x=>x>0 && x<1);
        Wb = Wb_roots.length ? Wb_roots[0] : 0.077796;
        Wc = 1 - 3*zc;
        Wa = 3*zc*zc + 3*(1 - 2*zc)*Wb + Wb*Wb + 1 - 3*zc;
      } else {
        zc = zc || (0.329032 - 0.076799*w + 0.0211947*w*w);
        Wa = 0.66121 - 0.76105*zc;
        Wb = 0.02207 + 0.20868*zc;
        Wc = 0.57765 - 1.87080*zc;
        F  = comp.F || (0.46286 + 3.58230*(w*zc) + 8.19417*(w*zc)*(w*zc));
      }
      const sqAlpha = 1 + F*(1 - Math.sqrt(Tr));
      const alpha = sqAlpha*sqAlpha;
      const ac = Wa * R*R*Tc*Tc/Pc;
      const aT = ac * alpha;
      const b = Wb * R*Tc/Pc;
      const c = Wc * R*Tc/Pc;
      const dadT = -ac*F*sqAlpha/Math.sqrt(T*Tc);
      return {a:aT, b, c, d:0, dadT, alpha, F, zc};
    }
    default:
      throw new Error("EOS no soportada por Segura-Wisniak: " + eosKey);
  }
}

/* NR sobre Im = phi^V - phi^L (Ec. 22 SW)                       */
function newtonRaphsonPsat(eosKey, comp, T, P0){
  const eos = EOS_MAP[eosKey];
  const history = [];
  const eps = 1e-7;
  const maxIter = 60;
  let P = P0;
  for(let j=0; j<maxIter; j++){
    const r = eos.calc(T, P, comp);
    if(r.Z.length < 2){
      P *= 0.7;
      continue;
    }
    const Zv = r.Z[r.Z.length-1];
    const Zl = r.Z[0];
    const phiV = r.residuals(Zv).phi;
    const phiL = r.residuals(Zl).phi;
    const Im = phiV - phiL;
    history.push({j, P, Zv, Zl, phiV, phiL, Im:Math.abs(Im)});
    if(Math.abs(Im) < eps) return {converged:true, P_sat:P, iterations:j+1, history};
    const denom = phiV*Zv - phiL*Zl - Im;
    if(Math.abs(denom) < 1e-12) break;
    let P_new = P - P * Im / denom;
    if(P_new <= 0 || !isFinite(P_new)) P_new = P * 0.5;
    P = P_new;
  }
  return {converged:false, history};
}

/* Régimen baja Tr: f^{L,0} + NR (Ecs. 28, 32, 22 SW)           */
function calcPsat_lowTr(eosKey, p, T, comp){
  const {a, b, c, d} = p;
  const cb = c/b;
  const dbsq = (d*d) / (b*b);
  const xi = a / (b * R * T);

  const X = xi - 1 - cb;
  const Y = X*X + 4*(cb + dbsq - xi);
  if(Y < 0) return {error: t("err.disc")};
  const u = (X - Math.sqrt(Y)) / 2;
  if(u <= 1) return {error: t("err.u1")};

  const tau0 = 1 + 6*cb + cb*cb + 4*dbsq;
  if(tau0 <= 0) return {error: t("err.tau0")};
  const theta0 = Math.sqrt(tau0);
  const num = 2*u + 1 + cb - theta0;
  const den = 2*u + 1 + cb + theta0;
  if(num <= 0 || den <= 0) return {error: t("err.log")};
  const lambda0 = Math.log(num/den);

  const lnFL0 = -1 - Math.log(b * (u-1) / (R*T)) + (xi/theta0) * lambda0;
  const fL0 = Math.exp(lnFL0);

  const nr = newtonRaphsonPsat(eosKey, comp, T, fL0);
  if(nr.converged){
    return {
      P_sat: nr.P_sat,
      regime: 'low_Tr',
      u, V_L: b*u, fL0,
      iterations: nr.iterations, history: nr.history,
      method: t("met.nrFL0")
    };
  }
  return {
    P_sat: fL0,
    regime: 'low_Tr',
    u, V_L: b*u, fL0,
    iterations: 0, history: nr.history || [],
    method: t("met.asymptote")
  };
}

/* Encuentra los puntos espinodales (dP/dV = 0)                   */
function findSpinodals(p, T){
  const {a, b, c, d} = p;
  const Pv = (V) => {
    const den = V*V + (b+c)*V - b*c + d*d;
    return R*T/(V-b) - a/den;
  };
  const dPdV = (V) => {
    const den = V*V + (b+c)*V - b*c + d*d;
    return -R*T/((V-b)*(V-b)) + a*(2*V + (b+c))/(den*den);
  };
  const Vlo0 = b * 1.0001;
  const Vhi0 = b * 1e5;
  const N = 2000;
  const logLo = Math.log(Vlo0), logHi = Math.log(Vhi0);
  let prevV = Vlo0, prevD = dPdV(prevV);
  const extrema = [];
  for(let i=1; i<=N; i++){
    const V = Math.exp(logLo + (logHi-logLo)*i/N);
    const D = dPdV(V);
    if(prevD * D < 0){
      let lo=prevV, hi=V, flo=prevD, fhi=D;
      for(let k=0;k<80;k++){
        const mid=(lo+hi)/2, fm=dPdV(mid);
        if(flo*fm<0){hi=mid; fhi=fm;} else {lo=mid; flo=fm;}
      }
      extrema.push({V:(lo+hi)/2, P:Pv((lo+hi)/2)});
    }
    prevV = V; prevD = D;
  }
  extrema.sort((a,b)=>a.V-b.V);
  return extrema;
}

/* Régimen alta Tr: espinodal + NR (Ecs. 27, 22 SW)              */
function calcPsat_highTr(eosKey, p, T, comp){
  const sp = findSpinodals(p, T);
  if(sp.length < 2){
    return {error: t("err.spinodal")};
  }
  const Pa = sp[0].P, Pb = sp[1].P;
  const Pmax = Math.max(Pa, Pb);
  const Pmin = Math.min(Pa, Pb);
  let P = (Pmax + Math.max(Pmin, 0)) / 2;
  if(P <= 0) return {error: t("err.P0")};

  const nr = newtonRaphsonPsat(eosKey, comp, T, P);
  if(nr.converged){
    return {
      P_sat: nr.P_sat,
      regime: 'high_Tr',
      Pmax, Pmin, P0: P,
      Vsp_lo: sp[0].V, Vsp_hi: sp[1].V,
      iterations: nr.iterations, history: nr.history,
      method: t("met.nrSpin")
    };
  }
  return {error: t("err.nrfail"), history:nr.history};
}

/* Función principal                                              */
function calcPsat_SW(eosKey, T, comp){
  if(!['vdw','rk','srk','pr','prsv','pt','ptv'].includes(eosKey)){
    return {error: t("err.csvdw")};
  }
  if(T >= comp.Tc) return {error: t("err.aboveTc")};
  if(T <= 0) return {error: t("err.Tpos")};

  const p = getTBCoeffs(eosKey, T, comp);
  const cb = p.c/p.b;
  const dbsq = (p.d*p.d) / (p.b*p.b);
  if(2 - dbsq < 0) return {error: t("err.dbsq")};
  const xi = p.a / (p.b * R * T);
  const xi_min = 3 + cb + 2*Math.sqrt(2 - dbsq);

  const baseInfo = {
    xi, xi_min, c_over_b: cb, Tr: T/comp.Tc,
    a: p.a, b: p.b, c: p.c, d: p.d, dadT: p.dadT, alpha: p.alpha
  };

  let result;
  if(xi >= xi_min){
    result = calcPsat_lowTr(eosKey, p, T, comp);
  } else {
    result = calcPsat_highTr(eosKey, p, T, comp);
  }
  return Object.assign({}, baseInfo, result);
}
