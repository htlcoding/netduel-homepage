import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * `base: './'` macht alle Pfade im fertigen Build relativ. Dadurch läuft die
 * Seite aus jedem Ordner eines Webservers (auch in einem Unterordner der
 * Schul-Website). Achtung: Ein Doppelklick auf `dist/index.html` reicht NICHT —
 * Browser erlauben das Laden von Skripten aus `file://` nicht. Für einen Stand
 * ohne Internet: `npm run preview` auf dem Standrechner starten.
 */
export default defineConfig({
  base: './',
  plugins: [vue()]
})
