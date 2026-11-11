/**
 * QuickConvert - Universal Client-Side Converter Suite
 * 100% In-Browser Processing (Zero Server Uploads)
 */

(function () {
  'use strict';

  // ==========================================
  // 1. UTILITY HELPERS & TOAST NOTIFICATIONS
  // ==========================================

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `animate-toast flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
      type === 'success'
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
        : type === 'error'
        ? 'bg-rose-50 border-rose-200 text-rose-800'
        : 'bg-indigo-50 border-indigo-200 text-indigo-800'
    }`;

    const iconClass =
      type === 'success'
        ? 'fa-solid fa-circle-check text-emerald-500'
        : type === 'error'
        ? 'fa-solid fa-circle-exclamation text-rose-500'
        : 'fa-solid fa-circle-info text-indigo-500';

    toast.innerHTML = `
      <i class="${iconClass} text-lg"></i>
      <span class="flex-1">${message}</span>
      <button class="text-slate-400 hover:text-slate-600 transition p-1" aria-label="Close Notification">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    toast.querySelector('button').addEventListener('click', () => {
      toast.remove();
    });

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================
  // 2. TOOL TABS & NAVIGATION
  // ==========================================

  const toolTabs = document.querySelectorAll('[data-tool-target]');
  const toolSections = document.querySelectorAll('.tool-panel');

  function switchTool(targetId) {
    // Hide all tool panels
    toolSections.forEach((section) => {
      section.classList.add('hidden');
    });

    // Show target tool panel
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
    }

    // Update active tab styles
    toolTabs.forEach((tab) => {
      const isCurrent = tab.getAttribute('data-tool-target') === targetId;
      if (isCurrent) {
        tab.classList.add('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-200');
        tab.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      } else {
        tab.classList.remove('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-200');
        tab.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      }
    });

    // Update URL hash without jumping
    if (history.replaceState) {
      history.replaceState(null, null, `#${targetId}`);
    }
  }

  toolTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const target = tab.getAttribute('data-tool-target');
      switchTool(target);
    });
  });

  // Handle direct hash navigation
  if (window.location.hash) {
    const initialTarget = window.location.hash.replace('#', '');
    if (document.getElementById(initialTarget)) {
      switchTool(initialTarget);
    }
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // ==========================================
  // 3. TOOL 1: PNG / JPG TO PDF CONVERTER
  // ==========================================

  let imagesToPdfList = [];
  const imgDropzone = document.getElementById('img2pdf-dropzone');
  const imgInput = document.getElementById('img2pdf-input');
  const imgListContainer = document.getElementById('img2pdf-list');
  const imgCountBadge = document.getElementById('img2pdf-count');
  const imgClearBtn = document.getElementById('img2pdf-clear-btn');
  const imgConvertBtn = document.getElementById('img2pdf-convert-btn');
  const imgProgressContainer = document.getElementById('img2pdf-progress-wrap');
  const imgProgressBar = document.getElementById('img2pdf-progress-bar');
  const imgProgressText = document.getElementById('img2pdf-progress-text');
  const imgOrientationSelect = document.getElementById('img2pdf-orientation');
  const imgMarginSelect = document.getElementById('img2pdf-margin');
  const imgPageSizeSelect = document.getElementById('img2pdf-pagesize');

  function renderImageGrid() {
    if (!imgListContainer) return;
    imgListContainer.innerHTML = '';

    if (imagesToPdfList.length === 0) {
      imgCountBadge.textContent = '0 images selected';
      imgConvertBtn.disabled = true;
      imgClearBtn.classList.add('hidden');
      return;
    }

    imgCountBadge.textContent = `${imagesToPdfList.length} image${imagesToPdfList.length > 1 ? 's' : ''} ready`;
    imgConvertBtn.disabled = false;
    imgClearBtn.classList.remove('hidden');

    imagesToPdfList.forEach((item, index) => {
      const card = document.createElement('div');
      card.className =
        'relative group bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition flex flex-col justify-between';
      card.innerHTML = `
        <div class="relative w-full h-32 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center mb-2">
          <img src="${item.dataUrl}" alt="${item.name}" class="w-full h-full object-contain" />
          <span class="absolute bottom-1 left-1 bg-slate-900/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
            Page ${index + 1}
          </span>
        </div>
        <div class="flex-1 min-w-0 mb-2">
          <p class="text-xs font-semibold text-slate-800 truncate" title="${item.name}">${item.name}</p>
          <p class="text-[11px] text-slate-500 font-mono">${formatBytes(item.size)} • ${item.width}×${item.height}px</p>
        </div>
        <div class="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
          <div class="flex items-center gap-1">
            <button class="btn-move-up p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none" ${
              index === 0 ? 'disabled' : ''
            } title="Move Earlier">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button class="btn-move-down p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none" ${
              index === imagesToPdfList.length - 1 ? 'disabled' : ''
            } title="Move Later">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
          <button class="btn-remove p-1 text-slate-400 hover:text-rose-600 transition" title="Remove image">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;

      // Handlers
      card.querySelector('.btn-remove').addEventListener('click', () => {
        imagesToPdfList.splice(index, 1);
        renderImageGrid();
      });

      const moveUpBtn = card.querySelector('.btn-move-up');
      if (moveUpBtn) {
        moveUpBtn.addEventListener('click', () => {
          if (index > 0) {
            const temp = imagesToPdfList[index];
            imagesToPdfList[index] = imagesToPdfList[index - 1];
            imagesToPdfList[index - 1] = temp;
            renderImageGrid();
          }
        });
      }

      const moveDownBtn = card.querySelector('.btn-move-down');
      if (moveDownBtn) {
        moveDownBtn.addEventListener('click', () => {
          if (index < imagesToPdfList.length - 1) {
            const temp = imagesToPdfList[index];
            imagesToPdfList[index] = imagesToPdfList[index + 1];
            imagesToPdfList[index + 1] = temp;
            renderImageGrid();
          }
        });
      }

      imgListContainer.appendChild(card);
    });
  }

  function handleImageFiles(files) {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const fileList = Array.from(files).filter((file) => validTypes.includes(file.type));

    if (fileList.length === 0) {
      showToast('Please upload valid PNG, JPG, or WEBP images.', 'error');
      return;
    }

    let loadedCount = 0;
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          imagesToPdfList.push({
            id: Math.random().toString(36).substring(2, 9),
            file: file,
            name: file.name,
            size: file.size,
            dataUrl: e.target.result,
            width: img.naturalWidth,
            height: img.naturalHeight,
            format: file.type.includes('png') ? 'PNG' : 'JPEG',
          });
          loadedCount++;
          if (loadedCount === fileList.length) {
            renderImageGrid();
            showToast(`Added ${fileList.length} image(s) to queue.`, 'success');
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  if (imgDropzone && imgInput) {
    imgDropzone.addEventListener('click', () => imgInput.click());

    imgInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        handleImageFiles(e.target.files);
        imgInput.value = '';
      }
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      imgDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        imgDropzone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      imgDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        imgDropzone.classList.remove('drag-active');
      });
    });

    imgDropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files.length) {
        handleImageFiles(dt.files);
      }
    });
  }

  if (imgClearBtn) {
    imgClearBtn.addEventListener('click', () => {
      imagesToPdfList = [];
      renderImageGrid();
      showToast('Image queue cleared.', 'info');
    });
  }

  // Convert Images to PDF via jsPDF
  if (imgConvertBtn) {
    imgConvertBtn.addEventListener('click', async () => {
      if (imagesToPdfList.length === 0) return;

      if (!window.jspdf || !window.jspdf.jsPDF) {
        showToast('PDF compilation library is loading. Please retry in a moment.', 'error');
        return;
      }

      imgConvertBtn.disabled = true;
      imgProgressContainer.classList.remove('hidden');
      imgProgressBar.style.width = '10%';
      imgProgressText.textContent = 'Initializing PDF document...';

      try {
        const { jsPDF } = window.jspdf;
        const orientationChoice = imgOrientationSelect ? imgOrientationSelect.value : 'auto';
        const pageSize = imgPageSizeSelect ? imgPageSizeSelect.value : 'a4';
        const margin = parseInt(imgMarginSelect ? imgMarginSelect.value : '10', 10);

        // Reference dimensions in mm for standard sizes
        const standardSizes = {
          a4: { width: 210, height: 297 },
          letter: { width: 215.9, height: 279.4 },
        };

        let pdf = null;

        for (let i = 0; i < imagesToPdfList.length; i++) {
          const item = imagesToPdfList[i];
          const progressPercent = Math.round(((i + 1) / imagesToPdfList.length) * 90);
          imgProgressBar.style.width = `${progressPercent}%`;
          imgProgressText.textContent = `Compiling page ${i + 1} of ${imagesToPdfList.length}...`;

          // Calculate page orientation
          let pageOrientation = 'portrait';
          if (orientationChoice === 'auto') {
            pageOrientation = item.width > item.height ? 'landscape' : 'portrait';
          } else {
            pageOrientation = orientationChoice;
          }

          let pWidth, pHeight;
          if (pageSize === 'fit') {
            // Fit page exactly to image with 72 dpi ratio
            const pxToMm = 0.264583;
            pWidth = item.width * pxToMm + margin * 2;
            pHeight = item.height * pxToMm + margin * 2;
          } else {
            const baseSize = standardSizes[pageSize] || standardSizes.a4;
            pWidth = pageOrientation === 'landscape' ? baseSize.height : baseSize.width;
            pHeight = pageOrientation === 'landscape' ? baseSize.width : baseSize.height;
          }

          if (i === 0) {
            pdf = new jsPDF({
              orientation: pageOrientation,
              unit: 'mm',
              format: pageSize === 'fit' ? [pWidth, pHeight] : pageSize,
            });
          } else {
            pdf.addPage(pageSize === 'fit' ? [pWidth, pHeight] : pageSize, pageOrientation);
          }

          // Calculate image placement maintaining aspect ratio
          const usableWidth = pWidth - margin * 2;
          const usableHeight = pHeight - margin * 2;

          const imgAspect = item.width / item.height;
          const usableAspect = usableWidth / usableHeight;

          let renderW, renderH, posX, posY;

          if (imgAspect > usableAspect) {
            renderW = usableWidth;
            renderH = usableWidth / imgAspect;
            posX = margin;
            posY = margin + (usableHeight - renderH) / 2;
          } else {
            renderH = usableHeight;
            renderW = usableHeight * imgAspect;
            posY = margin;
            posX = margin + (usableWidth - renderW) / 2;
          }

          pdf.addImage(item.dataUrl, item.format, posX, posY, renderW, renderH, undefined, 'FAST');

          // Minimal delay to yield to UI thread
          await new Promise((r) => setTimeout(r, 20));
        }

        imgProgressBar.style.width = '100%';
        imgProgressText.textContent = 'Generating PDF download...';

        setTimeout(() => {
          pdf.save(`QuickConvert_${Date.now()}.pdf`);
          imgProgressContainer.classList.add('hidden');
          imgConvertBtn.disabled = false;
          showToast(`PDF compiled successfully with ${imagesToPdfList.length} pages!`, 'success');
        }, 300);
      } catch (err) {
        console.error('PDF Generation Error:', err);
        showToast('Error generating PDF document. Please try again.', 'error');
        imgProgressContainer.classList.add('hidden');
        imgConvertBtn.disabled = false;
      }
    });
  }

  // ==========================================
  // 4. TOOL 2: IMAGE COMPRESSOR & RESIZER
  // ==========================================

  let compOriginalImage = null;
  let compOriginalFile = null;
  let compAspectRatio = 1;
  let compCurrentBlob = null;

  const compDropzone = document.getElementById('comp-dropzone');
  const compInput = document.getElementById('comp-input');
  const compWorkspace = document.getElementById('comp-workspace');
  const compEmptyState = document.getElementById('comp-empty-state');
  const compResetBtn = document.getElementById('comp-reset-btn');

  const compOrigThumb = document.getElementById('comp-orig-thumb');
  const compOrigName = document.getElementById('comp-orig-name');
  const compOrigDims = document.getElementById('comp-orig-dims');
  const compOrigSize = document.getElementById('comp-orig-size');

  const compWidthInput = document.getElementById('comp-width');
  const compHeightInput = document.getElementById('comp-height');
  const compLockRatio = document.getElementById('comp-lock-ratio');
  const compQualitySlider = document.getElementById('comp-quality');
  const compQualityDisplay = document.getElementById('comp-quality-val');
  const compFormatSelect = document.getElementById('comp-format');

  const compResultDims = document.getElementById('comp-result-dims');
  const compResultSize = document.getElementById('comp-result-size');
  const compSavingsBadge = document.getElementById('comp-savings-badge');
  const compDownloadBtn = document.getElementById('comp-download-btn');
  const compResultPreview = document.getElementById('comp-result-preview');

  function loadCompressorImage(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }

    compOriginalFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        compOriginalImage = img;
        compAspectRatio = img.naturalWidth / img.naturalHeight;

        // Populate initial UI
        compOrigThumb.src = e.target.result;
        compOrigName.textContent = file.name;
        compOrigDims.textContent = `${img.naturalWidth} × ${img.naturalHeight} px`;
        compOrigSize.textContent = formatBytes(file.size);

        compWidthInput.value = img.naturalWidth;
        compHeightInput.value = img.naturalHeight;

        compEmptyState.classList.add('hidden');
        compWorkspace.classList.remove('hidden');

        processImageCompression();
        showToast('Image loaded into compressor!', 'success');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function processImageCompression() {
    if (!compOriginalImage) return;

    const targetWidth = parseInt(compWidthInput.value, 10) || compOriginalImage.naturalWidth;
    const targetHeight = parseInt(compHeightInput.value, 10) || compOriginalImage.naturalHeight;
    const quality = parseFloat(compQualitySlider.value) / 100;
    let format = compFormatSelect ? compFormatSelect.value : 'smart';

    // Show/hide PNG notice
    const pngNotice = document.getElementById('comp-png-notice');
    if (pngNotice) {
      if (format === 'image/png') {
        pngNotice.classList.remove('hidden');
      } else {
        pngNotice.classList.add('hidden');
      }
    }

    let exportMime = 'image/jpeg';

    if (format === 'smart') {
      // Smart Auto: If original is PNG, use WebP to preserve alpha channel while enabling quality compression!
      if (compOriginalFile && compOriginalFile.type === 'image/png') {
        exportMime = 'image/webp';
      } else {
        exportMime = 'image/jpeg';
      }
    } else if (format === 'original') {
      if (compOriginalFile && compOriginalFile.type === 'image/png') {
        exportMime = 'image/webp';
      } else {
        exportMime = compOriginalFile ? compOriginalFile.type : 'image/jpeg';
      }
    } else {
      exportMime = format;
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    // High quality canvas scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // If JPEG, draw pure white background to prevent black PNG transparency artifacts
    if (exportMime === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.drawImage(compOriginalImage, 0, 0, targetWidth, targetHeight);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        compCurrentBlob = blob;

        if (compResultPreview) {
          compResultPreview.src = URL.createObjectURL(blob);
        }

        compResultDims.textContent = `${targetWidth} × ${targetHeight} px`;
        compResultSize.textContent = formatBytes(blob.size);

        // Savings calculation
        const diff = compOriginalFile.size - blob.size;
        const percentage = Math.round((diff / compOriginalFile.size) * 100);

        if (percentage > 0) {
          compSavingsBadge.className =
            'px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800';
          compSavingsBadge.textContent = `-${percentage}% smaller`;
        } else if (percentage < 0) {
          compSavingsBadge.className =
            'px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800';
          compSavingsBadge.textContent = `+${Math.abs(percentage)}% larger`;
        } else {
          compSavingsBadge.className =
            'px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800';
          compSavingsBadge.textContent = `Same size`;
        }
      },
      exportMime,
      quality
    );
  }

  // Dimension inputs event listeners
  if (compWidthInput && compHeightInput) {
    compWidthInput.addEventListener('input', () => {
      if (compLockRatio.checked && compAspectRatio) {
        const w = parseInt(compWidthInput.value, 10);
        if (w > 0) {
          compHeightInput.value = Math.round(w / compAspectRatio);
        }
      }
      processImageCompression();
    });

    compHeightInput.addEventListener('input', () => {
      if (compLockRatio.checked && compAspectRatio) {
        const h = parseInt(compHeightInput.value, 10);
        if (h > 0) {
          compWidthInput.value = Math.round(h * compAspectRatio);
        }
      }
      processImageCompression();
    });
  }

  // Dimension scale presets
  document.querySelectorAll('[data-comp-scale]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!compOriginalImage) return;
      const scale = parseFloat(btn.getAttribute('data-comp-scale'));
      compWidthInput.value = Math.round(compOriginalImage.naturalWidth * scale);
      compHeightInput.value = Math.round(compOriginalImage.naturalHeight * scale);
      processImageCompression();
    });
  });

  if (compQualitySlider) {
    compQualitySlider.addEventListener('input', (e) => {
      compQualityDisplay.textContent = `${e.target.value}%`;
      processImageCompression();
    });
  }

  if (compFormatSelect) {
    compFormatSelect.addEventListener('change', processImageCompression);
  }

  if (compDropzone && compInput) {
    compDropzone.addEventListener('click', () => compInput.click());
    compInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        loadCompressorImage(e.target.files[0]);
        compInput.value = '';
      }
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      compDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        compDropzone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      compDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        compDropzone.classList.remove('drag-active');
      });
    });

    compDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer && e.dataTransfer.files.length) {
        loadCompressorImage(e.dataTransfer.files[0]);
      }
    });
  }

  if (compResetBtn) {
    compResetBtn.addEventListener('click', () => {
      compOriginalImage = null;
      compOriginalFile = null;
      compCurrentBlob = null;
      compWorkspace.classList.add('hidden');
      compEmptyState.classList.remove('hidden');
      showToast('Image reset.', 'info');
    });
  }

  const compSwitchSmartBtn = document.getElementById('comp-switch-smart-btn');
  if (compSwitchSmartBtn) {
    compSwitchSmartBtn.addEventListener('click', () => {
      if (compFormatSelect) {
        compFormatSelect.value = 'smart';
        processImageCompression();
        showToast('Switched to Smart Auto Compression (WebP)!', 'success');
      }
    });
  }

  if (compDownloadBtn) {
    compDownloadBtn.addEventListener('click', () => {
      if (!compCurrentBlob) return;

      let ext = 'jpg';
      if (compCurrentBlob.type === 'image/webp') ext = 'webp';
      else if (compCurrentBlob.type === 'image/png') ext = 'png';
      else if (compCurrentBlob.type === 'image/jpeg') ext = 'jpg';

      const originalBaseName = compOriginalFile
        ? compOriginalFile.name.substring(0, compOriginalFile.name.lastIndexOf('.')) || 'image'
        : 'quickconvert';

      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(compCurrentBlob);
      downloadLink.download = `${originalBaseName}_optimized.${ext}`;
      downloadLink.click();
      showToast(`Optimized image downloaded as .${ext}!`, 'success');
    });
  }

  // ==========================================
  // 5. TOOL 3: TEXT / MARKDOWN TO PDF CONVERTER
  // ==========================================

  const textInput = document.getElementById('text2pdf-input');
  const textTitleInput = document.getElementById('text2pdf-title');
  const textCharCount = document.getElementById('text2pdf-char-count');
  const textWordCount = document.getElementById('text2pdf-word-count');
  const textSampleBtn = document.getElementById('text2pdf-sample-btn');
  const textClearBtn = document.getElementById('text2pdf-clear-btn');
  const textFontSelect = document.getElementById('text2pdf-font');
  const textSizeSelect = document.getElementById('text2pdf-fontsize');
  const textMarginSelect = document.getElementById('text2pdf-margin');
  const textPageNumCheck = document.getElementById('text2pdf-pagenum');
  const textConvertBtn = document.getElementById('text2pdf-convert-btn');

  function updateTextStats() {
    if (!textInput) return;
    const val = textInput.value;
    textCharCount.textContent = `${val.length} chars`;
    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
    textWordCount.textContent = `${words} words`;
  }

  if (textInput) {
    textInput.addEventListener('input', updateTextStats);
  }

  if (textSampleBtn) {
    textSampleBtn.addEventListener('click', () => {
      textTitleInput.value = 'Annual Executive Project Summary';
      textInput.value = `# Executive Overview & Objectives\n\nThis comprehensive document outlines the quarterly technological milestones, efficiency benchmarks, and future strategic trajectories for the enterprise utility stack.\n\n### Core Value Propositions\n1. Lightning-fast client-side execution.\n2. Complete privacy and zero-trust infrastructure: documents never touch an external server.\n3. Universal platform compatibility across desktop, tablet, and mobile.\n\n### Security & Architecture\nBy offloading processing directly into the browser runtime using WebAssembly and modern HTML5 APIs, computational latency is reduced to near-zero while eliminating costly backend cloud infrastructure.\n\n### Conclusion\nDeploying privacy-first, serverless tools ensures maximum compliance with global data protection mandates (GDPR, CCPA) without compromising user experience or workflow throughput.\n\nGenerated with QuickConvert - High-Performance Online Document Suite.`;
      updateTextStats();
      showToast('Sample text inserted!', 'info');
    });
  }

  if (textClearBtn) {
    textClearBtn.addEventListener('click', () => {
      textTitleInput.value = '';
      textInput.value = '';
      updateTextStats();
      showToast('Editor cleared.', 'info');
    });
  }

  if (textConvertBtn) {
    textConvertBtn.addEventListener('click', () => {
      const content = textInput.value.trim();
      if (!content) {
        showToast('Please enter or paste some text to generate a PDF.', 'error');
        return;
      }

      if (!window.jspdf || !window.jspdf.jsPDF) {
        showToast('PDF compilation library is loading. Please retry.', 'error');
        return;
      }

      try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const font = textFontSelect ? textFontSelect.value : 'helvetica';
        const fontSize = parseInt(textSizeSelect ? textSizeSelect.value : '11', 10);
        const margin = parseInt(textMarginSelect ? textMarginSelect.value : '20', 10);
        const includePageNumbers = textPageNumCheck ? textPageNumCheck.checked : true;
        const customTitle = textTitleInput.value.trim();

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const contentWidth = pageWidth - margin * 2;

        let currentY = margin;

        // Render Title if present
        if (customTitle) {
          pdf.setFont(font, 'bold');
          pdf.setFontSize(fontSize + 8);
          pdf.setTextColor(30, 41, 59); // Slate 800
          pdf.text(customTitle, margin, currentY);
          currentY += fontSize * 0.5 + 4;

          // Title separator line
          pdf.setDrawColor(203, 213, 225); // Slate 300
          pdf.setLineWidth(0.4);
          pdf.line(margin, currentY, pageWidth - margin, currentY);
          currentY += 8;
        }

        // Body Text
        pdf.setFont(font, 'normal');
        pdf.setFontSize(fontSize);
        pdf.setTextColor(51, 65, 85); // Slate 700

        const lineHeight = fontSize * 0.45;
        const lines = pdf.splitTextToSize(content, contentWidth);

        lines.forEach((line) => {
          if (currentY + lineHeight > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
          }
          pdf.text(line, margin, currentY);
          currentY += lineHeight;
        });

        // Add page numbers if enabled
        if (includePageNumbers) {
          const totalPages = pdf.internal.getNumberOfPages();
          for (let p = 1; p <= totalPages; p++) {
            pdf.setPage(p);
            pdf.setFont(font, 'italic');
            pdf.setFontSize(9);
            pdf.setTextColor(148, 163, 184); // Slate 400
            pdf.text(`Page ${p} of ${totalPages} • QuickConvert`, pageWidth / 2, pageHeight - 8, {
              align: 'center',
            });
          }
        }

        pdf.save(`QuickConvert_Doc_${Date.now()}.pdf`);
        showToast('Document PDF downloaded successfully!', 'success');
      } catch (err) {
        console.error('Text to PDF error:', err);
        showToast('Failed to compile text into PDF. Please check content.', 'error');
      }
    });
  }

  // ==========================================
  // 6. TOOL 4: UNIVERSAL UNIT CONVERTER
  // ==========================================

  const unitData = {
    length: {
      name: 'Length & Distance',
      icon: 'fa-ruler-combined',
      base: 'meter',
      units: {
        meter: { name: 'Meters (m)', rate: 1 },
        kilometer: { name: 'Kilometers (km)', rate: 1000 },
        centimeter: { name: 'Centimeters (cm)', rate: 0.01 },
        millimeter: { name: 'Millimeters (mm)', rate: 0.001 },
        mile: { name: 'Miles (mi)', rate: 1609.344 },
        yard: { name: 'Yards (yd)', rate: 0.9144 },
        foot: { name: 'Feet (ft)', rate: 0.3048 },
        inch: { name: 'Inches (in)', rate: 0.0254 },
        nautical_mile: { name: 'Nautical Miles (NM)', rate: 1852 },
      },
    },
    weight: {
      name: 'Weight & Mass',
      icon: 'fa-weight-hanging',
      base: 'kilogram',
      units: {
        kilogram: { name: 'Kilograms (kg)', rate: 1 },
        gram: { name: 'Grams (g)', rate: 0.001 },
        milligram: { name: 'Milligrams (mg)', rate: 0.000001 },
        metric_ton: { name: 'Metric Tons (t)', rate: 1000 },
        pound: { name: 'Pounds (lb)', rate: 0.45359237 },
        ounce: { name: 'Ounces (oz)', rate: 0.028349523 },
        stone: { name: 'Stones (st)', rate: 6.35029318 },
      },
    },
    digital: {
      name: 'Digital Data Storage',
      icon: 'fa-hard-drive',
      base: 'byte',
      units: {
        byte: { name: 'Bytes (B)', rate: 1 },
        kilobyte: { name: 'Kilobytes (KB)', rate: 1024 },
        megabyte: { name: 'Megabytes (MB)', rate: 1048576 },
        gigabyte: { name: 'Gigabytes (GB)', rate: 1073741824 },
        terabyte: { name: 'Terabytes (TB)', rate: 1099511627776 },
        petabyte: { name: 'Petabytes (PB)', rate: 1125899906842624 },
      },
    },
    area: {
      name: 'Area',
      icon: 'fa-chart-area',
      base: 'sq_meter',
      units: {
        sq_meter: { name: 'Square Meters (m²)', rate: 1 },
        sq_kilometer: { name: 'Square Kilometers (km²)', rate: 1000000 },
        sq_foot: { name: 'Square Feet (ft²)', rate: 0.092903 },
        sq_mile: { name: 'Square Miles (mi²)', rate: 2589988.11 },
        acre: { name: 'Acres (ac)', rate: 4046.856422 },
        hectare: { name: 'Hectares (ha)', rate: 10000 },
      },
    },
    speed: {
      name: 'Speed & Velocity',
      icon: 'fa-gauge-high',
      base: 'mps',
      units: {
        mps: { name: 'Meters per second (m/s)', rate: 1 },
        kmh: { name: 'Kilometers per hour (km/h)', rate: 0.277777778 },
        mph: { name: 'Miles per hour (mph)', rate: 0.44704 },
        knot: { name: 'Knots (kn)', rate: 0.514444 },
        fps: { name: 'Feet per second (ft/s)', rate: 0.3048 },
      },
    },
    temperature: {
      name: 'Temperature',
      icon: 'fa-temperature-half',
      isTemp: true,
      units: {
        celsius: { name: 'Celsius (°C)' },
        fahrenheit: { name: 'Fahrenheit (°F)' },
        kelvin: { name: 'Kelvin (K)' },
      },
    },
  };

  let activeCategory = 'length';
  const unitCategoryContainer = document.getElementById('unit-categories');
  const unitFromInput = document.getElementById('unit-from-val');
  const unitToInput = document.getElementById('unit-to-val');
  const unitFromSelect = document.getElementById('unit-from-select');
  const unitToSelect = document.getElementById('unit-to-select');
  const unitSwapBtn = document.getElementById('unit-swap-btn');
  const unitFormulaText = document.getElementById('unit-formula-text');
  const unitCopyBtn = document.getElementById('unit-copy-btn');

  function renderCategoryButtons() {
    if (!unitCategoryContainer) return;
    unitCategoryContainer.innerHTML = '';

    Object.keys(unitData).forEach((catKey) => {
      const cat = unitData[catKey];
      const btn = document.createElement('button');
      btn.className = `px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition ${
        activeCategory === catKey
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
      }`;
      btn.innerHTML = `<i class="fa-solid ${cat.icon}"></i> ${cat.name}`;
      btn.addEventListener('click', () => {
        activeCategory = catKey;
        renderCategoryButtons();
        populateUnitSelectors();
        calculateConversion();
      });
      unitCategoryContainer.appendChild(btn);
    });
  }

  function populateUnitSelectors() {
    if (!unitFromSelect || !unitToSelect) return;
    const cat = unitData[activeCategory];
    const unitKeys = Object.keys(cat.units);

    unitFromSelect.innerHTML = '';
    unitToSelect.innerHTML = '';

    unitKeys.forEach((key) => {
      const optFrom = document.createElement('option');
      optFrom.value = key;
      optFrom.textContent = cat.units[key].name;
      unitFromSelect.appendChild(optFrom);

      const optTo = document.createElement('option');
      optTo.value = key;
      optTo.textContent = cat.units[key].name;
      unitToSelect.appendChild(optTo);
    });

    // Default select first and second items
    unitFromSelect.selectedIndex = 0;
    unitToSelect.selectedIndex = unitKeys.length > 1 ? 1 : 0;
  }

  function convertTemperature(value, from, to) {
    if (from === to) return value;
    let celsius;
    if (from === 'celsius') celsius = value;
    else if (from === 'fahrenheit') celsius = ((value - 32) * 5) / 9;
    else if (from === 'kelvin') celsius = value - 273.15;

    if (to === 'celsius') return celsius;
    if (to === 'fahrenheit') return (celsius * 9) / 5 + 32;
    if (to === 'kelvin') return celsius + 273.15;
    return value;
  }

  function calculateConversion() {
    if (!unitFromInput || !unitToInput) return;
    const inputVal = parseFloat(unitFromInput.value);

    if (isNaN(inputVal)) {
      unitToInput.value = '';
      unitFormulaText.textContent = 'Enter a valid numeric quantity to convert.';
      return;
    }

    const cat = unitData[activeCategory];
    const fromUnitKey = unitFromSelect.value;
    const toUnitKey = unitToSelect.value;

    let result = 0;

    if (cat.isTemp) {
      result = convertTemperature(inputVal, fromUnitKey, toUnitKey);
      unitFormulaText.textContent = `Formula: Custom Temperature Scale (${cat.units[fromUnitKey].name} to ${cat.units[toUnitKey].name})`;
    } else {
      const fromRate = cat.units[fromUnitKey].rate;
      const toRate = cat.units[toUnitKey].rate;
      // Convert to base, then base to target
      const inBase = inputVal * fromRate;
      result = inBase / toRate;

      // Clean ratio formula
      const ratio = fromRate / toRate;
      const formattedRatio = ratio >= 0.0001 && ratio <= 10000 ? ratio.toFixed(4) : ratio.toExponential(4);
      unitFormulaText.textContent = `1 ${cat.units[fromUnitKey].name.split(' ')[0]} = ${formattedRatio} ${
        cat.units[toUnitKey].name.split(' ')[0]
      }`;
    }

    // Format output intelligently
    const cleanOutput =
      Math.abs(result) < 0.000001 || Math.abs(result) > 1000000000
        ? result.toExponential(6)
        : parseFloat(result.toFixed(6));

    unitToInput.value = cleanOutput;
  }

  if (unitFromInput) {
    unitFromInput.addEventListener('input', calculateConversion);
  }

  if (unitFromSelect && unitToSelect) {
    unitFromSelect.addEventListener('change', calculateConversion);
    unitToSelect.addEventListener('change', calculateConversion);
  }

  if (unitSwapBtn) {
    unitSwapBtn.addEventListener('click', () => {
      const temp = unitFromSelect.value;
      unitFromSelect.value = unitToSelect.value;
      unitToSelect.value = temp;
      calculateConversion();
      showToast('Units swapped!', 'info');
    });
  }

  if (unitCopyBtn) {
    unitCopyBtn.addEventListener('click', () => {
      if (!unitToInput.value) return;
      navigator.clipboard
        .writeText(unitToInput.value)
        .then(() => showToast('Converted value copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy value.', 'error'));
    });
  }

  // ==========================================
  // 7. FAQ ACCORDION LOGIC
  // ==========================================

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = content.classList.contains('open');

        // Close other FAQs for cleaner single-focus reading
        faqItems.forEach((otherItem) => {
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherContent) {
            otherContent.classList.remove('open');
            otherContent.style.maxHeight = null;
          }
          if (otherIcon) {
            otherIcon.classList.remove('rotate-180');
          }
        });

        if (!isOpen) {
          content.classList.add('open');
          content.style.maxHeight = content.scrollHeight + 'px';
          if (icon) icon.classList.add('rotate-180');
        }
      });
    }
  });

  // ==========================================
  // 8. LEGAL & POLICY MODALS
  // ==========================================

  const modalTriggers = document.querySelectorAll('[data-modal-open]');
  const modalCloses = document.querySelectorAll('[data-modal-close]');
  const modals = document.querySelectorAll('.app-modal');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-open');
      openModal(modalId);
    });
  });

  modalCloses.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.app-modal');
      closeModal(modal);
    });
  });

  // Close modal when clicking outside background
  modals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // ESC key listener to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach((modal) => {
        if (!modal.classList.contains('hidden')) {
          closeModal(modal);
        }
      });
    }
  });

  // Contact form submission simulator
  const contactForm = document.getElementById('quickconvert-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const msg = document.getElementById('contact-message').value.trim();

      if (!name || !email || !msg) {
        showToast('Please fill out all required contact fields.', 'error');
        return;
      }

      showToast(`Thank you ${name}! Your inquiry has been dispatched.`, 'success');
      contactForm.reset();
      const modal = contactForm.closest('.app-modal');
      if (modal) closeModal(modal);
    });
  }

  // ==========================================
  // 9. INITIALIZATION
  // ==========================================

  function initApp() {
    renderCategoryButtons();
    populateUnitSelectors();
    calculateConversion();
    renderImageGrid();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
