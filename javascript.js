window.onload=init;
var gf;
let dir_event;

function init(){
  gf = new GameFramework();
  gf.init();
}

function GameFramework(){
    let canvas, ctx, w, h;
    let tableauObjetGraphiques=[];

    window.onkeydown = function(event) {
        switch (event.keyCode || event.which) {
            case 37:
            console.log("gauche");
            dir_event = DIRECTION.GAUCHE;
            //prochaineCase = this.getPosition(this.direction);
            break;
        case 39:
            console.log("droite");
            dir_event = DIRECTION.DROITE;
            //prochaineCase = this.getPosition(this.direction);
            break;
        case 38:
            console.log("haut");
            dir_event = DIRECTION.HAUT;
            //prochaineCase = this.getPosition(this.direction);
            break;
        case 40:
            console.log("bas");
            dir_event = DIRECTION.BAS;
            //prochaineCase = this.getPosition(this.direction);
            break;
        default:
            break;
        }
        return false;
    }

    function init() {
        canvas=document.querySelector("#myCanvas");
        ctx=canvas.getContext("2d");
        this.w=canvas.width;
        this.h=canvas.height;
        console.log("dans le init");
        requestAnimationFrame(anime);
    }

    function anime(timeElapsed){
        tableauObjetGraphiques.forEach(function(r){
          r.draw(ctx);
          console.log("dans le anime");
          r.move();
          //r.testCollisionZone(w,h);
        });
        requestAnimationFrame(anime);
    }

    function creerPersonnage(){
        console.log("Dans creer perso");
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
    constructor (positionX, positionY, largeur, hauteur){
        this.x = positionX;
        this.y = positionY;
        this.width = largeur;
        this.height = hauteur;
        this.direction = dir_event;
    }

    draw(ctx){
        ctx.save();
        
        ctx.restore();
    }

    getPosition(direction) {
        var coord = {'x' : this.x, 'y' : this.y};
        console.log("dans le get Position");
        this.direction = dir_event;
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
            default :
                break;
        }
        return coord;
    }

    move() {
        console.log("dans le move de onObjetGraphique");
        
        var prochaineCase = this.getPosition(dir_event);
        //on effectue le deplacement 
        
        this.x = prochaineCase.x;
        this.y = prochaineCase.y;

        return true;
    }

    testCollisionZone(w,h){}
}

class Personnage extends ObjetGraphique {
    constructor (posX, posY){
        super(posX, posY, 10, 10, null);
    }

    dessineCorps(ctx){
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.height, this.width);
        ctx.restore();
    }

    draw(ctx){
        ctx.save();
        ctx.clearRect(0,0,300, 300);
        this.dessineCorps(ctx);
        //super.draw(ctx);
        ctx.restore();
    }

    move() {
        console.log("dans le move de Personnage");
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
