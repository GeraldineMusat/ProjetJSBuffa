window.onload=init;
var gf;
let dir_event;
let old_dir_event;
let initialisation = false; //false quand il est pas encore initialisé (pas encore apuyé sur une des flèches du clavier)
let change_pos = false;
let map;

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
        });
        tableauObjetGraphiques.forEach(function(r){
          r.dessineCorps(ctx);
          r.move();
        });
        requestAnimationFrame(anime);
    }

    function creerPersonnage(){
        //console.log("Dans creer perso");
        let perso = new Personnage(this.w/2, this.h/2);//posX et posY
        let pnj_1 = new PNJ(541,472,"acceuil");
        map = new Map(ctx);
        tableauObjetGraphiques.push(perso);
        tableauObjetGraphiques.push(pnj_1);
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
        this.old_pos = {x: this.x-this.width, y: this.y-this.height, width: this.width, height: this.height};
    }

    dessineCorps(ctx){
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.height, this.width);
        ctx.restore();
    }

    draw(ctx){
        ctx.save();
        //ctx.clearRect(this.old_pos.x - 1, this.old_pos.y - 1, this.old_pos.x + this.old_pos.width + 1, this.old_pos.y + this.old_pos.height + 1);
        ctx.clearRect(0,0,600,600);
        ctx.restore();
    }

    move(prochaineCase) {
        //console.log("dans le move de ObjetGraphique");
        this.old_pos.x = this.x;
        this.old_pos.y = this.y;
        this.x = prochaineCase.x;
        this.y = prochaineCase.y;
    }
}

class Personnage extends ObjetGraphique {
    constructor (posX, posY){
        super(posX, posY, 20, 20);
    }

    move() {
        //console.log("dans le move de Personnage");
        if(map.img == "Map_sol.png" && change_pos){
            this.x = 500;
            this.y = 300;
            change_pos = false; //pou la condition unique pour savoir si tu peux changer de pos ou pas 
        }
        if(map.img == "Hall_entree.png" && change_pos){
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
        if(map.img === 'Hall_entree.png'){
            zone = {x: 0, y: 120, width: 40, height: 60};
            if (perso.x < zone.x + zone.width && perso.x + perso.width > zone.x && perso.y < zone.y + zone.height && perso.height + perso.y > zone.y) {
                // zone détectée !
                map.change_map("Map_sol.png");
            }
        }
        if(map.img === "Map_sol.png"){
            zone = {x: 579, y: 250, width: 40, height: 100};
            if (perso.x < zone.x + zone.width && perso.x + perso.width > zone.x && perso.y < zone.y + zone.height && perso.height + perso.y > zone.y) {
                // zone détectée !
                map.change_map("Hall_entree.png");
            }
        }
    }

    getZone_dialogue() {
        var show_dialogue = false;
        var perso = {x: this.x, y: this.y, width: this.width, height: this.width}; //met a jour les coordonées du perso
        var p = document.getElementsByTagName('p')[4];
        var p_2 = document.getElementsByTagName('p')[5];
        var select = document.getElementsByTagName('select')[1];
        var option_1 = document.getElementsByTagName('option')[5]; //Q1
        var option_2 = document.getElementsByTagName('option')[6]; //Q2
        if(map.img === "Hall_entree.png"){
            var zone_dialogue_accueil = {x: 440, y: 430, width: 40, height: 40};
            if (perso.x < zone_dialogue_accueil.x + zone_dialogue_accueil.width && perso.x + perso.width > zone_dialogue_accueil.x && perso.y < zone_dialogue_accueil.y + zone_dialogue_accueil.height && perso.height + perso.y > zone_dialogue_accueil.y) {
                // zone détectée 
                show_dialogue = true;
            }else{
                show_dialogue = false;
            }
            if(show_dialogue){
                
                p.setAttribute('style', ""); //pour afficher la balise p et son contenu 
                p_2.setAttribute('style', ""); //pour afficher la balise p et son contenu 
                
                select.setAttribute('style', "");
                var html_code = "";
                html_code +="<h2>Bonjour, comment puis-je t'aider ?</h2>";
                p.innerHTML = html_code;
                
                option_1.innerHTML="Comment se passe l'inscription ici pour la L3 ?"; //Q1
                option_2.innerHTML="Ou se trouve le self ?"; //Q2
                var valeur = select.options[select.selectedIndex].value;
                if(valeur != "Q0"){
                    var button = document.getElementsByTagName('input')[1];
                    if(valeur === "Q1"){
                        p_2.innerHTML = "<h3>Via notre site internet</h3>";;
                    }
                    if(valeur === "Q2"){
                        p_2.innerHTML = "<h3>Vers les templiers, à 10 minutes à pieds d'ici</h3>";
                    }
                }
            }else{
                p.innerHTML = "";
                p.setAttribute('style', "display:none;"); //pour cacher la balise p et son contenu 
                option_1.innerHTML=""; //Q1
                option_2.innerHTML=""; //Q2
                select.setAttribute('style', "display:none;");
                p_2.setAttribute('style', "display:none;"); //pour cacher la balise p_2 et son contenu 
            }
        }
    }

    testCollision() { // Collisions faites pour les 4 cotés du Canvas 
        if(map.img == "Map_sol.png"){
            var perso = {x: this.x, y: this.y, width: this.width, height: this.width}; // perso
            var zone = {x: 10, y: 180, width: 590, height: 235}; // MAP / Canvas
        }
        if(map.img == "Hall_entree.png"){
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
        if(map.img === "Hall_entree.png"){
            var accueil_haut = {x: 489, y: 341, width: 300, height: 200}; //zone de l'accueil 
            if (perso.x < accueil_haut.x + accueil_haut.width && perso.x + perso.width > accueil_haut.x && perso.y < accueil_haut.y + accueil_haut.height && perso.height + perso.y > accueil_haut.y) {
                if(dir_event == DIRECTION.BAS || dir_event == DIRECTION.DROITE){
                    // zone détectée !
                    return true;
                }
            }
        }
       return false;
    }

    getPosition(direction) {
        var coord = {'x' : this.x, 'y' : this.y};
        this.getZone_changeMap();
        this.getZone_dialogue();
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

class PNJ extends ObjetGraphique { //PNJ = Personnage Non Joueur
    constructor (posX, posY, name) {
        super(posX, posY, 20, 20);
        this.nom = name;
    }

    move() {
        var coord = {'x' : this.x, 'y' : this.y};
        var prochaineCase = coord;
        super.move(prochaineCase);
    }
}

class Map {
    constructor (ctx) {
        this.img = 'Hall_entree.png';
        this.draw_map(this.img, ctx);
        this.ctx = ctx;
    }

    draw_item(ctx) {
        //console.log("dans draw tile");
        //var img = new Image();
        //img.onload = function() {
            //ctx.drawImage(img, 0, 0);
        //};
        //img.src = 'testTileSet.png';
    }

    draw_map(img, ctx) {
        var attribute = 'background: url('+img+') no-repeat';
        var canvas = document.getElementsByTagName('canvas')[0];
        canvas.setAttribute('style', attribute);
    }

    change_map(img){
        this.img = img;
        this.draw_map(this.img, this.ctx);
        change_pos = true;
    }
}

function initialisationPerso() {
    gf.reset();
    gf.creerPersonnage();
}

