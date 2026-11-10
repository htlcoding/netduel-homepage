import { createApp } from "vue";
import App from "./App.vue";
import { vEinblenden } from "./einblenden";

// Schriften werden mitgebaut, nicht aus dem Internet geladen.
import "@fontsource-variable/ibm-plex-sans/wght.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource-variable/geist/wght.css";
import "./style.css";

createApp(App).directive("einblenden", vEinblenden).mount("#app");
