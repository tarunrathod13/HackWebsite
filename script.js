let scene, camera, renderer, stars, bombs, ship, asteroids, satellites, blackHole;
let mouseX = 0, mouseY = 0;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Create stars (unchanged)
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.02,
        transparent: true
    });

    const starsVertices = [];
    for (let i = 0; i < 15000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = -Math.random() * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create bombs (unchanged)
    bombs = new THREE.Group();
    const bombGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const bombMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    for (let i = 0; i < 50; i++) {
        const bomb = new THREE.Mesh(bombGeometry, bombMaterial);
        bomb.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        bombs.add(bomb);
    }
    scene.add(bombs);

    // Create spaceship (unchanged)
    const shipGeometry = new THREE.ConeGeometry(0.2, 0.5, 32);
    const shipMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    ship = new THREE.Mesh(shipGeometry, shipMaterial);
    ship.rotation.x = Math.PI / 2;
    scene.add(ship);

    // Create asteroids
    asteroids = new THREE.Group();
    const asteroidGeometry = new THREE.DodecahedronGeometry(0.2, 0);
    const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 });

    for (let i = 0; i < 20; i++) {
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        asteroid.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
        );
        asteroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        asteroid.scale.setScalar(Math.random() * 0.5 + 0.5);
        asteroids.add(asteroid);
    }
    scene.add(asteroids);

    // Create satellites
    satellites = new THREE.Group();
    const satelliteGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.1);
    const satelliteMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 });

    for (let i = 0; i < 5; i++) {
        const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
        satellite.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
        );
        satellites.add(satellite);
    }
    scene.add(satellites);

    // Create black hole
    const blackHoleGeometry = new THREE.SphereGeometry(1, 32, 32);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    blackHole.position.set(5, 0, -10);
    scene.add(blackHole);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    camera.position.z = 5;

    document.addEventListener('mousemove', onMouseMove);

    animate();
}

function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate stars
    stars.rotation.y += 0.0001;

    // Animate bombs
    bombs.children.forEach((bomb, index) => {
        bomb.position.z += 0.01;
        if (bomb.position.z > 5) {
            bomb.position.z = -5;
        }
        bomb.rotation.x += 0.02;
        bomb.rotation.y += 0.02;
    });

    // Move ship based on mouse position
    gsap.to(ship.position, {
        duration: 0.3,
        x: mouseX,
        y: -mouseY
    });

    // Rotate ship for effect
    ship.rotation.z = -mouseX * 0.2;
    ship.rotation.x = Math.PI / 2 + mouseY * 0.2;

    // Animate asteroids
    asteroids.children.forEach((asteroid, index) => {
        asteroid.rotation.x += 0.01 * (index % 3 + 1);
        asteroid.rotation.y += 0.01 * (index % 3 + 1);
        asteroid.position.z += 0.005 * Math.sin(Date.now() * 0.001 + index);
    });

    // Animate satellites
    satellites.children.forEach((satellite, index) => {
        satellite.rotation.y += 0.02;
        satellite.position.x = Math.cos(Date.now() * 0.001 + index) * 3;
        satellite.position.y = Math.sin(Date.now() * 0.001 + index) * 3;
    });

    // Animate black hole
    blackHole.rotation.y += 0.005;
    const blackHoleScale = 1 + 0.1 * Math.sin(Date.now() * 0.002);
    blackHole.scale.set(blackHoleScale, blackHoleScale, blackHoleScale);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();

// Add some GSAP animations
gsap.to(camera.position, {
    duration: 10,
    z: 10,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut"
});

gsap.to(bombs.rotation, {
    duration: 20,
    x: Math.PI * 2,
    y: Math.PI * 2,
    repeat: -1,
    ease: "none"
});

// New GSAP animation for the black hole
gsap.to(blackHole.position, {
    duration: 30,
    x: -5,
    y: 3,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut"
});