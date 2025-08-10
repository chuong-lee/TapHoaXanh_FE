#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fix HTML entities that were incorrectly added
const fixes = [
  {
    pattern: /&quot;/g,
    replacement: '"'
  },
  {
    pattern: /&lt;/g,
    replacement: '<'
  },
  {
    pattern: /&gt;/g,
    replacement: '>'
  },
  {
    pattern: /&amp;/g,
    replacement: '&'
  }
];

// Files that need HTML entity fixes
const filesToProcess = [
  'app/admin/orders/page.tsx',
  'app/components/Header.tsx',
  'app/components/ProductCard.tsx',
  'app/components/FeaturesDemo.tsx',
  'app/hooks/useCart.ts',
  'app/news/[id]/page.tsx',
  'app/page.tsx',
  'app/product/[slug]/page.tsx',
  'app/product/page.tsx',
  'app/profile/page.tsx',
  'app/voucher/page.tsx',
  'app/components/AddressManager.tsx'
];

function processFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    fixes.forEach(fix => {
      if (fix.pattern.test(content)) {
        content = content.replace(fix.pattern, fix.replacement);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Fixed HTML entities: ${filePath}`);
    } else {
      console.log(`No HTML entities found: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process all files
console.log('Starting HTML entity fixes...');
filesToProcess.forEach(processFile);
console.log('Finished processing files.'); 