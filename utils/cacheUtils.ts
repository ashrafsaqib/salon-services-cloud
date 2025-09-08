export function initCacheFlag() {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const cacheParam = params.get("cache");
    if (cacheParam !== null && cacheParam === "false") {
      sessionStorage.setItem("useCache", "false");
    }
  }
}

export function shouldUseCache() {
  if (typeof window !== "undefined") {
    const value = sessionStorage.getItem("useCache");
    console.log("shouldUseCache:", value);
    return value === null ? true : value;
  }
  return true;
}
