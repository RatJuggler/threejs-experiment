import '../css/styles.css';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var camera, scene, renderer, cube, stats;

init();
animate();

function init() {
    // Create scene.
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xe0e0e0 );

    // Create ground and add to scene.
    let groundGeometry = new THREE.PlaneBufferGeometry( 200, 200 );
    let groundMaterial = new THREE.MeshNormalMaterial();
    let ground = new THREE.Mesh( groundGeometry, groundMaterial );
    ground.rotation.x = - Math.PI / 2;
    scene.add( ground );

    // Create cube and add to scene above the ground.
    let cubeGeometry = new THREE.BoxGeometry( 4, 4, 4 );
    let cubeMaterial = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cube.position.y = 5;
    scene.add( cube );

    // Create renderer.
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Add to page.
    document.body.appendChild( renderer.domElement );

    // Create the camera and position above the ground.
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set( 0, 10, 20 );

    // Add camera control.
    let controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 10;
    controls.maxDistance = 50;

    // Create and add stats to page.
    stats = new Stats();
    document.body.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render( scene, camera );
    stats.update();
}
