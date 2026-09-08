# Valdemora · Caso 001

Demo jugable de investigación narrativa. La partida se guarda localmente en el navegador.

## Desarrollo local

```bash
npm ci
npm run dev
```

La demo estará disponible en `http://localhost:3000/`.

## Comprobaciones

```bash
npm run test:logic
npx playwright install chromium
npm run test:e2e
npm run build
```

## Publicar en GitHub Pages

El repositorio incluye `.github/workflows/pages.yml`. El flujo comprueba la lógica, juega automáticamente una partida completa, genera la web estática y la publica al enviar cambios a `main`.

1. Crea un repositorio vacío en GitHub, por ejemplo `valdemora-demo`.
2. Sube este directorio como raíz del repositorio.
3. En GitHub abre **Settings → Pages**.
4. En **Build and deployment → Source**, selecciona **GitHub Actions**.
5. Abre **Actions** y espera a que termine “Publicar demo en GitHub Pages”.

La dirección resultante tendrá esta forma:

```text
https://TU-USUARIO.github.io/valdemora-demo/
```

Cada nuevo `git push` a `main` volverá a comprobar y publicar la demo automáticamente.
