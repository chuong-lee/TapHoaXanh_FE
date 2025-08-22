#!/usr/bin/env node

// Script to generate PWA icons from a source logo
// Usage: npm run generate-icons

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const iconSizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 150, name: 'icon-150x150.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' }
];

// Create placeholder icons (in production, you would use a proper image processing library)
function createPlaceholderIcon(size, filename) {
  const iconsDir = path.join(__dirname, '..', 'public', 'icons');
  
  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  // Create an SVG placeholder
  const svgContent = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#22c55e" rx="12"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.floor(size/8)}" 
            font-weight="bold" fill="white" text-anchor="middle" dy=".3em">TH</text>
      <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="${Math.floor(size/12)}" 
            fill="white" text-anchor="middle" dy=".3em">Xanh</text>
    </svg>
  `;
  
  const svgPath = path.join(iconsDir, filename.replace('.png', '.svg'));
  fs.writeFileSync(svgPath, svgContent.trim());
  
  console.log(`✓ Created placeholder icon: ${filename.replace('.png', '.svg')}`);
}

// Generate shortcut icons
function createShortcutIcons() {
  const shortcuts = [
    { name: 'shortcut-products.png', icon: '🛍️', color: '#3b82f6' },
    { name: 'shortcut-cart.png', icon: '🛒', color: '#f59e0b' },
    { name: 'shortcut-orders.png', icon: '📦', color: '#10b981' }
  ];
  
  shortcuts.forEach(shortcut => {
    const svgContent = `
      <svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
        <rect width="192" height="192" fill="${shortcut.color}" rx="24"/>
        <text x="50%" y="50%" font-size="96" text-anchor="middle" dy=".3em">${shortcut.icon}</text>
      </svg>
    `;
    
    const svgPath = path.join(__dirname, '..', 'public', 'icons', shortcut.name.replace('.png', '.svg'));
    fs.writeFileSync(svgPath, svgContent.trim());
    
    console.log(`✓ Created shortcut icon: ${shortcut.name.replace('.png', '.svg')}`);
  });
}

// Create additional PWA assets
function createAdditionalAssets() {
  const iconsDir = path.join(__dirname, '..', 'public', 'icons');
  
  // Create safari pinned tab icon
  const safariIcon = `
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <rect width="512" height="512" fill="#22c55e"/>
      <text x="256" y="280" font-family="Arial, sans-serif" font-size="120" font-weight="bold" 
            fill="white" text-anchor="middle">TH</text>
      <text x="256" y="380" font-family="Arial, sans-serif" font-size="60" 
            fill="white" text-anchor="middle">Xanh</text>
    </svg>
  `;
  
  fs.writeFileSync(path.join(iconsDir, 'safari-pinned-tab.svg'), safariIcon.trim());
  console.log('✓ Created safari-pinned-tab.svg');
  
  // Create badge icon
  const badgeIcon = `
    <svg width="72" height="72" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="36" fill="#22c55e"/>
      <text x="36" y="42" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
            fill="white" text-anchor="middle">T</text>
    </svg>
  `;
  
  fs.writeFileSync(path.join(iconsDir, 'badge-72x72.svg'), badgeIcon.trim());
  console.log('✓ Created badge-72x72.svg');
  
  // Create action icons
  const actionIcons = [
    { name: 'action-view.svg', icon: '👁️' },
    { name: 'action-dismiss.svg', icon: '❌' }
  ];
  
  actionIcons.forEach(action => {
    const actionSvg = `
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" fill="#6b7280" rx="4"/>
        <text x="12" y="16" font-size="12" text-anchor="middle">${action.icon}</text>
      </svg>
    `;
    
    fs.writeFileSync(path.join(iconsDir, action.name), actionSvg.trim());
    console.log(`✓ Created ${action.name}`);
  });
}

// Create screenshots placeholder
function createScreenshots() {
  const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');
  
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  // Desktop screenshot placeholder
  const desktopScreenshot = `
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <rect width="1280" height="720" fill="#f9fafb"/>
      <rect x="0" y="0" width="1280" height="80" fill="#22c55e"/>
      <text x="640" y="45" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
            fill="white" text-anchor="middle">Tạp Hóa Xanh - Desktop View</text>
      <text x="640" y="360" font-family="Arial, sans-serif" font-size="48" 
            fill="#6b7280" text-anchor="middle">Homepage Screenshot</text>
    </svg>
  `;
  
  fs.writeFileSync(path.join(screenshotsDir, 'desktop-1.svg'), desktopScreenshot.trim());
  console.log('✓ Created desktop-1.svg');
  
  // Mobile screenshot placeholder
  const mobileScreenshot = `
    <svg width="375" height="812" xmlns="http://www.w3.org/2000/svg">
      <rect width="375" height="812" fill="#f9fafb"/>
      <rect x="0" y="0" width="375" height="60" fill="#22c55e"/>
      <text x="187.5" y="35" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
            fill="white" text-anchor="middle">Tạp Hóa Xanh</text>
      <text x="187.5" y="406" font-family="Arial, sans-serif" font-size="20" 
            fill="#6b7280" text-anchor="middle">Mobile App</text>
    </svg>
  `;
  
  fs.writeFileSync(path.join(screenshotsDir, 'mobile-1.svg'), mobileScreenshot.trim());
  console.log('✓ Created mobile-1.svg');
}

// Main execution
function main() {
  console.log('🚀 Generating PWA assets...\n');
  
  try {
    // Generate main app icons
    iconSizes.forEach(({ size, name }) => {
      createPlaceholderIcon(size, name);
    });
    
    console.log('');
    
    // Generate shortcut icons
    createShortcutIcons();
    
    console.log('');
    
    // Generate additional assets
    createAdditionalAssets();
    
    console.log('');
    
    // Generate screenshots
    createScreenshots();
    
    console.log('\n✅ PWA assets generated successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Replace SVG placeholders with proper PNG/ICO files using your logo');
    console.log('2. Test PWA installation in supported browsers');
    console.log('3. Update manifest.json with actual screenshot paths if needed');
    
  } catch (error) {
    console.error('❌ Error generating PWA assets:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
