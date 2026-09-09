import { grooveOptions, type GrooveId } from "./music-types";

const storageKey = "portfolio-music-theme";
export function savedGroove(): GrooveId {
  try {
    const saved = localStorage.getItem(storageKey);
    return grooveOptions.find((groove) => groove.id === saved)?.id ?? "after-hours";
  } catch { return "after-hours"; }
}

export function applyGrooveTheme(preset: GrooveId, persist = false) {
  const theme = grooveOptions.find((groove) => groove.id === preset)!.theme;
  const root = document.documentElement;
  root.style.setProperty("--theme-hue", String(theme.hue));
  root.style.setProperty("--lime", theme.accent);
  root.dataset.musicTheme = preset;
  if (persist) try { localStorage.setItem(storageKey, preset); } catch { /* Theme still works without storage. */ }
}

// Apply a validated preference before the page paints; React restores the same selection on mount.
const catalog = grooveOptions.map(({ id, theme }) => ({ id, ...theme }));
export const musicThemeBootstrap = `(()=>{try{const choices=${JSON.stringify(catalog)};const chosen=choices.find(x=>x.id===localStorage.getItem("${storageKey}"))||choices[0];const root=document.documentElement;root.style.setProperty("--theme-hue",String(chosen.hue));root.style.setProperty("--lime",chosen.accent);root.dataset.musicTheme=chosen.id;}catch{}})();`;
