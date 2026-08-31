/* EOS Calc — UI / Eventos / Render KaTeX */
const $ = (id) => document.getElementById(id);
let LAST_CALC = null;

function populateComponents(filter){
  filter = filter || "";
  const sel = $("component");
  sel.innerHTML = "";
  const f = filter.toLowerCase().trim();
  COMPONENTS.filter(c =>
    !f || textoBusqueda(c).includes(f)
  ).forEach((c)=>{
    const opt = document.createElement("option");
    opt.value = COMPONENTS.indexOf(c);
    opt.textContent = nombreComp(c) + " (" + c.formula + ")";
    sel.appendChild(opt);
  });
  if(sel.options.length) sel.selectedIndex = 0;
  updateCompInfo();
}

function updateCompInfo(){
  const idx = parseInt($("component").value);
  if(isNaN(idx)){ $("comp-info").textContent=""; return; }
  const c = COMPONENTS[idx];
  $("comp-info").textContent = "Tc = " + c.Tc + " K · Pc = " + c.Pc + " bar · ω = " + c.omega;
}

function getComponent(){
  const mode = document.querySelector(".tab-btn.active").dataset.mode;
  if(mode === "db"){
    const idx = parseInt($("component").value);
    if(isNaN(idx)) throw new Error(t("err.pickComponent"));
    return COMPONENTS[idx];
  } else {
    const Tc = parseFloat($("m-tc").value);
    const Pc = parseFloat($("m-pc").value);
    const w  = parseFloat($("m-omega").value);
    if(!(Tc>0 && Pc>0)) throw new Error(t("err.tcpc"));
    if(isNaN(w)) throw new Error(t("err.omega"));
    return { name: $("m-name").value || "Manual", formula: "—", Tc, Pc, omega:w };
  }
}

function updateEosEq(){
  const eos = EOS_MAP[$("eos").value];
  $("eos-eq").textContent = eos.eq;
  if($("eq-panel-eos").classList.contains("open")) renderEosPanel();
  if($("eq-panel-res").classList.contains("open")) renderResPanel();
  if($("eq-panel-vals").classList.contains("open")) renderValsPanel();
}

function kx(latex, displayMode){
  if(displayMode === undefined) displayMode = true;
  if(typeof katex === "undefined"){
    return '<code style="color:var(--muted)">' + latex + '</code>';
  }
  try {
    return katex.renderToString(latex, { displayMode: displayMode, throwOnError:false, output:"html" });
  } catch(e){
    return '<code style="color:var(--bad)">' + e.message + '</code>';
  }
}

function renderRefs(refs){
  if(!refs || !refs.length) return "";
  return '<div class="refs"><div class="refs-label">' + t("panel.refs") + '</div><ul>' +
    refs.map(r => '<li>' + r + '</li>').join("") + '</ul></div>';
}

function renderEosPanel(){
  const key = $("eos").value;
  const f = FORMULAS[key];
  if(!f) return;
  let html = '<div class="eq-block"><div class="eq-label">' + t("panel.eos") + '</div>' + kx(f.eos) + '</div>';
  html += '<div class="eq-block"><div class="eq-label">' + t("panel.params") + '</div>';
  f.params.forEach(p => { html += kx(p); });
  html += '</div>';
  const cubicLabel = key === "csvdw" ? t("panel.solution") : t("panel.cubicZ");
  html += '<div class="eq-block"><div class="eq-label">' + cubicLabel + '</div>' + kx(f.cubic) + '</div>';
  if(f.note) html += '<div class="note">' + kx(t(f.note),false) + '</div>';
  html += renderRefs(f.refs);
  $("eq-panel-eos").innerHTML = html;
}

function renderResPanel(){
  const key = $("eos").value;
  const f = FORMULAS[key];
  if(!f) return;
  let html = "";
  html += '<div class="eq-block"><div class="eq-label">' + t("panel.HR") + '</div>' + kx(f.HR) + '</div>';
  html += '<div class="eq-block"><div class="eq-label">' + t("panel.SR") + '</div>' + kx(f.SR) + '</div>';
  html += '<div class="eq-block"><div class="eq-label">' + t("panel.GR") + '</div>' + kx(f.GR) + '</div>';
  html += '<div class="eq-block"><div class="eq-label">' + t("panel.lnphi") + '</div>' + kx(f.lnPhi) + '</div>';
  if(f.note) html += '<div class="note">' + kx(t(f.note),false) + '</div>';
  html += renderRefs(f.refs);
  $("eq-panel-res").innerHTML = html;
}

