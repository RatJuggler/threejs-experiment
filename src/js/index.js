"use strict";

import '../css/styles.css';
import * as FT from './falling-text.js';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, cubes, stats, texture, rainController;

function createCubes(texture) {
    let cubeGeometry = new THREE.BoxGeometry( 4, 4, 4 );
    // let cubeMaterial = new THREE.MeshNormalMaterial();
    let cubeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
    });
    let cubes = [];
    let xPosition = [7, 0, -7, 0];
    let zPosition = [0, 7, 0, -7];
    for (let n = 0; n < 4; n++) {
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = xPosition[n];
        cube.position.y = 5;
        cube.position.z = zPosition[n];
        cube.castShadow = true;
        cubes.push(cube);
        scene.add(cube);
    }
    return cubes;
}

function init() {
    // Create a 3d renderer and add to page.
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.shadowMap.enabled = true;

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
    scene.fog = new THREE.Fog( 0xe0e0e0, 80, 100 );

    // Create ground and add to scene.
    let groundGeometry = new THREE.PlaneBufferGeometry( 300, 300 );
    let groundMaterial = new THREE.MeshPhongMaterial( { color: 0xaaaaaa, depthWrite: false } );
    let ground = new THREE.Mesh( groundGeometry, groundMaterial );
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );
    // Make it a grid.
    let grid = new THREE.GridHelper( 300, 100);
    scene.add( grid );

    // Create a texture based on the 2d canvas.
    texture = new THREE.CanvasTexture(ctx.canvas);
    // Use that to create some cubes and add them to the scene above the ground.
    cubes = createCubes(texture, scene);

    // Create the camera and position above the ground.
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set( 0, 12, 20 );

    // Add camera control.
    let controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set(0, 3, 0);
    controls.maxPolarAngle = Math.PI * 0.45;
    controls.minDistance = 12;
    controls.maxDistance = 70;
    controls.update();

    // Add global lighting with a helper to show its direction.
    let hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 40, 0 );
    scene.add( hemiLight );
    let hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 6 );
    scene.add( hemiLightHelper );

    // Add a spotlight to produce shadows.
    let spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 20, 40, 20 );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 100;
    scene.add( spotLight );
    let spotLightHelper = new THREE.SpotLightHelper( spotLight );
    scene.add( spotLightHelper );

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

let speed = 0;
let xRotation = [1, 1, -1, -1];
let yRotation = [1, -1, 1, -1];

function animate() {
    requestAnimationFrame( animate );
    if (speed < 3) {
        speed++;
    } else {
        rainController.render();
        texture.needsUpdate = true;
        speed = 0;
    }
    for (let n = 0; n < 4; n++) {
        cubes[n].rotation.x += (xRotation[n] * 0.02);
        cubes[n].rotation.y += (yRotation[n] * 0.02);
    }
    renderer.render( scene, camera );
    stats.update();
}

init();
animate();
