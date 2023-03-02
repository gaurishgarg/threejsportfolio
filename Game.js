import * as THREE from './libs/three137/three.module.js';
import { GLTFLoader } from './libs/three137/GLTFLoader.js';
import { RGBELoader } from './libs/three137/RGBELoader.js';
import { OrbitControls } from './libs/three137/OrbitControls.js';
import { LoadingBar } from './libs/LoadingBar.js';
import { User } from './User.js';
import { Controller } from './Controller.js';

class Game{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
		this.clock = new THREE.Clock();

        this.loadingBar = new LoadingBar();
        this.loadingBar.visible = false;

		this.assetsPath = './assets';
        
		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 500 );
		this.camera.position.set( 0.175, 0.05, 0.6875 );
    
		let col = 0xffffff;
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( col );
		this.scene.fog = new THREE.Fog( col, 100, 200 );

		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		this.scene.add(ambient);

        //Add light with shadow
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.shadowMap.enabled = true;
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( this.renderer.domElement );
        this.setEnvironment();
        
        
        this.load();
		
		window.addEventListener('resize', this.resize.bind(this) );
        
	}
	
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight ); 
    }
    
    setEnvironment(){
        
    }
    
	load(){
        this.loadEnvironment();
		this.user = new User(this, new THREE.Vector3( 0.175,-0.025,0.5), -135)
    }

    loadEnvironment(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}/`);
        
        this.loadingBar.visible = true;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'scene.glb',
			// called when the resource is loaded
			gltf => {
				this.loadingBar.visible = false;
				this.scene.add(gltf.scene);
				this.controller = new Controller(this);

				this.renderer.setAnimationLoop( this.render.bind(this) );

			},
			// called while loading is progressing
			xhr => {

				this.loadingBar.update('environment', xhr.loaded, xhr.total);
				
			},
			// called when loading has errors
			err => {

				console.error( err );

			}
		);
	}			
    
	render() {
		const dt = this.clock.getDelta();
		if (this.user !== undefined && this.user.ready ){
			this.user.update(dt);
			if (this.controller !== undefined) this.controller.update(dt);
		}
			

        this.renderer.render( this.scene, this.camera );

    }
	
}

export { Game };