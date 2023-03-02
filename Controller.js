import { Object3D, Camera, Vector3, Quaternion, Raycaster } from './libs/three137/three.module.js';
import { JoyStick } from './libs/JoyStick.js';
//import { Game } from './Game.js';

class Controller{
    constructor(game){
        this.camera = game.camera;
        this.clock = game.clock;
        this.user = game.user;
        this.target = game.user.root;        
        this.game = game;
        

        

        this.move = { up:0, right:0 };
        this.look = { up:0, right:0 };

        this.tmpVec3 = new Vector3();
        this.tmpQuat = new Quaternion();

        //Used to return the camera to its base position and orientation after a look event
        this.cameraBase = new Object3D();
        this.cameraBase.position.copy( this.camera.position );
        this.cameraBase.quaternion.copy( this.camera.quaternion );
        this.target.attach( this.cameraBase );

        this.cameraHigh = new Camera();
        this.cameraHigh.position.copy( this.camera.position );
        this.cameraHigh.position.y += 10;
        this.cameraHigh.lookAt( this.target.position );
        this.target.attach( this.cameraHigh );

        this.yAxis = new Vector3(0, 1, 0);
        this.xAxis = new Vector3(1, 0, 0);
        this.forward = new Vector3(0, 0, 1);
        this.down = new Vector3(0, -1, 0);

        this.speed = 5;

        this.checkForGamepad();

        
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {this.initOnscreenController();}
        else{
                    this.initKeyControl();

        }
    }

    initOnscreenController(){
        
        const options1 = {
            left: true,
            app: this,
            onMove: this.onMove
        }

        const joystick1 = new JoyStick(options1);

        const options2 = {
            right: true,            
            app: this,
            onMove: this.onLook
        }

        const joystick2 = new JoyStick(options2);
    
    }

    initKeyControl(){
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
        document.addEventListener('mousedown', this.mouseDown.bind(this));
        document.addEventListener('mouseup', this.mouseUp.bind(this));
        document.addEventListener('mousemove', this.mouseMove.bind(this));
        this.keys = {   
                        w:false, 
                        a:false, 
                        d:false, 
                        s:false, 
                        mousedown:false, 
                        mouseorigin:{x:0, y:0}
                    };
    }

    checkForGamepad(){
       
    }

    showTouchController(mode){
        if (this.touchController == undefined) return;

        this.touchController.joystick1.visible = mode;
        this.touchController.joystick2.visible = mode;
        
    }

    keyDown(e){
        //console.log('keyCode:' + e.keyCode);
        switch(e.keyCode){
            case 87:
                this.keys.w = true;
                break;
            case 65:
                this.keys.a = true;
                break;
            case 83:
                this.keys.s = true;
                break;
            case 68:
                this.keys.d = true;
                break;
        
        }
        switch(e.keyCode){
            case 38:
                this.keys.w = true;
                break;
            case 37:
                this.keys.a = true;
                break;
            case 40:
                this.keys.s = true;
                break;
            case 39:
                this.keys.d = true;
                break;
        
        }
    }

    keyUp(e){
        switch(e.keyCode){
            case 87:
                this.keys.w = false;
                if (!this.keys.s) this.move.up = 0;
                break;
            case 65:
                this.keys.a = false;
                if (!this.keys.d) this.move.right = 0;
                break;
            case 83:
                this.keys.s = false;
                if (!this.keys.w) this.move.up = 0;
                break;
            case 68:
                this.keys.d = false;
                if (!this.keys.a) this.move.right = 0;
                break;                             
        }
        switch(e.keyCode){
            case 38:
                this.keys.w = false;
                if (!this.keys.s) this.move.up = 0;
                break;
            case 37:
                this.keys.a = false;
                if (!this.keys.d) this.move.right = 0;
                break;
            case 40:
                this.keys.s = false;
                if (!this.keys.w) this.move.up = 0;
                break;
            case 39:
                this.keys.d = false;
                if (!this.keys.a) this.move.right = 0;
                break;                             
        }
    
    }

    mouseDown(e){
        this.keys.mousedown = true;
        this.keys.mouseorigin.x = e.offsetX;
        this.keys.mouseorigin.y = e.offsetY;
    }

    mouseUp(e){
        this.keys.mousedown = false;
        this.look.up = 0;
        this.look.right = 0;
        
        
    }

    mouseMove(e){
        if (!this.keys.mousedown) return;
        let offsetX = e.offsetX - this.keys.mouseorigin.x;
        let offsetY = e.offsetY - this.keys.mouseorigin.y;
        if (offsetX<-100) offsetX = -100;
        if (offsetX>100) offsetX = 100;
        offsetX /= 100;
        if (offsetY<-100) offsetY = -100;
        if (offsetY>100) offsetY = 100;
        offsetY /= 100;
        this.onLook(-offsetY, offsetX);
    }

    

    onMove( up, right ){
        this.move.up = up;
        this.move.right = -right;  
        
        
        
    }

    onLook( up, right ){
        this.look.up = up*0.25;
        this.look.right = -right;
    }

    gamepadHandler(){
        
    }

    keyHandler(){
        if (this.keys.w) {this.move.up += 0.1;
        }
        if (this.keys.s) this.move.up -= 0.1;
        if (this.keys.a) this.move.right += 0.1;
        if (this.keys.d) this.move.right -= 0.1;
        if (this.move.up>1) this.move.up = 1;
        if (this.move.up<-1) this.move.up = -1;
        if (this.move.right>1) this.move.right = 1;
        if (this.move.right<-1) this.move.right = -1;
    }

    update(dt){  
        let playerMoved = false;
        let speed;

        if (this.gamepad){
            this.gamepadHandler();
        }else if(this.keys){
            this.keyHandler();
        }
      

        if (this.move.up!=0){
            const forward = this.forward.clone().applyQuaternion(this.target.quaternion);
            speed = this.move.up>0 ? this.speed * dt : this.speed * dt * 0.3;
            speed *= this.move.up/100;
            this.target.position.add(forward.multiplyScalar(speed));
            playerMoved = true;        
          
        } 

        else{
        }
        if (Math.abs(this.move.right)>0.1){
            const theta = dt * (this.move.right-0.1) * 1;
            this.target.rotateY(theta);
            playerMoved = true;
        }

        if (playerMoved){
            this.cameraBase.getWorldPosition(this.tmpVec3);
            this.camera.position.lerp(this.tmpVec3, 0.7);
            //if (speed) console.log(speed.toFixed(2));
            this.user.action = 0;
            
        }else{
            this.user.action = 1;
        }

        if (this.look.up==0 && this.look.right==0){
            let lerpSpeed = 0.7;
            this.cameraBase.getWorldPosition(this.tmpVec3);
            this.cameraBase.getWorldQuaternion(this.tmpQuat);
            this.camera.position.lerp(this.tmpVec3, lerpSpeed);
            this.camera.quaternion.slerp(this.tmpQuat, lerpSpeed);
        }else{
            const delta = 1 * dt;
            this.camera.rotateOnWorldAxis(this.yAxis, this.look.right * delta);
            const cameraXAxis = this.xAxis.clone().applyQuaternion(this.camera.quaternion);
            this.camera.rotateOnWorldAxis(cameraXAxis, this.look.up * delta);
        } 

    }
}

export { Controller };