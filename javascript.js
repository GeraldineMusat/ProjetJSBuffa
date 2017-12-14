window.onload=init;
var gf;

function init(){
  gf = new GameFramework();
  gf.init();
}

function GameFramework(){
    let canvas, ctx, w, h;
    let tableauObjetGraphiques=[];

    function init() {
        canvas=document.querySelector("#myCanvas");
        ctx=canvas.getContext("2d");
        this.w=canvas.width;
        this.h=canvas.height;
        requestAnimationFrame(anime);
    }
    
    

    function anime(timeElapsed){
        ctx.clearRect(0,0,this.w,this.h);
        tableauObjetGraphiques.forEach(function(r){
          r.draw(ctx);
          r.move();
          //r.testCollisionZone(w,h);
        });
        requestAnimationFrame(anime);
    }

    function creerPersonnage(){
        let perso = new Personnage(this.w/2, this.h/2);//posX et posY
        tableauObjetGraphiques.push(perso);
    }

    function reset() {
        tableauObjetGraphiques=[];
    }

    return {
        init:init,
        reset:reset,
        creerPersonnage:creerPersonnage
    }
}

var DIRECTION = {
    "BAS"   :0,
    "GAUCHE":1,
    "DROITE":2,
    "HAUT"  :3
}

class ObjetGraphique {
    constructor (positionX, positionY, largeur, hauteur, direction){
        this.x = positionX;
        this.y = positionY;
        this.width = largeur;
        this.height = hauteur;
        this.direction = direction;
    }

    draw(ctx){
        ctx.save();
        //ctx.fillStyle("black");
        ctx.restore();
    }

    getPosition(direction) {
        var coord = {'x' : this.x, 'y' : this.y};

        switch(direction){
            case DIRECTION.BAS : 
                coord.y++;
                break;
            case DIRECTION.GAUCHE : 
                coord.x--;
                break;
            case DIRECTION.DROITE : 
                coord.x++;
                break;
            case DIRECTION.HAUT : 
                coord.y--;
                break;
        }
        return coord;
    }

    move() {
        var prochaineCase;
        window.onkeydown = function(event) {
            switch (event.keyCode || event.which) {
                case 37:
                console.log("gauche");
                this.direction = DIRECTION.GAUCHE;
                //prochaineCase = this.getPosition(this.direction);
                break;
            case 39:
                console.log("droite");
                this.direction = DIRECTION.DROITE;
                //prochaineCase = this.getPosition(this.direction);
                break;
            case 38:
                console.log("haut");
                this.direction = DIRECTION.HAUT;
                //prochaineCase = this.getPosition(this.direction);
                break;
            case 40:
                console.log("bas");
                this.direction = DIRECTION.BAS;
                //prochaineCase = this.getPosition(this.direction);
                break;
            default:
                break;
            }
            return false;
        }
        prochaineCase = this.getPosition(this.direction);
        //on effectue le deplacement 
        
        this.x = prochaineCase.x;
        this.y = prochaineCase.y;

        return true;
    }

    testCollisionZone(w,h){}
}

class Personnage extends ObjetGraphique {
    constructor (posX, posY){
        super(posX, posY, 10, 10, DIRECTION.HAUT);
    }

    dessineCorps(ctx){
        ctx.save();
        ctx.fillStyle= "black";
        ctx.fillRect(this.x, this.y, this.height, this.width);
        ctx.restore();
    }

    draw(ctx){
        this.dessineCorps(ctx);
        super.draw(ctx);
    }

    move() {
        
        super.move();
    }
}

function initialisationPerso() {
    gf.reset();
    gf.creerPersonnage();
}

function initialisationPerso2() {
    //print("Hello World !");
    document.writeln("Hello world !");
}
