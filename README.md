# QuickConvert - Free Online File & Document Converters

[![Website](https://img.shields.io/badge/Website-quickconvert.in-4f46e5)](https://quickconvert.in/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-green.svg)](https://quickconvert.in/privacy.html)

**QuickConvert** is a fast, free, client-side document and image conversion suite. All file processing happens entirely inside your browser using client-side Web Workers, the HTML5 Canvas API, and WebAssembly libraries — **zero files are uploaded to any server**.

---

## 🚀 Key Features

* **Zero Server Uploads**: 100% private. Files never leave your device.
* **Lightning Fast**: Local hardware acceleration with in-browser processing.
* **Offline Ready (PWA)**: Full Progressive Web App support powered by a service worker.
* **35+ Built-in Tools & Guides**:
  * **PDF Tools**: Merge, Split, Rotate, Sign, Watermark, Edit, Compress (20KB, 50KB, 100KB, 200KB, 500KB, 1MB), PDF to Word / Excel / PPT / Zip, Text to PDF, and Word to PDF.
  * **Image Tools**: Image Converter (PNG, JPG, WebP), Image Compressor with target sizes (20KB, 50KB, 100KB, 200KB), Exam Photo Resizer, and Images to PDF / ZIP.
  * **Developer & Daily Utilities**: Color Picker, JSON Formatter, QR Code Generator, Password Generator, Unit Converter, Word Counter, GST Calculator, and EMI Calculator.

---

## 🛠️ Project Structure

```
QuickConvert/
├── css/             # Minified Tailwind CSS & styles
├── guides/          # Technical guides & step-by-step conversion tutorials
├── js/              # Application logic & vendor libraries (pdf-lib, jsPDF, etc.)
├── tools/           # 35+ client-side conversion and utility tool pages
├── build.js         # Production packaging script for Vercel
├── dev_server.py    # Local clean-URL development server
├── vercel.json      # Production deployment configuration & security headers
└── sitemap.xml      # Search engine index with all tools & guides
```

---

## 💻 Local Development

Run the clean-URL development server using Python:

```bash
python dev_server.py
```

Then open `http://localhost:3000` in your browser.

---

## 📦 Building for Production

To package all static assets into `dist/`:

```bash
node build.js
```

---

## 🔒 Security & Privacy

QuickConvert enforces strict security headers:
* **Content-Security-Policy (CSP)**: Strict resource isolation.
* **Permissions-Policy**: Restricts camera, microphone, geolocation, and payment APIs.
* **Zero Telemetry on Files**: Your files and documents are processed in memory and never transmitted over the network.

---

## 📄 License

Created and maintained by [Alok Maurya](https://github.com/Alok8470). Released under the MIT License.