function renderValsPanel(){
  if(!LAST_CALC){
    $("eq-panel-vals").innerHTML = '<div class="note">' + t("panel.calcfirst") + '</div>';
    return;
  }
  const c = LAST_CALC;
  const subs = getSubstitutedParams(c.eosKey, c.comp, c.T, c.P, c.eosResult);
  let html = '<div class="eq-block"><div class="eq-label">' + t("panel.evaluatedAt") + c.T.toFixed(2) + ' K, P = ' + (c.P/1e5).toFixed(4) + ' bar</div>';
  subs.forEach(p => { html += kx(p[0] + " = " + p[1]); });
  html += '</div>';
  html += '<div class="note">' + t("panel.valuesNote") + '</div>';
  $("eq-panel-vals").innerHTML = html;
}

function setupToggle(btnId, panelId, renderFn){
  const btn = $(btnId), panel = $(panelId);
  btn.addEventListener("click", function(){
    const isOpen = panel.classList.toggle("open");
    btn.classList.toggle("open", isOpen);
    if(isOpen) renderFn();
  });
}

function calculate(){
  $("err").textContent = "";
  $("results").classList.remove("show");
  try {
    const comp = getComponent();
    const T = toK(parseFloat($("T").value), $("T-unit").value);
    const P = toPa(parseFloat($("P").value), $("P-unit").value);
    if(!(T>0)) throw new Error(t("err.Tpos"));
    if(!(P>0)) throw new Error(t("err.Ppos"));
    const eosKey = $("eos").value;
    const eos = EOS_MAP[eosKey];
    const res = eos.calc(T, P, comp);
    if(!res.Z.length) throw new Error(t("err.noroots"));
    LAST_CALC = {eosKey, comp, T, P, eosResult: res};

    const Zs = res.Z.slice();
    let labels;
    if(Zs.length === 1){
      const kind = T > comp.Tc ? "sup" : (Zs[0] > 0.3 ? "vap" : "liq");
      const tag = kind === "sup" ? t("phase.supercritical")
                : kind === "vap" ? t("phase.vapor") : t("phase.liquid");
      labels = [{Z:Zs[0], tag, kind}];
    } else if(Zs.length === 3){
      labels = [
        {Z:Zs[0], tag:t("phase.liquid"), kind:"liq"},
        {Z:Zs[1], tag:t("phase.middle"), kind:"mid"},
        {Z:Zs[2], tag:t("phase.vapor"),  kind:"vap"}
      ];
    } else {
      labels = Zs.map((Z,i) => ({Z, tag:t("phase.root")+(i+1), kind:"unk"}));
    }
    labels.forEach(L => {
      L.r = res.residuals(L.Z);
      L.Vm = L.Z * R * T / P;
    });

    let stableIdx = -1;
    let satEquilibrium = false;
    if(labels.length === 3){
      const liq = labels[0], vap = labels[2];
      stableIdx = liq.r.lnPhi < vap.r.lnPhi ? 0 : 2;
      if(Math.abs(liq.r.lnPhi - vap.r.lnPhi) < 0.01) satEquilibrium = true;
    } else if(labels.length === 1){
      stableIdx = 0;
    }

    let phaseHTML = "";
    if(satEquilibrium){
      phaseHTML = '<span class="phase-badge phase-mix">' + t("phase.equilibrium") + '</span>';
    } else if(labels.length === 1){
      const cls = labels[0].kind === "vap" ? "phase-vap"
                : labels[0].kind === "liq" ? "phase-liq" : "phase-sup";
      phaseHTML = '<span class="phase-badge ' + cls + '">' + labels[0].tag + '</span>';
    } else if(labels.length === 3){
      const stable = labels[stableIdx];
      const cls = stable.kind === "vap" ? "phase-vap" : "phase-liq";
      phaseHTML = '<span class="phase-badge ' + cls + '">' + t("phase.stableIs") + stable.tag + '</span>';
    }
    phaseHTML += ' <span style="margin-left:8px;color:var(--muted);font-size:12px">Tr = '
              + (T/comp.Tc).toFixed(3) + ' · Pr = ' + (P/(comp.Pc*1e5)).toFixed(3) + '</span>';
    $("phase-line").innerHTML = phaseHTML;

    // Bloque comparativo de estabilidad: Z y phi de cada raíz
    const stab = $("stab-summary");
    if(labels.length >= 2){
      const minLnPhi = Math.min.apply(null, labels.map(L => L.r.lnPhi));
      let stabHtml = '<div class="stab-block">'
        + '<div class="stab-title">' + t("stab.title") + '</div>';
      labels.forEach((L, i) => {
        const isWin = (i === stableIdx);
        const isMid = (L.kind === "mid");
        const cls = isWin ? "win" : (isMid ? "mid" : "");
        const lblText = L.tag + (isMid ? t("stab.nonphysical") : "");
        stabHtml += '<div class="stab-row ' + cls + '">'
          + '<div class="lbl">' + lblText + '</div>'
          + '<div class="v">Z = ' + fmt(L.Z, 5) + '</div>'
          + '<div class="v">&phi; = ' + fmt(L.r.phi, 5) + '</div>'
          + '<div class="v">ln&phi; = ' + fmt(L.r.lnPhi, 5) + '</div>'
          + '</div>';
      });
      const stable = labels[stableIdx];
      let conclusion;
      if(satEquilibrium){
        conclusion = t("stab.coexist");
      } else {
        conclusion = 'min(ln&phi;) = ' + fmt(minLnPhi, 5)
          + t("stab.concl1") + stable.tag + t("stab.concl2");
      }
      stabHtml += '<div class="stab-conclusion">' + conclusion + '</div></div>';
      stab.innerHTML = stabHtml;
    } else {
      stab.innerHTML = '';
    }

    const tbl = $("props-table");
    tbl.innerHTML = "";
    const addRow = (k,v) => {
      const tr = document.createElement("tr");
      tr.innerHTML = '<td>' + k + '</td><td>' + v + '</td>';
      tbl.appendChild(tr);
    };
    addRow("EOS", eos.name);
    addRow(t("tbl.component"), nombreComp(comp) + " (" + comp.formula + ")");
    addRow("T", fmt(T,2) + " K");
    addRow("P", fmt(P/1e5,4) + " bar");

    const rootsTable = document.createElement("table");
    rootsTable.className = "roots-table";
    rootsTable.innerHTML = '<tr><th></th><th>Z</th><th>V [cm³/mol]</th><th>H<sup>R</sup> [kJ/mol]</th><th>S<sup>R</sup> [J/mol·K]</th><th>G<sup>R</sup> [kJ/mol]</th><th>φ</th><th>ln φ</th></tr>';
    labels.forEach((L, i) => {
      const tr = document.createElement("tr");
      tr.className = (i === stableIdx) ? "root-stable" : (L.kind === "mid" ? "root-mid" : "");
      const stableMark = (i === stableIdx) ? '<span class="stable-mark">' + t("stab.mark") + '</span>' : "";
      tr.innerHTML = '<td>' + L.tag + stableMark + '</td>'
        + '<td>' + fmt(L.Z,5) + '</td>'
        + '<td>' + fmt(L.Vm*1e6,3) + '</td>'
        + '<td>' + fmt(L.r.HR/1000,4) + '</td>'
        + '<td>' + fmt(L.r.SR,3) + '</td>'
        + '<td>' + fmt(L.r.GR/1000,4) + '</td>'
        + '<td>' + fmt(L.r.phi,5) + '</td>'
        + '<td>' + fmt(L.r.lnPhi,5) + '</td>';
      rootsTable.appendChild(tr);
    });
    const wrap = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.style.padding = 0;
    td.appendChild(rootsTable);
    wrap.appendChild(td);
    tbl.appendChild(wrap);

    let info = "A = " + fmt(res.A,5) + " · B = " + fmt(res.B,5);
    if(res.C !== undefined) info += " · C = " + fmt(res.C,5);
    info += t("info.allroots") + res.Z.map(z => fmt(z,5)).join(", ");
    if(labels.length === 3 && !satEquilibrium){
      const liq = labels[0], vap = labels[2];
      const dlnPhi = vap.r.lnPhi - liq.r.lnPhi;
      info += "\nΔ(ln φ) = ln φ_v − ln φ_l = " + dlnPhi.toFixed(5)
           + " → " + labels[stableIdx].tag + t("info.morestable");
    } else if(satEquilibrium){
      info += t("info.saturation");
    }
    $("roots-info").textContent = info;

    $("results").classList.add("show");
    $("results").scrollIntoView({behavior:"smooth", block:"start"});

    if($("eq-panel-vals").classList.contains("open")) renderValsPanel();
    if($("eq-panel-res").classList.contains("open")) renderResPanel();
  } catch(e){
    $("err").textContent = "⚠ " + e.message;
  }
}

