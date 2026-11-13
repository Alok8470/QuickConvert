const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Create dist directory
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Copy all root HTML files
const rootFiles = [
  'index.html',
  'about.html',
  'contact.html',
  'privacy-policy.html',
  'terms.html',
  'feedback.html',
  'favicon.svg',
  'robots.txt',
  'sitemap.xml',
  'sw.js'
];

rootFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
  }
});

// Copy directories
if (fs.existsSync('tools')) copyRecursiveSync('tools', path.join('dist', 'tools'));
if (fs.existsSync('js')) copyRecursiveSync('js', path.join('dist', 'js'));
if (fs.existsSync('css')) copyRecursiveSync('css', path.join('dist', 'css'));

// Root level JS/CSS fallbacks
if (fs.existsSync('js/app.js')) fs.copyFileSync('js/app.js', path.join('dist', 'app.js'));
if (fs.existsSync('css/styles.css')) fs.copyFileSync('css/styles.css', path.join('dist', 'styles.css'));

console.log('QuickConvert build complete: All static assets successfully packaged in dist/');
