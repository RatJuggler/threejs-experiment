import '../css/styles.css';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var camera, scene, renderer, cube, stats;

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.z = 10;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xe0e0e0 );
    let geometry = new THREE.BoxGeometry( 4, 4, 4 );
    let material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    let controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 10;
    controls.maxDistance = 50;

    // Show stats.
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
