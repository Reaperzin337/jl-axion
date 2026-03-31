(() => {
  const STORAGE_KEY = "jlaxion-theme";
  const FALLBACK_THEME = "dark";

  function readStoredTheme() {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (_error) {
      return null;
    }
  }

  function getSystemTheme() {
    try {
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    } catch (_error) {
      return FALLBACK_THEME;
    }
  }

  const theme = readStoredTheme() || getSystemTheme();
  const resolvedTheme = theme === "light" ? "light" : FALLBACK_THEME;
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", resolvedTheme === "light" ? "#eff5ff" : "#58c2ff");
  }
})();
