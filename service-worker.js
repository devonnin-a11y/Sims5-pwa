self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("sims5").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./css/core.css",
        "./css/hud.css",
        "./js/app.js"
      ])
    )
  );
});
