export async function loadLayout() {
  async function loadPartial(url, mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    mount.innerHTML = (await response.text()).trim();
  }

  await Promise.all([
    loadPartial("/header.html", "site-header"),
    loadPartial("/footer.html", "site-footer"),
  ]);
}
