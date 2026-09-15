import axios from 'axios';

const SHOPEE_HOSTS = ['shopee.co.id', 'shopee.com', 's.shopee', 'shp.ee', 'id.shp.ee'];

export const validateShopeeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return SHOPEE_HOSTS.some((host) => hostname === host || hostname.endsWith('.' + host));
  } catch {
    return false;
  }
};

export const extractShopeeIds = (url: string): { itemId?: string; shopId?: string } => {
  // Format: /product/{shopId}/{itemId}
  const productMatch = url.match(/\/product\/(\d+)\/(\d+)/);
  if (productMatch) {
    return { shopId: productMatch[1], itemId: productMatch[2] };
  }

  // Format: slug-i{shopId}.{itemId} (e.g. Mouse-Wireless-i2696878.41308951637)
  const slugMatch = url.match(/-i(\d+)\.(\d+)/);
  if (slugMatch) {
    return { shopId: slugMatch[1], itemId: slugMatch[2] };
  }

  // Format: /i/{shopId}/{itemId}
  const iMatch = url.match(/\/i\/(\d+)\/(\d+)/);
  if (iMatch) {
    return { shopId: iMatch[1], itemId: iMatch[2] };
  }

  return {};
};

export const normalizeShopeeUrl = (url: string): string => {
  const { itemId, shopId } = extractShopeeIds(url);

  if (itemId && shopId) {
    return `https://shopee.co.id/product/${shopId}/${itemId}/`;
  }

  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url;
  }
};

export const resolveShortUrl = async (url: string): Promise<string> => {
  const parsed = new URL(url);
  const isShortLink = parsed.hostname.includes('shp.ee') || parsed.hostname.includes('s.shopee');

  if (!isShortLink) {
    return url;
  }

  try {
    const response = await axios.get(url, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });

    return response.headers.location || url;
  } catch (error: any) {
    if (error.response?.headers?.location) {
      return error.response.headers.location;
    }
    return url;
  }
};
