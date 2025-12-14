let popupTimer = null;

export function showPopup({ title, message, icon = "✨" }) {
  let el = document.getElementById("popup");
  if (!el) {
    el = document.createElement("div");
    el.id = "popup";
    document.body.appendChild(el);
  }

  el.innerHTML = `
    <div class="popup-card">
      <div class="popup-icon">${icon}</div>
      <div class="popup-text">
        <div class="popup-title">${title}</div>
        <div class="popup-msg">${message}</div>
      </div>
    </div>
  `;

  el.classList.add("show");

  clearTimeout(popupTimer);
  popupTimer = setTimeout(() => {
    el.classList.remove("show");
  }, 2600);
}
