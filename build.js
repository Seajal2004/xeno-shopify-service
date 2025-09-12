const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building Xeno Shopify Service...');

// Build frontend
console.log('Building frontend...');
try {
  execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });
  
  // Copy build files to public directory
  const buildDir = path.join(__dirname, 'frontend', 'build');
  const publicDir = path.join(__dirname, 'public');
  
  if (fs.existsSync(buildDir)) {
    // Remove existing public directory
    if (fs.existsSync(publicDir)) {
      fs.rmSync(publicDir, { recursive: true });
    }
    
    // Copy build to public
    fs.cpSync(buildDir, publicDir, { recursive: true });
    console.log('Frontend built and copied to public directory');
  }
} catch (error) {
  console.error('Frontend build failed:', error.message);
  process.exit(1);
}

console.log('Build completed successfully!');
console.log('Run "npm start" to start the server');