function calculateSat(){
  $("err-sat").textContent = "";
  $("results-sat").classList.remove("show");
  try {
    const comp = getComponent();
    const T = toK(parseFloat($("T-sat").value), $("T-sat-unit").value);
    const eosKey = $("eos").value;
    const r = calcPsat_SW(eosKey, T, comp);
    if(r.error) throw new Error(r.error);

    const tbl = $("sat-table");
    tbl.innerHTML = "";
    const addRow = (k,v) => {
      const tr = document.createElement("tr");
      tr.innerHTML = '<td>' + k + '</td><td>' + v + '</td>';
      tbl.appendChild(tr);
    };
    addRow("EOS", EOS_MAP[eosKey].name);
    addRow(t("tbl.component"), nombreComp(comp) + " (" + comp.formula + ")");
    addRow("T", fmt(T,2) + " K");
    addRow("Tr", fmt(r.Tr,4));
    const regimeLabel = r.regime === 'low_Tr' ? t("tbl.lowTr") : t("tbl.highTr");
    addRow(t("tbl.regime"), regimeLabel);
    addRow("ξ", fmt(r.xi,4) + " (ξ_min = " + fmt(r.xi_min,4) + ")");
    addRow("<b>P<sup>sat</sup></b>", "<b>" + fmt(r.P_sat/1e5,5) + " bar</b>");

    const eos = EOS_MAP[eosKey];
    const eq = eos.calc(T, r.P_sat, comp);
    if(eq.Z.length >= 2){
      const Zl = eq.Z[0], Zv = eq.Z[eq.Z.length-1];
      const Vl = Zl*R*T/r.P_sat, Vv = Zv*R*T/r.P_sat;
      addRow("Z<sup>L</sup>, Z<sup>V</sup>", fmt(Zl,5) + " · " + fmt(Zv,5));
      addRow("V<sup>L</sup> sat", fmt(Vl*1e6,3) + " cm³/mol");
      addRow("V<sup>V</sup> sat", fmt(Vv*1e6,3) + " cm³/mol");
      const hl = eq.residuals(Zl), hv = eq.residuals(Zv);
      addRow("ΔH<sup>vap</sup>", fmt((hv.HR - hl.HR)/1000, 4) + " kJ/mol");
    }
    addRow(t("tbl.iterations"), String(r.iterations));
    addRow(t("tbl.method"), r.method);

    $("results-sat").classList.add("show");
  } catch(e){
    $("err-sat").textContent = "⚠ " + e.message;
  }
}

