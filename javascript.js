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
        w=canvas.width;
        h=canvas.height;
        requestAnimationFrame(anime);
    }

    function anime(timeElapsed){
        ctx.clearRect(0,0,w,h);
        tableauObjetGraphiques.forEach(function(r){
          r.draw(ctx);
          r.move();
          r.testCollisionZone(w,h);
        });
        requestAnimationFrame(anime);
    }

    function reset() {
        tableauObjetGraphiques=[];
    }

    return {
        init:init,
        reset:reset
      }
}
