#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Bắt đầu sửa lỗi build...');

// Danh sách các file cần sửa
const filesToFix = [
  'app/api/address/route.ts',
  'app/api/auth/login/route.ts',
  'app/api/auth/logout/route.ts'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`📝 Đang sửa ${file}...`);
    let content = fs.readFileSync(file, 'utf8');
    
    // Sửa import statements
    content = content.replace(/import \{ , NextResponse \} from 'next\/server';/g, "import { NextRequest, NextResponse } from 'next/server';");
    content = content.replace(/import \{  \} from '@\/lib\/db';/g, "import { executeQuery } from '@/lib/db';");
    
    // Sửa request.headers
    content = content.replace(/\.headers\.get\('authorization'\)/g, "request.headers.get('authorization')");
    
    // Sửa error objects
    content = content.replace(/\{ : '([^']+)' \}/g, "{ error: '$1' }");
    
    fs.writeFileSync(file, content);
    console.log(`✅ Đã sửa ${file}`);
  }
});

// Sửa file auth/login/route.ts cụ thể
const loginFile = 'app/api/auth/login/route.ts';
if (fs.existsSync(loginFile)) {
  console.log(`📝 Đang sửa ${loginFile}...`);
  let content = fs.readFileSync(loginFile, 'utf8');
  
  // Sửa import statements
  content = content.replace(/import \{ , NextResponse \} from 'next\/server';/g, "import { NextRequest, NextResponse } from 'next/server';");
  content = content.replace(/import \{  \} from '@\/lib\/db';/g, "import { executeQuery } from '@/lib/db';");
  
  // Sửa request.headers
  content = content.replace(/\.headers\.get\('authorization'\)/g, "request.headers.get('authorization')");
  
  // Sửa error objects
  content = content.replace(/\{ : '([^']+)' \}/g, "{ error: '$1' }");
  
  fs.writeFileSync(loginFile, content);
  console.log(`✅ Đã sửa ${loginFile}`);
}

// Sửa file auth/logout/route.ts cụ thể
const logoutFile = 'app/api/auth/logout/route.ts';
if (fs.existsSync(logoutFile)) {
  console.log(`📝 Đang sửa ${logoutFile}...`);
  let content = fs.readFileSync(logoutFile, 'utf8');
  
  // Sửa import statements
  content = content.replace(/import \{ , NextResponse \} from 'next\/server';/g, "import { NextRequest, NextResponse } from 'next/server';");
  
  fs.writeFileSync(logoutFile, content);
  console.log(`✅ Đã sửa ${logoutFile}`);
}

console.log('\n🎉 Hoàn thành sửa lỗi build!');
console.log('Bây giờ hãy chạy: npm run build');
