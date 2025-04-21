
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');
            if (body.classList.contains('light-theme')) {
                icon.classList.replace('fa-moon', 'fa-sun');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
            }
        });

        if (localStorage.getItem('theme') === 'light') {
            body.classList.add('light-theme');
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            const theme = body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
        });

        window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    document.querySelector('.scroll-progress').style.width = `${scrollProgress}%`;
    
    const backToTop = document.querySelector('.back-to-top');
    const shouldShow = window.pageYOffset > 300;
    backToTop.style.opacity = shouldShow ? '1' : '0';
    backToTop.style.visibility = shouldShow ? 'visible' : 'hidden';
});

document.querySelector('.back-to-top').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

        const skillProgress = document.querySelectorAll('.skill-progress');
        const skillsSection = document.getElementById('skills');

        function animateSkills() {
            skillProgress.forEach(progress => {
                if (isElementInViewport(progress)) {
                    progress.style.width = progress.style.width;
                }
            });
        }

        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        window.addEventListener('scroll', animateSkills);
        animateSkills();

        const contactForm = document.getElementById('contactForm');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
                alert('Per favore compila tutti i campi obbligatori.');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Per favore inserisci un indirizzo email valido.');
                return;
            }
            
            alert('Grazie per il tuo messaggio! Ti risponderò al più presto.');
            contactForm.reset();
        });

        const cursorTrail = document.createElement('div');
        cursorTrail.className = 'cursor-trail';
        document.body.appendChild(cursorTrail);

        let mouseX = 0;
        let mouseY = 0;
        let trailX = 0;
        let trailY = 0;
        let isMouseMoving = false;
        let mouseStopTimeout;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isMouseMoving) {
                cursorTrail.style.opacity = '1';
                isMouseMoving = true;
            }
            
            clearTimeout(mouseStopTimeout);
            mouseStopTimeout = setTimeout(() => {
                cursorTrail.style.opacity = '0';
                isMouseMoving = false;
            }, 500);
        });

        function animateCursorTrail() {
            trailX += (mouseX - trailX) * 0.1;
            trailY += (mouseY - trailY) * 0.1;
            
            cursorTrail.style.left = `${trailX}px`;
            cursorTrail.style.top = `${trailY}px`;
            
            requestAnimationFrame(animateCursorTrail);
        }

        animateCursorTrail();

        document.addEventListener('mousedown', () => {
            cursorTrail.style.width = '15px';
            cursorTrail.style.height = '15px';
        });

        document.addEventListener('mouseup', () => {
            cursorTrail.style.width = '20px';
            cursorTrail.style.height = '20px';
        });

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('particle-canvas'),
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);
        const sizeArray = new Float32Array(particlesCount);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
            colorArray[i] = Math.random();
        }
        
        for(let i = 0; i < particlesCount; i++) {
            sizeArray[i] = Math.random() * 0.5 + 0.1;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 5;

        const mouse = new THREE.Vector2();
        const target = new THREE.Vector2();
        const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

        document.addEventListener('mousemove', (e) => {
            mouse.x = (e.clientX - windowHalf.x) / windowHalf.x;
            mouse.y = (e.clientY - windowHalf.y) / windowHalf.y;
        });

        function animate() {
            requestAnimationFrame(animate);
            
            target.x = mouse.x * 0.5;
            target.y = mouse.y * 0.5;
            
            camera.position.x += (target.x - camera.position.x) * 0.05;
            camera.position.y += (-target.y - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            particlesMesh.rotation.x += 0.001;
            particlesMesh.rotation.y += 0.002;
            
            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            windowHalf.set(window.innerWidth / 2, window.innerHeight / 2);
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    document.querySelector(`.nav-link[href="${targetId}"]`).classList.add('active');
                }
            });
        });

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            
            document.querySelectorAll('section').forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });

        document.querySelectorAll('.tooltip').forEach(tooltip => {
            tooltip.addEventListener('mouseenter', function() {
                const tooltipText = this.querySelector('.tooltiptext');
                tooltipText.style.opacity = '1';
                tooltipText.style.visibility = 'visible';
            });
            
            tooltip.addEventListener('mouseleave', function() {
                const tooltipText = this.querySelector('.tooltiptext');
                tooltipText.style.opacity = '0';
                tooltipText.style.visibility = 'hidden';
            });
        });
        document.querySelector('.chat-toggle').addEventListener('click', function (e) {
            e.preventDefault();
            const chatbot = document.querySelector('.chatbot-container');
            if (chatbot) {
              chatbot.style.display = chatbot.style.display === 'none' ? 'block' : 'none';
            }
          });

    const toggleBtn = document.querySelector('.chat-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener("DOMContentLoaded", function () {
        const toggleBtn = document.querySelector('.chat-toggle');
        const chatbotContainer = document.querySelector('.chatbot-container');
    
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            chatbotContainer.style.display = 
                chatbotContainer.style.display === 'block' ? 'none' : 'block';
        });
    });
        
    