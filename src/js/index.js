"use strict";

import '../css/styles.css';
import * as FT from './falling-text.js';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const CUBE_DEFINITIONS = [
    {x: 7,  y: 5, z: 0,  dx: 1,  dy: 1,  dz: -1},
    {x: 0,  y: 5, z: 7,  dx: 1,  dy: -1, dz: 1},
    {x: -7, y: 5, z: 0,  dx: -1, dy: -1, dz: -1},
    {x: 0,  y: 5, z: -7, dx: -1, dy: 1,  dz: 1}]

let camera, scene, renderer, cubes, stats;

function createCubes(texture, scene) {
    let cubeGeometry = new THREE.BoxGeometry( 4, 4, 4 );
    // Test material for cubes.
    // let cubeMaterial = new THREE.MeshNormalMaterial();
    let cubeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
    });
    let cubes = [];
    CUBE_DEFINITIONS.forEach(definition => {
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(definition.x, definition.y, definition.z);
        cube.castShadow = true;
        cube.xRotation = definition.dx;
        cube.yRotation = definition.dy;
        cube.zRotation = definition.dz;
        cubes.push(cube);
        scene.add(cube);
    })
    return cubes;
}

function init() {
    // Create a 3d renderer and add to page.
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.shadowMap.enabled = true;

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

    // Create the dynamic canvas renderer.
    let rainController = new FT.RainController();
    // Create a texture based on the dynamic canvas.
    let dynamicTexture = new THREE.CanvasTexture(rainController.getCanvas());
    // Use that to create some cubes and add them to the scene.
    cubes = createCubes(dynamicTexture, scene);

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

    // Update the dynamic canvas/texture every interval.
    window.setInterval(() => {
        rainController.render();
        dynamicTexture.needsUpdate = true;
    }, 100);
    // Deal with window resizing.
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    cubes.forEach(cube => {
        cube.rotation.x += (cube.xRotation * 0.02);
        cube.rotation.y += (cube.yRotation * 0.02);
        cube.rotation.z += (cube.zRotation * 0.02);
    })
    renderer.render( scene, camera );
    stats.update();
}

init();
animate();