function renderSatPanel(){
  if(!$("results-sat").classList.contains("show")){
    $("eq-panel-sat").innerHTML = '<div class="note">' + t("panel.satfirst") + '</div>';
    return;
  }
  const eosKey = $("eos").value;
  const T = toK(parseFloat($("T-sat").value), $("T-sat-unit").value);
  const comp = getComponent();
  const r = calcPsat_SW(eosKey, T, comp);
  if(r.error){
    $("eq-panel-sat").innerHTML = '<div class="note">' + r.error + '</div>';
    return;
  }
  let html = "";
  html += '<div class="eq-block"><div class="eq-label">' + t("panel.objective") + '</div>' + kx("\\Im(P^{sat}) = \\phi^V - \\phi^L = 0") + '</div>';
  html += '<div class="eq-block"><div class="eq-label">Newton-Raphson</div>' + kx("P_{j+1} = P_j - P_j\\,\\dfrac{\\phi^V - \\phi^L}{\\phi^V Z^V - \\phi^L Z^L - \\phi^V + \\phi^L}") + '</div>';
  if(r.regime === 'low_Tr'){
    html += '<div class="eq-block"><div class="eq-label">' + t("panel.initFL0") + '</div>' + kx("\\ln f^{L,0} = -1 - \\ln\\!\\left(\\dfrac{b(u-1)}{RT}\\right) + \\dfrac{\\xi}{\\theta^0}\\,\\lambda^0") + '</div>';
  } else {
    html += '<div class="eq-block"><div class="eq-label">' + t("panel.initSpin") + '</div>' + kx("P^{(0)} = \\dfrac{P_{\\max} + \\max\\{P_{\\min},\\,0\\}}{2}") + '</div>';
    html += '<div class="note">P_max = ' + fmt(r.Pmax/1e5,3) + ' bar, P_min = ' + fmt(r.Pmin/1e5,3) + ' bar, P^(0) = ' + fmt(r.P0/1e5,3) + ' bar</div>';
  }
  if(r.history && r.history.length){
    let trace = '<div class="eq-block"><div class="eq-label">' + t("panel.trace") + '</div>';
    trace += '<table class="roots-table"><tr><th>j</th><th>P [bar]</th><th>Z<sup>V</sup></th><th>Z<sup>L</sup></th><th>φ<sup>V</sup></th><th>φ<sup>L</sup></th><th>|Im|</th></tr>';
    r.history.forEach(h => {
      trace += '<tr><td>' + h.j + '</td><td>' + fmt(h.P/1e5,4) + '</td><td>' + fmt(h.Zv,4) + '</td><td>' + fmt(h.Zl,4) + '</td><td>' + fmt(h.phiV,4) + '</td><td>' + fmt(h.phiL,4) + '</td><td>' + h.Im.toExponential(2) + '</td></tr>';
    });
    trace += '</table></div>';
    html += trace;
  }
  html += renderRefs([
    "Segura, H.; Wisniak, J. Computers & Chemical Engineering 21(12), 1339-1347 (1997).",
    "Trebble, M.A.; Bishnoi, P.R. Fluid Phase Equilibria 35, 1-18 (1987).",
    t("ref.classnotes")
  ]);
  $("eq-panel-sat").innerHTML = html;
}

