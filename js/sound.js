const sounds = {};

function load(name) {
  const a = new Audio(`audio/${name}.mp3`);
  a.volume = 0.35;
  sounds[name] = a;
}

["click", "open", "stamp"].forEach(load);

export function playSound(name) {
  const s = sounds[name];
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(() => {});
}
