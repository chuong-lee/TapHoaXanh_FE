// Image utility functions for handling fallbacks and errors

export function getCategoryIcon(categoryId: number): string {
  // Try SVG placeholder first (we created these)
  const svgPlaceholder = `/client/images/category-${categoryId}.svg`;
  
  // Fallback to existing product placeholders
  const fallbackIcons = [
    '/client/images/product-placeholder-1.png',
    '/client/images/product-placeholder-2.png',
    '/client/images/product-placeholder-3.png',
    '/client/images/product-placeholder-4.png',
    '/client/images/product-placeholder-5.png'
  ];
  
  const fallbackIndex = (categoryId - 1) % fallbackIcons.length;
  return fallbackIcons[fallbackIndex];
}

export function getBannerImage(index: number): string {
  // Use existing promo images as banner fallbacks
  const fallbackImages = [
    '/client/images/promo1.png',
    '/client/images/promo2.png', 
    '/client/images/promo3.png',
    '/client/images/promo4.png'
  ];
  
  const fallbackIndex = (index - 1) % fallbackImages.length;
  return fallbackImages[fallbackIndex];
}

export function fixImgSrc(src: string | null | undefined): string {
  if (!src) {
    return '/client/images/product-placeholder-1.png';
  }
  
  // If it's already a full URL, return as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // If it's a relative path, ensure it starts with /
  if (src.startsWith('/')) {
    return src;
  }
  
  return `/${src}`;
}

export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>): void {
  const img = event.currentTarget;
  img.src = '/client/images/product-placeholder-1.png';
  img.onerror = null; // Prevent infinite loop
}
