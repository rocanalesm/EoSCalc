# EOS Calc v1.2

*Version en espanol: [README.md](README.md)*

A calculator for cubic equations of state and residual properties
(VdW, RK, SRK, PR, PRSV, PT, PTV, CS-vdW), plus saturation pressure by
isofugacity. Every calculation runs in the browser: there is no server
behind it and it works offline.

Separation Thermodynamics and Extraction Processes (STEP),
Department of Chemical and Bioprocess Engineering, Pontificia Universidad
Catolica de Chile. https://step.ing.puc.cl

## Bilingual

The **ES / EN** button in the header switches the language of the whole
interface, compound names included, and the choice is stored. The search
box accepts either language: "water" and "agua" find the same compound,
whichever language the app is in.

## Colors

The interface uses the IIQ2043 course palette on a white background, the same
one as the slides: navy #1E3A5F, blue #2B7BBA, teal #18A48C and green #62BD7E.
If the phone or the computer is set to dark mode, the app switches on its own
to a dark version of the same palette.

## Publishing it on GitHub Pages, in three steps

1. Create a new **public** repository called `eoscalc`.
2. Upload **the contents of this folder** to the repository root (drag
   the files onto the repo page and commit).
3. In the repository, go to **Settings**, then **Pages**, and under
   *Build and deployment* choose *Deploy from a branch*, branch `main`,
   folder `/ (root)`. Save.

Within a minute it is live at `https://USERNAME.github.io/eoscalc/`.

## How students install it on a phone

Open that address on the phone and:

- **Android (Chrome):** three-dot menu, *Install app*.
- **iPhone (Safari):** share button, *Add to Home Screen*.

It becomes one more icon and works offline after the first visit.

## Updating the app

Replace the files in the repository and **bump the cache version in
`sw.js`** (the `CACHE` constant, currently `eos-calc-v1.2`). Without that
change, anyone who already installed it keeps seeing the old version. The
convention is that the cache carries the same number as the app.

## License and attribution

Code released under the **BSD 3-Clause** license (see `LICENSE`). It may be
used, modified and redistributed as long as the copyright notice is kept and
**the name of the copyright holder and of the contributors is not used to
promote derived products**.

**The STEP and Pontificia Universidad Catolica de Chile names and logos are
not covered by this license.** A software license grants copyright
permissions, not trademark ones.

**Third party:** formulas are rendered with KaTeX (Khan Academy and
contributors, MIT license); its text is in `katex/LICENSE` and must be kept
in any redistribution.

**Suggested citation:** R. I. Canales M., *EOS Calc* v1.2, Separation
Thermodynamics and Extraction Processes (STEP), Pontificia Universidad
Catolica de Chile, 2026.

## What each file is

| File | What it is |
|---|---|
| `index.html` | The app: interface and styles |
| `eos-i18n.js` | ES/EN dictionary, compound names and the language switch |
| `eos-engine.js` | Cubic solver (Cardano) and root selection |
| `eos-formulas.js` | Expressions for H^R, S^R, G^R and phi |
| `eos-psat.js` | Saturation pressure by isofugacity |
| `eos-ui.js` | Interface, tables and formula rendering |
| `manifest.json`, `sw.js` | PWA metadata and offline cache |
| `katex/` | Local KaTeX, with its own MIT license inside |
| `LICENSE` | BSD 3-Clause license for the code |
