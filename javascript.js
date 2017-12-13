window.onload=init;
var gf;

function init(){
  gf = new GameFramework();
  gf.init();
  window.onkeydown = function(event) {
      alert('test');
      return false;
  }
}

function GameFramework(){
    let canvas, ctx, w, h;
    let tableauObjetGraphiques=[];

    function init() {
        canvas=document.querySelector("#myCanvas");
        ctx=canvas.getContext("2d");
        w=canvas.width;
        h=canvas.height;
        requestAnimationFrame(anime);
    }

    function anime(timeElapsed){
        ctx.clearRect(0,0,w,h);
        tableauObjetGraphiques.forEach(function(r){
          r.draw(ctx);
          //r.move();
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
        creerDesChats:creerDesChats,
        modifVitesse:modifVitesse,
        modifCouleur:modifCouleur
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
        ctx.fillStyle("black");
        ctx.restore();
    }

    getPosition() {
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

    deplacer(direction, map) {
        this.direction = direction;
        var prochaineCase = this.getPosition(direction);

        if(prochaineCase.x > 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getLargeur() || prochaineCase.y >= map.getHauteur()){
            //booleen pour dire que le deplacement ne se fait pas 
            return false;
        }

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

    dessineCorps(){
        ctx.save();
        ctx.fillStyle= "black";
        ctx.fillRect(this.x, this.y, this.height, this.width);
        ctx.restore();
    }

    draw(ctx){
        this.dessineCorps();
        super.draw(ctx);
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
