export const normalizeShopeeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    
    const itemMatch = path.match(/i\/(\d+)/);
    const shopMatch = path.match(/shopee\.co\.id\/([^/]+)\/[^/]+/);
    
    if (itemMatch) {
      return `https://shopee.co.id/i/${itemMatch[1]}`;
    }
    if (shopMatch) {
      return `https://shopee.co.id/${shopMatch[1]}`;
    }
    return `https://shopee.co.id${path}`;
  } catch {
    return url;
  }
};

export const extractShopeeIds = (url: string): { itemId?: string; shopId?: string } => {
  const itemId = url.match(/i\/(\d+)/)?.[1];
  const shopId = url.match(/shop\/(\d+)/)?.[1];
  return { itemId, shopId };
};

export const validateShopeeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return hostname.includes('shopee.co.id') || hostname.includes('shopee.com');
  } catch {
    return false;
  }
};
