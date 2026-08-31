# EOS Calc v1.2

*English version: [README.en.md](README.en.md)*

Calculadora de ecuaciones de estado cubicas y propiedades residuales
(VdW, RK, SRK, PR, PRSV, PT, PTV, CS-vdW), mas presion de saturacion por
isofugacidad. Todo el calculo corre en el navegador: no hay servidor
detras y funciona sin conexion.

Separation Thermodynamics and Extraction Processes (STEP),
Departamento de Ingenieria Quimica y Bioprocesos, Pontificia Universidad
Catolica de Chile. https://step.ing.puc.cl

## Bilingue

El boton **ES / EN** del encabezado cambia el idioma de toda la interfaz,
incluidos los nombres de los compuestos, y la eleccion queda guardada. El
buscador acepta el nombre en cualquiera de los dos idiomas: "agua" y
"water" encuentran lo mismo, este la aplicacion como este.

## Colores

La interfaz usa la paleta del curso IIQ2043 sobre fondo blanco, la misma de
las laminas: navy #1E3A5F, azul #2B7BBA, teal #18A48C y verde #62BD7E. Si el
telefono o el computador estan en modo oscuro, la aplicacion cambia sola a
una version oscura de la misma paleta.

## Publicarla en GitHub Pages, en tres pasos

1. Crear un repositorio **publico** nuevo llamado `eoscalc`.
2. Subir **el contenido de esta carpeta** a la raiz del repositorio
   (arrastrar los archivos a la pagina del repo y confirmar el commit).
3. En el repositorio, ir a **Settings**, luego **Pages**, y en
   *Build and deployment* elegir *Deploy from a branch*, rama `main`,
   carpeta `/ (root)`. Guardar.

Al minuto queda disponible en `https://USUARIO.github.io/eoscalc/`.

## Como la instalan los estudiantes en el telefono

Abrir esa direccion en el telefono y:

- **Android (Chrome):** menu de tres puntos, *Instalar app*.
- **iPhone (Safari):** boton compartir, *Agregar a pantalla de inicio*.

Queda como un icono mas y funciona sin conexion despues de la primera
visita.

## Para actualizar la app

Reemplazar los archivos en el repositorio y **subir el numero de version
del cache en `sw.js`** (la constante `CACHE`, hoy `eos-calc-v1.2`). Sin
ese cambio, a quien ya la tenga instalada le sigue apareciendo la version
vieja. La convencion es que el cache lleve el mismo numero que la app.

## Licencia y atribucion

Codigo bajo licencia **BSD 3-Clause** (archivo `LICENSE`). Se puede usar,
modificar y redistribuir conservando el aviso de copyright y **sin usar el
nombre del titular ni el de quienes contribuyan para promocionar versiones
derivadas**.

**El nombre y el logo de STEP y de la Pontificia Universidad Catolica de
Chile no estan cubiertos por esta licencia.** Una licencia de software
licencia derechos de autor, no marcas.

**Terceros:** las formulas se renderizan con KaTeX (Khan Academy y
colaboradores, licencia MIT); su texto esta en `katex/LICENSE` y debe
conservarse al redistribuir.

**Cita sugerida:** R. I. Canales M., *EOS Calc* v1.2, Separation
Thermodynamics and Extraction Processes (STEP), Pontificia Universidad
Catolica de Chile, 2026.

## Que hay en cada archivo

| Archivo | Que es |
|---|---|
| `index.html` | La aplicacion: interfaz y estilos |
| `eos-i18n.js` | Diccionario ES/EN, nombres de compuestos y selector |
| `eos-engine.js` | Resolucion de la cubica (Cardano) y seleccion de raices |
| `eos-formulas.js` | Expresiones de H^R, S^R, G^R y phi |
| `eos-psat.js` | Presion de saturacion por isofugacidad |
| `eos-ui.js` | Interfaz, tablas y renderizado de formulas |
| `manifest.json`, `sw.js` | Metadata PWA y cache offline |
| `katex/` | KaTeX local, con su propia licencia MIT adentro |
| `LICENSE` | Licencia BSD 3-Clause del codigo |
