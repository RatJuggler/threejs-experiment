"use strict";

import '../css/styles.css';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var camera, scene, renderer, cube, stats, ctx, texture, textRepo;

// The canvas and font sizes govern the number of rows and columns available for text.
var font_size = 16;
var render_font = font_size + "px arial";
var rows, columns;

// An array to hold the number of falling texts we want to show.
var falling_text = new Array(6);


// A repository of the text available for falling.
class TextRepository {
    //repository;  // Contains all the text we could use.
    //n;           // Index of the next text to use.
    // Define the inital text to show while the file loads.
    constructor() {
        this.repository = ["TYRANNOSAURUS", "TRICERATOPS", "VELOCIRAPTOR", "STEGOSAURUS", "SPINOSAURUS", "ARCHAEOPTERYX", "BRACHIOSAURUS", "ALLOSAURUS", "APATOSAURUS", "DILOPHOSAURUS"];
        this.n = 0;
    }
    populateFromFile(file) {
        // Extract text from the file, split by line and convert to upper case.
        fetch(file)
            .then(response => response.text())
            .then(text => this.repository = text.split('\n').map(s => s.toUpperCase()));
    }
    getNextText() {
        if (this.n === this.repository.length) {
            this.n = 0;
        }
        return this.repository[this.n++];
    }
}

// A piece of falling text.
class FallingText {
    //text;  // The text to display.
    //x;     // It's column on the screen.
    //y;     // It's row on the screen.
    constructor(display_text, row_count, column_count) {
        this.text = display_text;
        // Start the text at a random point.
        this.x = Math.floor(Math.random() * column_count);
        this.y = Math.floor(Math.random() * row_count);
    }
    render(in_font_size) {
        ctx.fillText(this.text, this.x * in_font_size, this.y * in_font_size);
    }
    moveDown(row_count, column_count) {
        this.y++;
        // Grab a new text and send the falling item to a new starting position at the top of the screen once it has reached the bottom.
        if (this.y > row_count && Math.random() > 0.9) {
            this.text = textRepo.getNextText();
            this.x = Math.floor(Math.random() * column_count);
            this.y = 0;
        }
    }
}


init();
animate();

function init() {
    // Create a 3d renderer and add to page.
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Create a 2d renderer and add to page.
    ctx = document.createElement('canvas').getContext('2d');
    document.body.appendChild(ctx.canvas);
    ctx.canvas.width = 256;
    ctx.canvas.height = 256;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Work out how many text rows and columns this gives us.
    rows = ctx.canvas.height / font_size;
    columns = ctx.canvas.width / font_size;
    // Populate initial display.
    textRepo = new TextRepository();
    for(let i = 0; i < falling_text.length; i++) {
        falling_text[i] = new FallingText(textRepo.getNextText(), rows, columns);
    }

    // Create and add stats to page.
    stats = new Stats();
    document.body.appendChild( stats.dom );

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
    camera.position.set( 0, 20, 20 );

    // Add camera control.
    let controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.45;
    controls.minDistance = 10;
    controls.maxDistance = 50;

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

function animate() {
    requestAnimationFrame( animate );
    rain();
    texture.needsUpdate = true;
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render( scene, camera );
    stats.update();
}

function rain() {
    // Use a black background for the canvas with translucency for the trail effect.
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Set green text in the required font.
    ctx.fillStyle = "#00FF00";
    ctx.font = render_font;
    // Loop through the texts to display...
    for(let i = 0; i < falling_text.length; i++) {
        let display_text = falling_text[i];
        // Display the text.
        display_text.render(font_size);
        // Move it down the screen.
        display_text.moveDown(rows, columns);
    }
}
