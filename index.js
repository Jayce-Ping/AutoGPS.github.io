// Responsive navigation menu
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle navigation menu
            nav.classList.toggle('nav-active');
            
            // Navigation link animation
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            
            // Burger menu animation
            burger.classList.toggle('toggle');
        });
    }

    // Smooth scroll to anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Demo functionality
    const startDemoBtn = document.getElementById('start-demo');
    const webcam = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    
    if (startDemoBtn && webcam && canvas) {
        let streaming = false;
        const ctx = canvas.getContext('2d');
        
        startDemoBtn.addEventListener('click', () => {
            if (!streaming) {
                // Request camera permissions
                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then(stream => {
                        webcam.srcObject = stream;
                        webcam.play();
                        streaming = true;
                        startDemoBtn.textContent = 'Stop Demo';
                        
                        // Start processing video frames
                        processVideo();
                    })
                    .catch(err => {
                        console.error("Cannot access camera: ", err);
                        alert("Cannot access camera. Please ensure you allow browser camera access and refresh the page.");
                    });
            } else {
                // Stop video stream
                const stream = webcam.srcObject;
                const tracks = stream.getTracks();
                
                tracks.forEach(track => track.stop());
                webcam.srcObject = null;
                streaming = false;
                startDemoBtn.textContent = 'Start Demo';
                
                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
        
        function processVideo() {
            if (!streaming) return;
            
            // Ensure canvas size matches video
            canvas.width = webcam.videoWidth;
            canvas.height = webcam.videoHeight;
            
            // Draw video frame to canvas
            ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);
            
            // Get selected demo type
            const demoType = document.querySelector('input[name="demo"]:checked').id;
            
            // Apply different visual effects based on demo type
            switch(demoType) {
                case 'face-detection':
                    // Simulate face detection effect
                    drawFaceDetection();
                    break;
                case 'object-detection':
                    // Simulate object recognition effect
                    drawObjectDetection();
                    break;
                case 'segmentation':
                    // Simulate image segmentation effect
                    drawSegmentation();
                    break;
            }
            
            // Continue processing next frame
            requestAnimationFrame(processVideo);
        }
        
        // Simulated visual effect functions
        function drawFaceDetection() {
            // This is just a simulation effect
            // In a real application, this would run face detection algorithms
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 3;
            
            // Simulate drawing a face box in the center of the screen
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const width = canvas.width / 4;
            const height = canvas.height / 3;
            
            ctx.strokeRect(centerX - width / 2, centerY - height / 2, width, height);
            
            // Add label
            ctx.font = '20px Arial';
            ctx.fillStyle = '#3498db';
            ctx.fillText('Face', centerX - width / 2, centerY - height / 2 - 10);
        }
        
        function drawObjectDetection() {
            // Simulate object detection effect
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 3;
            
            // Simulate detecting several objects
            const objects = [
                { x: canvas.width / 4, y: canvas.height / 4, w: 100, h: 100, label: 'Object 1' },
                { x: canvas.width * 3/5, y: canvas.height / 3, w: 120, h: 80, label: 'Object 2' },
                { x: canvas.width / 3, y: canvas.height * 2/3, w: 70, h: 90, label: 'Object 3' }
            ];
            
            objects.forEach(obj => {
                ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
                
                ctx.font = '18px Arial';
                ctx.fillStyle = '#e74c3c';
                ctx.fillText(obj.label, obj.x, obj.y - 10);
            });
        }
        
        function drawSegmentation() {
            // Simulate image segmentation effect
            // In a real application, this would color based on actual segmentation results
            
            // Get pixel data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Add semi-transparent colored overlays to simulate segmentation effect
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const index = (y * canvas.width + x) * 4;
                    
                    // Add different color masks based on pixel position
                    if (x < canvas.width / 3) {
                        // Region 1 - Add red
                        data[index + 0] = Math.min(255, data[index + 0] + 60);
                        data[index + 3] = 200; // Alpha transparency
                    } else if (x < canvas.width * 2/3) {
                        // Region 2 - Add green
                        data[index + 1] = Math.min(255, data[index + 1] + 60);
                        data[index + 3] = 200;
                    } else {
                        // Region 3 - Add blue
                        data[index + 2] = Math.min(255, data[index + 2] + 60);
                        data[index + 3] = 200;
                    }
                }
            }
            
            // Update canvas
            ctx.putImageData(imageData, 0, 0);
            
            // Add legend
            const legends = [
                { color: 'rgba(255,60,60,0.7)', label: 'Person' },
                { color: 'rgba(60,255,60,0.7)', label: 'Background' },
                { color: 'rgba(60,60,255,0.7)', label: 'Object' }
            ];
            
            ctx.font = '16px Arial';
            legends.forEach((legend, i) => {
                const y = 30 + i * 30;
                
                ctx.fillStyle = legend.color;
                ctx.fillRect(20, y - 15, 20, 20);
                
                ctx.fillStyle = 'white';
                ctx.fillText(legend.label, 50, y);
            });
        }
    }

    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {threshold: 0.1});

    document.querySelectorAll('.section > *:not(.section-header)').forEach(elem => {
        elem.classList.add('hidden');
        observer.observe(elem);
    });
});

// Add page loading progress effect
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'loader-container';
    loader.innerHTML = `
        <div class="loader"></div>
        <p>Loading...</p>
    `;
    document.body.prepend(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 1000);
});