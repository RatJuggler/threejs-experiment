"use strict";

import '../css/styles.css';
import * as FT from './falling-text.js';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, cube, stats, texture, rainController;


function init() {
    // Create a 3d renderer and add to page.
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Create a 2d canvas and add to page.
    let ctx = document.createElement('canvas').getContext('2d');
    document.body.appendChild(ctx.canvas);
    // Create a renderer using a set canvas size.
    let textRenderer = new FT.TextRenderer(ctx, 256, 256);
    // Initialise everything.
    rainController = new FT.RainController(textRenderer);

    // Create and add stats to page.
    stats = new Stats();
    document.body.appendChild( stats.dom );

    // Create scene.
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xe0e0e0 );
    scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );

    // Create ground and add to scene.
    let groundGeometry = new THREE.PlaneBufferGeometry( 500, 500 );
    let groundMaterial = new THREE.MeshPhongMaterial( { color: 0xaaaaaa, depthWrite: false } );
    let ground = new THREE.Mesh( groundGeometry, groundMaterial );
    ground.rotation.x = - Math.PI / 2;
    scene.add( ground );
    // Make it a grid.
    let grid = new THREE.GridHelper( 500, 100);
    scene.add( grid );

    // Create cube and add to scene above the ground.
    let cubeGeometry = new THREE.BoxGeometry( 4, 4, 4 );
    // let cubeMaterial = new THREE.MeshNormalMaterial();
    texture = new THREE.CanvasTexture(ctx.canvas);
    let cubeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
    });
    cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cube.position.y = 5;
    scene.add( cube );

    // Create the camera and position above the ground.
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set( 0, 3, 10 );

    // Add camera control.
    let controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set(0, 3, 0);
    controls.maxPolarAngle = Math.PI * 0.45;
    controls.minDistance = 7;
    controls.maxDistance = 50;
    controls.update();

    // Add global lighting.
    let hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 100, 0 );
    scene.add( hemiLight );

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

let speed = 0;

function animate() {
    requestAnimationFrame( animate );
    if (speed < 3) {
        speed++;
    } else {
        rainController.render();
        texture.needsUpdate = true;
        speed = 0;
    }
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
    renderer.render( scene, camera );
    stats.update();
}

init();
animate();
