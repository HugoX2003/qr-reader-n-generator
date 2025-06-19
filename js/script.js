document.addEventListener('DOMContentLoaded', function() {
    // DOM elements - Generador
    const qrInput = document.getElementById('qr-input');
    const qrSize = document.getElementById('qr-size');
    const errorCorrection = document.getElementById('error-correction');
    const generateBtn = document.getElementById('generate-btn');
    const qrCodeDiv = document.getElementById('qr-code');
    const qrActions = document.getElementById('qr-actions');
    const downloadBtn = document.getElementById('download-btn');
    const downloadSvgBtn = document.getElementById('download-svg-btn');
    
    // DOM elements - Lector
    const startScannerBtn = document.getElementById('start-scanner');
    const stopScannerBtn = document.getElementById('stop-scanner');
    const scannerVideo = document.getElementById('scanner-video');
    const scannerCanvas = document.getElementById('scanner-canvas');
    const resultText = document.getElementById('result-text');
    const resultActions = document.querySelector('.result-actions');
    const copyResultBtn = document.getElementById('copy-result');
    const openLinkBtn = document.getElementById('open-link');
    
    // DOM elements - Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Colores por defecto para el QR
    const qrColor = '#000000';
    const qrBgColor = '#FFFFFF';
    
    // QR code instance
    let qrCode = null;
    
    // Scanner variables
    let videoStream = null;
    let scannerActive = false;
    let scanInterval = null;
    
    // Tab switching functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
            
            // Stop scanner when switching to generator tab
            if (tabId === 'generator' && scannerActive) {
                stopScanner();
            }
        });
    });
    
    // ======== FUNCIONES DEL GENERADOR ========
    
    // Generate QR code function
    function generateQRCode() {
        const text = qrInput.value.trim();
        
        if (!text) {
            alert('Ingresa algo para generar el código QR. No seas huevón.');
            return;
        }
        
        // Clear previous QR code
        qrCodeDiv.innerHTML = '';
        
        // Create new QR code
        qrCode = new QRCode(qrCodeDiv, {
            text: text,
            width: parseInt(qrSize.value),
            height: parseInt(qrSize.value),
            colorDark: qrColor,
            colorLight: qrBgColor,
            correctLevel: QRCode.CorrectLevel[errorCorrection.value]
        });
        
        // Add fade-in animation
        qrCodeDiv.classList.add('fade-in');
        
        // Show actions
        qrActions.style.display = 'flex';
        
        // Update history to enable back/forward functionality
        updateURLParams();
    }
    
    // Update URL parameters for sharing/bookmarking
    function updateURLParams() {
        const params = new URLSearchParams();
        params.set('text', qrInput.value);
        params.set('size', qrSize.value);
        params.set('errorcorrection', errorCorrection.value);
        
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }
    
    // Load QR code from URL parameters if any
    function loadFromURLParams() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('text')) {
            qrInput.value = params.get('text');
            
            if (params.has('size')) {
                qrSize.value = params.get('size');
            }
            
            if (params.has('errorcorrection')) {
                errorCorrection.value = params.get('errorcorrection');
            }
            
            // Generate QR code with the parameters
            generateQRCode();
        }
    }
    
    // Download QR code as PNG
    function downloadQRCode() {
        if (!qrCode) return;
        
        // Get canvas from QR code
        const canvas = qrCodeDiv.querySelector('canvas');
        
        if (canvas) {
            // Create temporary link
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
    // Download QR code as SVG
    function downloadQRCodeAsSVG() {
        if (!qrCode) return;
        
        // Get SVG from QR code or create one
        let svg = qrCodeDiv.querySelector('svg');
        
        if (!svg) {
            // If no SVG exists, create one from the canvas
            const canvas = qrCodeDiv.querySelector('canvas');
            if (!canvas) return;
            
            // Create SVG
            const size = parseInt(qrSize.value);
            const svgNS = "http://www.w3.org/2000/svg";
            svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("width", size);
            svg.setAttribute("height", size);
            svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
            
            // Add background
            const bg = document.createElementNS(svgNS, "rect");
            bg.setAttribute("width", size);
            bg.setAttribute("height", size);
            bg.setAttribute("fill", qrBgColor);
            svg.appendChild(bg);
            
            // Get QR code data from canvas
            const ctx = canvas.getContext('2d');
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imgData.data;
            const pixelSize = size / canvas.width;
            
            // Create group for all QR code squares
            const group = document.createElementNS(svgNS, "g");
            group.setAttribute("fill", qrColor);
            
            // Add each QR code pixel as a rect
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;
                    // If pixel is dark (non-white)
                    if (pixels[i] < 128) {
                        const rect = document.createElementNS(svgNS, "rect");
                        rect.setAttribute("x", x * pixelSize);
                        rect.setAttribute("y", y * pixelSize);
                        rect.setAttribute("width", pixelSize);
                        rect.setAttribute("height", pixelSize);
                        group.appendChild(rect);
                    }
                }
            }
            
            svg.appendChild(group);
        }
        
        // Convert SVG to blob and download
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = 'qrcode.svg';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup
        URL.revokeObjectURL(url);
    }
    
    // ======== READER FUNCTIONS ========
    
    // Start QR scanner
    async function startScanner() {
        try {
            // Request camera access
            videoStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "environment" } 
            });
            
            // Set video source and play
            scannerVideo.srcObject = videoStream;
            await scannerVideo.play();
            
            // Update UI
            startScannerBtn.style.display = 'none';
            stopScannerBtn.style.display = 'inline-flex';
            
            // Set scanner as active
            scannerActive = true;
            
            // Setup canvas for scanning
            const canvas = scannerCanvas;
            const ctx = canvas.getContext('2d');
            
            // Set canvas size based on video feed
            canvas.width = scannerVideo.videoWidth;
            canvas.height = scannerVideo.videoHeight;
            
            // Start scanning for QR codes
            scanInterval = setInterval(() => {
                if (scannerActive) {
                    // Draw current video frame to canvas for processing
                    ctx.drawImage(scannerVideo, 0, 0, canvas.width, canvas.height);
                    
                    // Get image data for QR detection
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    
                    // Process image with jsQR
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });
                    
                    // If a QR code is found
                    if (code) {
                        // Stop scanning once a code is found
                        clearInterval(scanInterval);
                        stopScanner();
                        
                        // Display the result
                        handleScanResult(code.data);
                    }
                }
            }, 250); // Check every 250ms for QR codes
            
        } catch (error) {
            console.error("Error al acceder a la cámara:", error);
            alert("No se pudo acceder a la cámara. Danos permisos para verte papi.");
        }
    }
    
    // Stop QR scanner
    function stopScanner() {
        // Clear scanning interval
        if (scanInterval) {
            clearInterval(scanInterval);
        }
        
        // Stop all tracks in video stream
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
        
        // Update UI
        scannerVideo.srcObject = null;
        startScannerBtn.style.display = 'inline-flex';
        stopScannerBtn.style.display = 'none';
        scannerActive = false;
    }
    
    // Handle QR scan result
    function handleScanResult(data) {
        // Display the result
        resultText.textContent = data;
        
        // Show action buttons
        resultActions.style.display = 'flex';
        
        // Update open link button if result is a URL
        if (isValidUrl(data)) {
            openLinkBtn.href = data;
            openLinkBtn.style.display = 'inline-flex';
        } else {
            openLinkBtn.style.display = 'none';
        }
    }
    
    // Copy result to clipboard
    function copyToClipboard() {
        navigator.clipboard.writeText(resultText.textContent)
            .then(() => {
                alert("Copiado al portapapeles");
            })
            .catch(err => {
                console.error("No se pudo copiar: ", err);
            });
    }
    
    // Check if string is a valid URL
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    // ======== EVENT LISTENERS ========
    
    // Generator event listeners
    generateBtn.addEventListener('click', generateQRCode);
    
    qrInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateQRCode();
        }
    });
    
    downloadBtn.addEventListener('click', downloadQRCode);
    downloadSvgBtn.addEventListener('click', downloadQRCodeAsSVG);
    
    // Reader event listeners
    startScannerBtn.addEventListener('click', startScanner);
    stopScannerBtn.addEventListener('click', stopScanner);
    copyResultBtn.addEventListener('click', copyToClipboard);
    
    // Load from URL parameters on page load
    loadFromURLParams();
});