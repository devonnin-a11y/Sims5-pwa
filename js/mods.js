export async function loadMods() {
  try {
    const res = await fetch("./mods/index.json");
    const mods = await res.json();

    for (const m of mods) {
      await import(`./mods/${m}`);
      console.log("Loaded mod:", m);
    }
  } catch {
    console.log("No mods loaded");
  }
}