document.querySelectorAll(".tab-btn").forEach(btn=>{
  btn.addEventListener("click", function(){
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const mode = btn.dataset.mode;
    $("mode-db").style.display = mode==="db" ? "block" : "none";
    $("mode-manual").style.display = mode==="manual" ? "block" : "none";
  });
});
$("search").addEventListener("input", e => populateComponents(e.target.value));
$("component").addEventListener("change", updateCompInfo);
$("eos").addEventListener("change", updateEosEq);
$("calc").addEventListener("click", calculate);
$("calc-sat").addEventListener("click", calculateSat);

setupToggle("eq-toggle-eos", "eq-panel-eos", renderEosPanel);
setupToggle("eq-toggle-res", "eq-panel-res", renderResPanel);
setupToggle("eq-toggle-vals", "eq-panel-vals", renderValsPanel);
setupToggle("eq-toggle-sat", "eq-panel-sat", renderSatPanel);

/* Selector de idioma. Se conecta antes de la primera pasada de textos
   para que el boton nazca con la etiqueta correcta. */
$("lang-toggle").addEventListener("click", function(){
  setLang(LANG === "es" ? "en" : "es");
});

populateComponents();
updateEosEq();
setLang(LANG);   // aplica los textos estaticos y deja el boton al dia

if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('sw.js').catch(function(){});
  });
}
