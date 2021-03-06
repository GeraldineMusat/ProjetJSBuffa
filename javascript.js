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
            r.clear(ctx);
        });
        tableauObjetGraphiques.forEach(function(r){
          r.dessineCorps(ctx);
          r.move();
        });
        requestAnimationFrame(anime);
    }

    function creerPersonnage(nom, age, formation){
        //console.log("Dans creer perso");
        let perso = new Personnage(this.w/2, this.h/2, nom, age, formation);//posX et posY
        let pnj_1 = new PNJ(541,472,"acceuil", POSTE.MAP_ENTREE);
        let pnj_2 = new PNJ(350,300, "Tounsi", POSTE.MAP_SALLE);
        let pnj_3 = new PNJ(220,350,"Buffa", POSTE.MAP_ENTREE);
        let pnj_4 = new PNJ(450,100, "Habiba", POSTE.MAP_ENTREE);
        let pnj_5 = new PNJ(450,150, "Geraldine", POSTE.MAP_SALLE);
        map = new Map(ctx);
        tableauObjetGraphiques.push(perso);
        tableauObjetGraphiques.push(pnj_1);
        tableauObjetGraphiques.push(pnj_2);
        tableauObjetGraphiques.push(pnj_3);
        tableauObjetGraphiques.push(pnj_4);
        tableauObjetGraphiques.push(pnj_5); 
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

    clear(ctx){
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
    constructor (posX, posY, nom, age, formation){
        super(posX, posY, 20, 20);
        this.nom = nom;
        this.age = age;
        this.formation = formation;
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

    config_dialogue(zone, tab, p, p_2, select, option_1, option_2, img, h3){
        var perso = {x: this.x, y: this.y, width: this.width, height: this.width}; //met a jour les coordonées du perso
        
        if (perso.x < zone.x + zone.width && perso.x + perso.width > zone.x && perso.y < zone.y + zone.height && perso.height + perso.y > zone.y) {
            // zone détectée 
            console.log(tab[0]);
            img.setAttribute('style', "");
            p.setAttribute('style', ""); //pour afficher la balise p et son contenu 
            p_2.setAttribute('style', ""); //pour afficher la balise p et son contenu 
            select.setAttribute('style', "");
            h3.setAttribute('style', "");
            p.innerHTML = tab[0];
            option_1.innerHTML=tab[1]; //Q1
            option_2.innerHTML=tab[2]; //Q2
            var valeur = select.options[select.selectedIndex].value;
            if(valeur != "Q0"){
                if(valeur === "Q1"){
                    p_2.innerHTML = tab[3];
                }
                if(valeur === "Q2"){
                    p_2.innerHTML = tab[4];
                }
            }
            img.setAttribute('src', tab[5]);
            h3.innerHTML=tab[6];
            return true;
        }else{
           return false;
        }
    }

    getZone_dialogue() {
        var perso = {x: this.x, y: this.y, width: this.width, height: this.width}; //met a jour les coordonées du perso
        var img = document.getElementsByTagName('img')[0];
        var p = document.getElementsByTagName('p')[0];
        var p_2 = document.getElementsByTagName('p')[1];
        var select = document.getElementsByTagName('select')[0];
        var option_1 = document.getElementsByTagName('option')[1]; //Q1
        var option_2 = document.getElementsByTagName('option')[2]; //Q2
        var h3 = document.getElementsByTagName('h3')[0];
        var val_ret;
        var zone;
        if(map.img === "Hall_entree.png"){
            var zone_dialogue_accueil = {x: 440, y: 430, width: 40, height: 40};
            var zone_dialogue_Buffa = {x: 170, y: 300, width: 100, height: 100};
            var zone_dialogue_Habiba = {x:400, y:50, width: 100, height:100}; 
            zone = zone_dialogue_accueil;
            if (perso.x < zone.x + zone.width && perso.x + perso.width > zone.x && perso.y < zone.y + zone.height && perso.height + perso.y > zone.y) {
                var tab_phrases = [
                    "<h2>Bonjour "+ this.nom +", comment puis-je t'aider ?</h2>",
                    "Ou se trouve le self ?",
                    "Vous etes un professeur ?",
                    "<h3>Via notre site internet</h3>",
                    "<h3>Vers les templiers, à 10 minutes à pieds d'ici</h3>",
                    "accueil.jpg",
                    "Dame de l'accueil"
                ];
                val_ret = this.config_dialogue(zone_dialogue_accueil, tab_phrases, p, p_2, select, option_1, option_2,img,h3);
            }
            zone = zone_dialogue_Habiba; 
            if (perso.x < zone.x + zone.width && perso.x + perso.width > zone.x && perso.y < zone.y + zone.height && perso.height + perso.y > zone.y) {
                var tab_phrases = [
                    "<h2>Salut "+ this.nom +", je suis Habiba, une étudiante en L3 MIAGE, comment puis-je t'aider ?</h2>",
                    "Quels sont les effectifs en L3 MIAGE?",
                    "Quels sont les différents cours dispensés?",
                    "<h3> Les effectifs en L3 MIAGE sont de 50 étudiants. </h3>",
                    "<h3>-Un module générale : avec les matières scientifiques, de communication, d'étude de marché <br/> -Un module informatique: php, js, java, base de données <br/>-Stage : expérience professionnelle de 3 à 6 mois</h3>",
                    "habiba.jpg",
                    "Etudiante Habiba"
                ];
                val_ret = this.config_dialogue(zone_dialogue_Habiba, tab_phrases, p, p_2, select, option_1, option_2,img,h3);
            }
            zone = zone_dialogue_Buffa;
            if (perso.x < zone.x + zone.width && perso.x + perso.width > zone.x && perso.y < zone.y + zone.height && perso.height + perso.y > zone.y) {
                var tab_phrases = [
                    "<h2>Hello I am Buffa ! I have a very good accent ! And the Js is SO fun !!</h2>",
                    "Quelles sont vos méthodes de travail en Miage ? Plutôt en groupe, plutôt en solitaire ?",
                    "Quels sont les profils des étudiants qui intègrent l’école ?",
                    "<h3>En MIAGE, nos méthodes de travail sont les travails en groupe et seuls afin de développer des compétences pour le  monde le professionel.</h3>",
                    "<h3>Les profits des étudiants qui intègrent l'école sont : <br/> -des étudiants provenant d'un cursus informatique <br/> -des étudiants provenant d'un cursus de gestion</h3>",
                    "buffa.jpg",
                    "Professeur Mr Michel Buffa"
                ];
                val_ret = this.config_dialogue(zone_dialogue_Buffa, tab_phrases, p, p_2, select, option_1, option_2,img,h3);
            }
        }
        if(map.img === "Map_sol.png"){
            var zone_dialogue_Tounsi = {x: 300, y: 250, width: 100, height: 100};
            var zone_dialogue_Geraldine = {x: 400, y: 100, width: 100, height: 100};
            zone = zone_dialogue_Tounsi;
            if (perso.x < zone.x + zone.width && perso.x + perso.width > zone.x && perso.y < zone.y + zone.height && perso.height + perso.y > zone.y) {
                var tab_phrases = [
                    "<h2>Bonjour "+ this.nom +" je suis Mr Tounsi, voici une partie des salles de classe</h2>",
                    "Quels sont les masters proposés?",
                    "Peut-on faire de l’alternance en master?",
                    "<h3>Très bonne question ! C'est le nerf de la guerre ca jeune "+ this.nom +" ! <br/>Les masters proposés sont : <br/> - NTDP (Nouvelles Technologies et Direction de Projets). <br/> - SIRIS (Systèmes d'Information et Management du Risque). <br/> - MBDS (Mobiquité, Bases de Données et Intégration de Systèmes). <br/> - SD (Sciences de la Décision).<br/> La MIAGE c'est très très bien, c'est magnifique.</h3>",
                    "<h3>Dès septembre l'alternance en Master 1 et 2 est possible, c'est pas beau ça ?</h3>",
                    "tounsi.jpg",
                    "Professeur Mr Stéphane Tounsi"
                ];
                val_ret = this.config_dialogue(zone_dialogue_Tounsi, tab_phrases, p, p_2, select, option_1, option_2,img,h3);
            }
            zone = zone_dialogue_Geraldine;
            if (perso.x < zone.x + zone.width && perso.x + perso.width > zone.x && perso.y < zone.y + zone.height && perso.height + perso.y > zone.y) {
                var tab_phrases = [
                    "<h2>Hello ! Je suis Geraldine, nous avons avec Habiba réalisé ce jeu, il te plait ?</h2>",
                    "Oui !",
                    "Il y a du chauffage dans les salles ?",
                    "<h3>AAh tu vas te plaire ici alors !</h3>",
                    "<h3>Oui au fond des salles ou dans l'amphi 1 </h3>",
                    "geraldine.jpg",
                    "Etudiante Geraldine"
                ];
                val_ret = this.config_dialogue(zone_dialogue_Geraldine, tab_phrases, p, p_2, select, option_1, option_2,img,h3);
            }
        }
        if(!val_ret){
            p.innerHTML = "";
            p.setAttribute('style', "display:none;"); //pour cacher la balise p et son contenu 
            option_1.innerHTML=""; //Q1
            option_2.innerHTML=""; //Q2
            select.setAttribute('style', "display:none;");
            p_2.setAttribute('style', "display:none;"); //pour cacher la balise p_2 et son contenu 
            img.setAttribute('src', "");
            img.setAttribute('style', "display:none;");
            h3.innerHTML=""; //titre
            h3.setAttribute('style', "display:none;");
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
            var zone_entree = {x: 30, y: 555, width: 500, height: 500}; //zone de l'entree 
            if (perso.x < zone_entree.x + zone_entree.width && perso.x + perso.width > zone_entree.x && perso.y < zone_entree.y + zone_entree.height && perso.height + perso.y > zone_entree.y){
                if(dir_event == DIRECTION.BAS){
                    return true;
                }
            }    
        }
        if(map.img === "Map_sol.png"){
            var Tounsi = {x: 350, y: 300, width: 20, height: 20}; //collision avec Tounsi juste devant lui
            if (perso.x < Tounsi.x + Tounsi.width && perso.x + perso.width > Tounsi.x && perso.y < Tounsi.y + Tounsi.height && perso.height + perso.y > Tounsi.y) {
                if( dir_event == DIRECTION.GAUCHE){
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

var POSTE = {
    "MAP_ENTREE" :0,
    "MAP_SALLE"  :1
}

class PNJ extends ObjetGraphique { //PNJ = Personnage Non Joueur
    constructor (posX, posY, name, poste) {
        super(posX, posY, 20, 20);
        this.nom = name;
        this.poste = poste;
    }

    move() {
        var coord = {'x' : this.x, 'y' : this.y};
        var prochaineCase = coord;
        super.move(prochaineCase);
    }

    dessineCorps(ctx){
        if(map.img === "Hall_entree.png" && this.poste === POSTE.MAP_ENTREE)
            super.dessineCorps(ctx);
        if(map.img === "Map_sol.png" && this.poste === POSTE.MAP_SALLE)
            super.dessineCorps(ctx);
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

function twRequeteVariable(sVariable) { //fonction trouvé sur ce site interent => http://www.trucsweb.com/tutoriels/javascript/tw303/
    // Éliminer le "?"
    var sReq = window.location.search.substring(1);
    // Matrice de la requête
    var aReq = sReq.split("&");
    // Boucle les variables
    for (var i=0;i<aReq.length;i++) {
      // Matrice de la variables / valeur
      var aVar = aReq[i].split("=");
      // Retourne la valeur si la variable 
      // demandée = la variable de la boucle
      if(aVar[0] == sVariable){return aVar[1];}
    }
    // Aucune variable de trouvée.
    return(false);
}

function initialisationPerso() {
    var nom = twRequeteVariable("nom");
    var age = twRequeteVariable("age");
    var formation = twRequeteVariable("formation");
    console.log("nom : "+nom +" age : "+ age +" formation : "+ formation );
    gf.reset();
    gf.creerPersonnage(nom, age, formation);
}

