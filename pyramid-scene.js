// Three.js Aztec Pyramid Scene
// Interactive 3D landing page with mouse-controlled perspective
// Updated to load external GLTF model

let scene, camera, renderer, pyramid;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let lastMouseMoveTime = 0;
let rotationPaused = false;
const ROTATION_PAUSE_DURATION = 10000; // 10 seconds in milliseconds
let scrollY = 0;
let pyramidBaseScale = 1;

// Initialize the scene
function initPyramidScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001a4d); // Deep blue background
    
    // Add fog for depth
    scene.fog = new THREE.Fog(0x001a4d, 10, 50);
    
    // Setup camera - positioned to view pyramid on the right side
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // Camera looking at center, pyramid far to the right
    camera.position.set(-10, 15, 35);
    camera.lookAt(0, 10, 0);
    
    // Setup renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add canvas to the page
    const canvas = renderer.domElement;
    canvas.id = 'pyramid-canvas';
    document.body.prepend(canvas);
    
    // Load the external GLTF pyramid model
    loadPyramidModel();
    
    // Add lighting
    setupLighting();
    
    // Ground plane removed per user request
    
    // Event listeners
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('scroll', onScroll);
    
    // Start animation loop
    animate();
}

// Load the GLTF pyramid model
function loadPyramidModel() {
    const loader = new THREE.GLTFLoader();
    
    loader.load(
        'scene.gltf',
        // Success callback
        function(gltf) {
            pyramid = gltf.scene;
            
            // Calculate bounding box to understand model size
            const box = new THREE.Box3().setFromObject(pyramid);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            
            console.log('Model size - X:', size.x, 'Y:', size.y, 'Z:', size.z);
            console.log('Model center - X:', center.x, 'Y:', center.y, 'Z:', center.z);
            
            // Center the model, then offset to the right
            pyramid.position.sub(center);
            
            console.log('Pyramid position BEFORE X offset:', pyramid.position.x, pyramid.position.y, pyramid.position.z);
            pyramid.position.x = 35; // Position FAR to the right (camera looks at 0)
            console.log('Pyramid position AFTER X offset:', pyramid.position.x, pyramid.position.y, pyramid.position.z);
            
            // Don't scale - use original size, or use a large target
            const targetHeight = 25; // Much larger to accommodate the model
            const scaleFactor = targetHeight / size.y;
            pyramidBaseScale = scaleFactor; // Store base scale for scroll effects
            pyramid.scale.set(scaleFactor, scaleFactor, scaleFactor);
            
            console.log('Applied scale factor:', scaleFactor);
            console.log('Final pyramid scale:', pyramid.scale);
            
            // Enable shadows for all meshes in the model
            pyramid.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    // Enhance material properties if needed
                    if (node.material) {
                        node.material.roughness = 0.9;
                        node.material.metalness = 0.1;
                    }
                }
            });
            
            scene.add(pyramid);
            console.log('Pyramid model loaded and centered successfully');
            console.log('FINAL pyramid world position:', pyramid.position);
            
            // Debug: Log the actual world position after adding to scene
            setTimeout(() => {
                pyramid.updateMatrixWorld();
                const worldPos = new THREE.Vector3();
                pyramid.getWorldPosition(worldPos);
                console.log('Pyramid WORLD position after scene add:', worldPos);
            }, 100);
        },
        // Progress callback
        function(xhr) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log('Model loading: ' + Math.round(percentComplete) + '%');
        },
        // Error callback
        function(error) {
            console.error('Error loading pyramid model:', error);
            // Fallback to procedural pyramid if model fails to load
            console.log('Loading fallback procedural pyramid...');
            pyramid = createFallbackPyramid();
            scene.add(pyramid);
        }
    );
}

// Fallback procedural pyramid (in case model loading fails)
function createFallbackPyramid() {
    const pyramidGroup = new THREE.Group();
    const levels = 6;
    const baseSize = 8;
    const stepHeight = 0.8;
    
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x8B7355,
        roughness: 0.9,
        metalness: 0.1
    });
    
    for (let i = 0; i < levels; i++) {
        const levelSize = baseSize - (i * 1.2);
        const geometry = new THREE.BoxGeometry(levelSize, stepHeight, levelSize);
        const step = new THREE.Mesh(geometry, material);
        step.position.y = i * stepHeight;
        step.castShadow = true;
        step.receiveShadow = true;
        pyramidGroup.add(step);
    }
    
    pyramidGroup.position.y = 0;
    return pyramidGroup;
}

// Setup scene lighting
function setupLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404080, 0.5);
    scene.add(ambientLight);
    
    // Main directional light (sun)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    
    // Shadow settings
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    
    scene.add(mainLight);
    
    // Fill light for softer shadows
    const fillLight = new THREE.DirectionalLight(0x4080ff, 0.3);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);
    
    // Accent light with lime green tint
    const accentLight = new THREE.PointLight(0xc1ff72, 0.4, 30);
    accentLight.position.set(0, 10, 5);
    scene.add(accentLight);
}

// Ground plane function removed - not needed

// Mouse move handler
function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Pause rotation when mouse moves
    lastMouseMoveTime = Date.now();
    rotationPaused = true;
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Scroll handler
function onScroll() {
    scrollY = window.scrollY;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Check if rotation pause period has elapsed
    const currentTime = Date.now();
    if (rotationPaused && (currentTime - lastMouseMoveTime > ROTATION_PAUSE_DURATION)) {
        rotationPaused = false;
    }
    
    // Smooth camera movement based on mouse position
    targetX = -10 + mouseX * 5; // Camera moves slightly with mouse, centered at -10
    targetY = 5 + mouseY * 5;
    
    // Lerp for smooth transitions
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY + 15 - camera.position.y) * 0.05;
    camera.position.z = 35; // Keep camera at fixed distance
    
    // Keep camera looking at center (x=0), pyramid is at x=35
    camera.lookAt(0, 10, 0);
    
    // Debug: Log positions every 5 seconds
    if (pyramid && Math.floor(Date.now() / 5000) % 5 === 0 && Date.now() % 5000 < 100) {
        console.log('DEBUG - Camera pos:', camera.position, 'Pyramid pos:', pyramid.position);
    }
    
    // Apply scroll-based scaling to pyramid
    if (pyramid) {
        // Calculate scale based on scroll (shrinks as user scrolls down)
        // Starts at 1.5 (150%), reduces to 0.8 (80%) over 1000px of scroll
        const maxScroll = 1000;
        const maxScale = 1.5; // Start oversized
        const minScale = 1.45; // End at 80%
        const scrollFactor = Math.max(0, 1 - (scrollY / maxScroll));
        const targetScale = minScale + (maxScale - minScale) * scrollFactor;
        const finalScale = pyramidBaseScale * targetScale;
        
        // Apply uniform scaling - pyramid stays centered at origin
        pyramid.scale.set(finalScale, finalScale, finalScale);
        
        // Subtle pyramid rotation for dynamic effect (only when not paused)
        if (!rotationPaused) {
            pyramid.rotation.y += 0.001;
        }
    }
    
    // Render the scene
    renderer.render(scene, camera);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPyramidScene);
} else {
    initPyramidScene();
}
