window.onload=init;
var gf;
let dir_event;
let old_dir_event;
let initialisation = false; //false quand il est pas encore initialisé (pas encore apuyé sur une des flèches du clavier)
let change_pos = false;

function init(){
  gf = new GameFramework();
  gf.init();
}

function GameFramework(){
    let canvas, ctx, w, h;
    let tableauObjetGraphiques=[];

    function initKey() {
        window.onkeydown = function(event) {
            switch (event.keyCode || event.which) {
                case 37:
                //console.log("gauche");
                if(!initialisation){
                    old_dir_event = DIRECTION.GAUCHE;
                    dir_event = old_dir_event;
                    initialisation = true;
                }else{
                    old_dir_event = dir_event;
                    dir_event = DIRECTION.GAUCHE;
                }
                break;
            case 39:
                //console.log("droite");
                if(!initialisation){
                    old_dir_event = DIRECTION.DROITE;
                    dir_event = old_dir_event;
                    initialisation = true;
                }else{
                    old_dir_event = dir_event;
                    dir_event = DIRECTION.DROITE;
                }
                break;
            case 38:
                //console.log("haut");
                if(!initialisation){
                    old_dir_event = DIRECTION.HAUT;
                    dir_event = old_dir_event;
                    initialisation = true;
                }else{
                    old_dir_event = dir_event;
                    dir_event = DIRECTION.HAUT;                
                }
                break;
            case 40:
                //console.log("bas");
                if(!initialisation){
                    old_dir_event = DIRECTION.BAS;
                    dir_event = old_dir_event;
                    initialisation = true;
                }else{
                    old_dir_event = dir_event;
                    dir_event = DIRECTION.BAS;
                }
                break;
            default : 
                break;
            }
            return false;
        }
    }

    function init() {
        canvas=document.querySelector("#myCanvas");
        ctx=canvas.getContext("2d");
        this.w=canvas.width;
        this.h=canvas.height;
        initKey();
        //console.log("dans le init");
        requestAnimationFrame(anime);
    }

    function anime(timeElapsed){
        tableauObjetGraphiques.forEach(function(r){
          r.draw(ctx);
          r.move();
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
    "HAUT"  :3,
    "STOP"  :4
}

class ObjetGraphique {
    constructor (positionX, positionY, largeur, hauteur){
        this.x = positionX;
        this.y = positionY;
        this.width = largeur;
        this.height = hauteur;
        this.direction = dir_event;
        this.vitesse = 5;
    }

    dessineCorps(ctx){
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.height, this.width);
        ctx.restore();
    }

    draw(ctx){
        ctx.save();
        ctx.clearRect(0,0,600, 600);
        //this.map.draw_item(ctx);
        this.dessineCorps(ctx);
        ctx.restore();
    }

    move(prochaineCase) {
        //console.log("dans le move de onObjetGraphique");
        this.x = prochaineCase.x;
        this.y = prochaineCase.y;
    }
}

class Personnage extends ObjetGraphique {
    constructor (posX, posY){
        super(posX, posY, 20, 20, null);
        this.map = new Map('Hall_entree.png');
    }

    move() {
        //console.log("dans le move de Personnage");
        if(this.map.img == "Map_sol.png" && change_pos){
            this.x = 500;
            this.y = 300;
            change_pos = false; //pou la condition unique pour savoir si tu peux changer de pos ou pas 
        }
        if(this.map.img == "Hall_entree.png" && change_pos){
            this.x = 130;
            this.y = 155;
            change_pos = false;
        }
        
        var prochaineCase = this.getPosition(dir_event);
        //on effectue le deplacement 
        super.move(prochaineCase);

        return true;
    }

    getZone_changeMap() {
        var perso = {x: this.x, y: this.y, width: this.width, height: this.width}; //met a jour les coordonées du perso
        var zone = {}; // zone pour aller dans les couloirs avec toutes les salles  

        if(this.map.img === 'Hall_entree.png'){
            zone = {x: 0, y: 120, width: 40, height: 60};
            if (perso.x < zone.x + zone.width && perso.x + perso.width > zone.x && perso.y < zone.y + zone.height && perso.height + perso.y > zone.y) {
                // zone détectée !
                this.map.change_map("Map_sol.png");
            }
        }
        if(this.map.img === "Map_sol.png"){
            zone = {x: 579, y: 250, width: 40, height: 100};
            if (perso.x < zone.x + zone.width && perso.x + perso.width > zone.x && perso.y < zone.y + zone.height && perso.height + perso.y > zone.y) {
                // zone détectée !
                this.map.change_map("Hall_entree.png");
            }
        }
    }

    testCollision() { // Collisions faites pour les 4 cotés du Canvas 
        if(this.map.img == "Map_sol.png"){
            var perso = {x: this.x, y: this.y, width: this.width, height: this.width}; // perso
            var zone = {x: 10, y: 180, width: 590, height: 235}; // MAP / Canvas
        }
        if(this.map.img == "Hall_entree.png"){
            var perso = {x: this.x, y: this.y, width: this.width, height: this.width}; // perso
            var zone = {x: 0, y: 0, width: 600, height: 600}; // MAP / Canvas
        }
        if (perso.x - perso.width/2 < zone.x) { // collision détectée sur le coté gauche du canvas 
            if(dir_event == DIRECTION.GAUCHE){
                return true;
            } else {
                return false;
            }
       }
       if(perso.y - perso.height/2 < zone.y) { // collision detectée sur le haut du canvas 
            if(dir_event == DIRECTION.HAUT) {
                return true;
            }else{
                return false;
            }
       }
       if(perso.x + perso.width >= zone.x + zone.width){ // collision detectée sur le coté droit du canvas
           if(dir_event == DIRECTION.DROITE){
               return true;
           }else{
               return false;
           }
       }
       if(perso.y + perso.height >= zone.y + zone.height){ // collision detectée sur le bas du canvas 
           if(dir_event == DIRECTION.BAS){
               return true;
           }else{
               return false;
           }
       }
       return false;
    }

    getPosition(direction) {
        var coord = {'x' : this.x, 'y' : this.y};
        this.getZone_changeMap();
        switch(direction){
            case DIRECTION.BAS :
                if (!this.testCollision()){
                    coord.y += this.vitesse;
                } 
                break;
            case DIRECTION.GAUCHE : 
                if (!this.testCollision()){
                    coord.x -= this.vitesse;
                }
                break;
            case DIRECTION.DROITE : 
                if (!this.testCollision()){ 
                    coord.x += this.vitesse;
                }
                break;
            case DIRECTION.HAUT :
                if (!this.testCollision()){
                    coord.y -= this.vitesse;
                }
                break;
            case DIRECTION.STOP :
                this.vitesse = 0;
                break;
            default :
                break;
        }
        this.vitesse = 5;
        dir_event = DIRECTION.STOP;
        return coord;
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
        var attribute = 'background: url('+img+') no-repeat';
        var canvas = document.getElementsByTagName('canvas')[0];
        canvas.setAttribute('style', attribute);
    }

    change_map(img){
        this.img = img;
        this.draw_map(this.img);
        change_pos = true;
    }
}

function initialisationPerso() {
    gf.reset();
    gf.creerPersonnage();
}
