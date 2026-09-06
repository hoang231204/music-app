(() => {
  function updateFavoriteButton(button, isFavorite) {
    const icon = button.querySelector('[data-lucide="heart"]');
    if (!icon) return;
    icon.classList.toggle("fill-red-500", isFavorite);
    icon.classList.toggle("text-red-500", isFavorite);
    icon.classList.toggle("text-slate-400", !isFavorite);
    button.setAttribute("aria-pressed", String(isFavorite));
  }
  document.addEventListener("click", async (event) => {
    const target = event.target;
    const button = target?.closest("[data-favorite-song]");
    if (!button) return;
    event.preventDefault();
    if (button.disabled || !button.dataset.favoriteSong) return;
    button.disabled = true;
    try {
      const response = await fetch(`/favorites/toggle/${button.dataset.favoriteSong}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      const data = await response.json();
      if (response.status === 401) {
        window.showToast(data.message, "warning");
        window.setTimeout(() => {
          window.location.href = "/auth/login";
        }, 500);
        return;
      }
      if (!response.ok || data.isFavorite === void 0 || data.likes === void 0) {
        throw new Error(data.message);
      }
      document.querySelectorAll(`[data-favorite-song="${button.dataset.favoriteSong}"]`).forEach((item) => {
        updateFavoriteButton(item, data.isFavorite);
        const card = item.closest("[data-song-card]");
        const likes = card?.querySelector("[data-song-likes]") || document.querySelector(`[data-song-likes="${button.dataset.favoriteSong}"]`);
        if (likes) likes.textContent = String(data.likes);
      });
      window.showToast(data.message, "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kh\xF4ng th\u1EC3 c\u1EADp nh\u1EADt danh s\xE1ch y\xEAu th\xEDch.";
      window.showToast(message, "error");
    } finally {
      button.disabled = false;
    }
  });
})();
//# sourceMappingURL=favorite.js.map
