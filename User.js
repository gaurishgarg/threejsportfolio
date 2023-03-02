import { Group, 
    Object3D,
    Vector3,
    LoopOnce,
    Quaternion,
    Raycaster,
    AnimationMixer,
    AnimationClip, 
    SphereGeometry, 
    MeshBasicMaterial, 
    Mesh } from './libs/three137/three.module.js';
import { GLTFLoader } from './libs/three137/GLTFLoader.js';
import { DRACOLoader } from './libs/three137/DRACOLoader.js';

class User{
constructor(game, pos, heading){
   this.root = new Group();
   this.root.position.copy( pos );
   this.root.rotation.set( 0, heading, 0, 'XYZ' );
   

   this.game = game;

   this.camera = game.camera;

   game.scene.add(this.root);

   this.loadingBar = game.loadingBar;

   this.load();

   this.initMouseHandler();
   
}


initMouseHandler(){
   this.game.renderer.domElement.addEventListener( 'click', raycast, false );
   function raycast(e){}

   const self = this;
   const mouse = { x:0, y:0 };
   
   
}

set position(pos){
   this.root.position.copy( pos );
}



load(){
   const loader = new GLTFLoader( ).setPath(`${this.game.assetsPath}/`);
   const dracoLoader = new DRACOLoader();
   dracoLoader.setDecoderPath( './libs/three137/draco/' );
   loader.setDRACOLoader( dracoLoader );
   
   // Load a glTF resource
   loader.load(
       // resource URL
       'new.glb',
       // called when the resource is loaded
       gltf => {
        gltf.scene.scale.set(0.05, 0.05, 0.05);   
        this.root.add( gltf.scene );
         this.object = gltf.scene;
           this.animations = [];			
            for(let i = 0;i<gltf.animations.length;i++){
               this.animations[i] = gltf.animations[i];

            }
				
				this.mixer = new AnimationMixer(gltf.scene);
            
            
            this.action = 1;
            this.ready = true;


            
            
            
            


           
       },
       // called while loading is progressing
       xhr => {
           this.loadingBar.update( 'user', xhr.loaded, xhr.total );
       },
       // called when loading has errors
       err => {
           console.error( err );
       }
   );
}
set action(i){
   if (this.actionNum == i) return;    
   const clip = this.animations[i];
   const action = this.mixer.clipAction(clip);    
   action.reset();
   this.actionNum = i;
   action.play();  
   if(this.curAction){
      this.curAction.crossFadeTo(action, 0.5);

   }
   this.curAction = action;

   
   
 
   
   
   
   
}
update(dt){
   if (this.mixer)
   {
      
      this.mixer.update(dt);
   
   }
}
}

export { User };