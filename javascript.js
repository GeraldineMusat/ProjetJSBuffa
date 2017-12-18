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
            //console.log("gauche");
            dir_event = DIRECTION.GAUCHE;
            break;
        case 39:
            //console.log("droite");
            dir_event = DIRECTION.DROITE;
            break;
        case 38:
            //console.log("haut");
            dir_event = DIRECTION.HAUT;
            break;
        case 40:
            //console.log("bas");
            dir_event = DIRECTION.BAS;
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
        //console.log("dans le init");
        requestAnimationFrame(anime);
    }

    function anime(timeElapsed){
        tableauObjetGraphiques.forEach(function(r){
          r.draw(ctx);
          //console.log("dans le anime");
          r.move();
          //r.testCollisionZone(w,h);
        });
        requestAnimationFrame(anime);
    }

    function creerPersonnage(){
        //console.log("Dans creer perso");
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
        this.map = new Map('Hall_entree.png');
    }

    draw(ctx){
    }

    getZone_changeMap() {
        var perso = {x: this.x, y: this.y, width: this.width, height: this.width}; //met a jour les coordonées du perso
        var zone = {x: 2, y: 50, width: 30, height: 30};

        if(this.map.img === 'Hall_entree.png'){
            if (perso.x < zone.x + zone.width && perso.x + perso.width > zone.x && perso.y < zone.y + zone.height && perso.height + perso.y > zone.y) {
                // zone détectée !
               this.map.change_map("Map_sol.png");
           }
        }
    }

    testCollision() {

    }

    getPosition(direction) {
        var coord = {'x' : this.x, 'y' : this.y};
        console.log("x = "+this.x);
        console.log("y = "+this.y);
        //console.log("dans le get Position");
        this.getZone_changeMap();
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
        //console.log("dans le move de onObjetGraphique");
        
        var prochaineCase = this.getPosition(dir_event);
        //on effectue le deplacement 
        console.log(dir_event);
       
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
        //this.map.draw_item(ctx);
        this.dessineCorps(ctx);
        ctx.restore();
    }

    move() {
        //console.log("dans le move de Personnage");
        super.move();
    }
}

class Map {
    constructor (chemin_image) {
        //console.log("dans le constructeut de map")
        //Elle aura un nom/lien image
        //Elle aura un tableau pour les collisions
        this.img = chemin_image;
        this.draw_map(this.img);
    }

    draw_item(ctx) {
        //console.log("dans draw tile");
        //var img = new Image();
        //img.onload = function() {
            //ctx.drawImage(img, 0, 0);
        //};
        //img.src = 'testTileSet.png';
    }

    draw_map(img) {
        var attribute = "background: url("+img+")";
        var canvas = document.getElementsByTagName('canvas')[0];
        canvas.setAttribute('style', attribute);
    }

    change_map(img){
        this.img = img;
        this.draw_map(this.img);
    }
}

function initialisationPerso() {
    gf.reset();
    gf.creerPersonnage();
}

