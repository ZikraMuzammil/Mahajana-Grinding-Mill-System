const KEY = "mahajana_recently_viewed";

export const saveRecentlyViewed = (product) => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]").filter(
      (p) => p.id !== product.id
    );

    list.unshift({
      id: product.id,
      name: product.name,
      image: product.image,
      basePrice: product.basePrice,
    });

    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 10)));
  } catch {
    // ignore storage errors
  }
};