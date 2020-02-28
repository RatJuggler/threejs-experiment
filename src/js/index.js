"use strict";

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
    scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );

    // Create ground and add to scene.
    let groundGeometry = new THREE.PlaneBufferGeometry( 500, 500 );
    let groundMaterial = new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } );
    let ground = new THREE.Mesh( groundGeometry, groundMaterial );
    ground.rotation.x = - Math.PI / 2;
    scene.add( ground );
    // Make it a grid.
    let grid = new THREE.GridHelper( 500, 100, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );

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
    controls.maxPolarAngle = Math.PI * 0.45;
    controls.minDistance = 10;
    controls.maxDistance = 50;

    let hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 100, 0 );
    scene.add( hemiLight );

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
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render( scene, camera );
    stats.update();
}
