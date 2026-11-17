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

// Copy all root assets and HTML files
const rootFiles = [
  'index.html',
  'about.html',
  'contact.html',
  'privacy.html',
  'privacy-policy.html',
  'terms.html',
  'feedback.html',
  'favicon.svg',
  'favicon.ico',
  'favicon-32x32.png',
  'favicon-48x48.png',
  'apple-touch-icon.png',
  'logo.png',
  'icon-192.png',
  'icon-512.png',
  'site.webmanifest',
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
if (fs.existsSync('guides')) copyRecursiveSync('guides', path.join('dist', 'guides'));
if (fs.existsSync('js')) copyRecursiveSync('js', path.join('dist', 'js'));
if (fs.existsSync('css')) copyRecursiveSync('css', path.join('dist', 'css'));
if (fs.existsSync('webfonts')) copyRecursiveSync('webfonts', path.join('dist', 'webfonts'));

// Root level JS/CSS fallbacks & synchronization
if (fs.existsSync('js/app.js')) {
  fs.copyFileSync('js/app.js', path.join('dist', 'app.js'));
  fs.copyFileSync('js/app.js', 'app.js');
}
if (fs.existsSync('js/theme.js')) {
  fs.copyFileSync('js/theme.js', path.join('dist', 'theme.js'));
  fs.copyFileSync('js/theme.js', 'theme.js');
}
if (fs.existsSync('css/styles.css')) {
  fs.copyFileSync('css/styles.css', path.join('dist', 'styles.css'));
  fs.copyFileSync('css/styles.css', path.join('dist', 'style.css'));
  fs.copyFileSync('css/styles.css', 'styles.css');
  fs.copyFileSync('css/styles.css', 'style.css');
}

console.log('QuickConvert build complete: All static assets successfully packaged in dist/');
