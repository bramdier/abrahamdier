let suppressHashNav = false;

export function setHashNavSuppressed(value) {
  suppressHashNav = value;
}

export function isHashNavSuppressed() {
  return suppressHashNav;
}

export function replaceHash(hash) {
  if (!window.history.replaceState) return;
  setHashNavSuppressed(true);
  history.replaceState(null, "", "#" + hash);
  requestAnimationFrame(() => setHashNavSuppressed(false));
}
