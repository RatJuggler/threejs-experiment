"use strict";

import '../css/styles.css';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, cube, stats, texture, rainController;


// Knows how to render text on the canvas.
class TextRenderer {
    // ctx;     // context of the canvas to render on.
    // height;  // to make the canvas.
    // width;   // to make the canvas.
    constructor(ctx, height, width) {
        this.ctx = ctx;
        this.ctx.canvas.height = height;
        this.ctx.canvas.width = width;
        // The canvas and font sizes govern the number of rows and columns available for text.
        this.font_size = 24;
        this.render_font = this.font_size + "px arial";
        this.row_count = this.ctx.canvas.height / this.font_size;
        this.column_count = this.ctx.canvas.width / this.font_size;
    }
    getRandomColumn() {
        return Math.floor(Math.random() * this.column_count);
    }
    hasReachedBottom(row) {
        return row > this.row_count
    }
    clearCanvas() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    render(text, x, y) {
        // Set green text in the required font then render text.
        this.ctx.fillStyle = "#00FF00";
        this.ctx.font = this.render_font;
        this.ctx.fillText(text, x * this.font_size, y * this.font_size);
    }
}

// A repository of the text available for falling.
class TextRepository {
    //repository;  // Contains all the text we could use.
    //n;           // Index of the next text to use.
    // Define the initial text to show while the file loads.
    constructor() {
        this.repository = ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ"];
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
    //textRepo;      // A repository of text to display.
    //textRenderer;  // A renderer to display the text.
    constructor(textRepo, textRenderer) {
        this.textRepo = textRepo;
        this.textRenderer = textRenderer;
        // Start new details.
        this.new();
    }
    new() {
        this.text = this.textRepo.getNextText();
        this.x = this.textRenderer.getRandomColumn();
        this.y = 0;
    }
    render() {
        this.textRenderer.render(this.text, this.x, this.y);
    }
    moveDown() {
        this.y++;
        // Grab a new text and send the falling item to a new starting position at the top of the screen once it has reached the bottom.
        // Include a random element so they start to appear at different times.
        if (this.textRenderer.hasReachedBottom(this.y) && Math.random() > 0.9) {
            this.new();
        }
    }
}

class RainController {
    // textRenderer;  // Knows how to render canvas and text.
    constructor(textRenderer) {
        this.textRenderer = textRenderer;
        // Initialise an instance of the text repository.
        let textRepo = new TextRepository();
        // An array to hold details of the falling text we want to show.
        this.falling_text = new Array(9);
        for (let i = 0; i < this.falling_text.length; i++) {
            this.falling_text[i] = new FallingText(textRepo, this.textRenderer);
        }
    }
    render() {
        // Redraw the canvas on each tick of the interval.
        this.textRenderer.clearCanvas();
        // Loop through the texts to display...
        for (let i = 0; i < this.falling_text.length; i++) {
            let display_text = this.falling_text[i];
            // Display the text.
            display_text.render();
            // Move it down the screen.
            display_text.moveDown();
        }
    }
}

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
    let textRenderer = new TextRenderer(ctx, 256, 256);
    // Initialise everything.
    rainController = new RainController(textRenderer);

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
