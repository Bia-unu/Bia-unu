/* Canvas 2D, sin dependencias. Ocho goldfish con trayectorias independientes.
   La escena se repite cada 16 segundos para exportarla como GIF sin saltos. */
(function(root){
 'use strict';
 function createAquarium(ctx){
  const W=640,H=320,TAU=Math.PI*2;
  const colors=[['#173f48','#249c88','#65d4a6','#b9f4d1'],['#172f59','#337eb8','#78cce5','#c3f3ee']];
  let seed=92;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const stars=Array.from({length:130},()=>({x:Math.floor(random()*W),y:Math.floor(random()*H),p:random()*TAU,bright:random()>.85}));
  const fish=Array.from({length:8},(_,i)=>({i,phase:i*TAU/8,scale:[1.1,1.3,.9,1.2,1,1.35,.95,1.15][i],speed:i%2===0?1:-1}));
  function polygon(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(Math.round(x),Math.round(y)):ctx.moveTo(Math.round(x),Math.round(y)));ctx.closePath();ctx.fill();}
  function goldfish(f,t,x,y,vx,vy){
   const c=colors[f.i%2],beat=Math.sin(t*TAU/16*16+f.phase),face=vx>=0?1:-1;
   ctx.save();ctx.translate(Math.round(x),Math.round(y));
   // Inclinación leve: mantiene el vientre abajo incluso al cambiar de rumbo.
   ctx.rotate(Math.atan2(vy,Math.abs(vx)+20)*face*.35);ctx.scale(face*f.scale,f.scale);
   // Cola doble de abanico, característica de un goldfish ornamental.
   polygon([[-12,-3],[-21,-10],[-34,-18+beat*3],[-31,-7],[-24,0],[-34,16+beat*3],[-21,11],[-12,4]],c[0]);
   polygon([[-13,-2],[-23,-9],[-31,-14+beat*3],[-27,-5],[-20,0],[-30,13+beat*3],[-22,8],[-13,3]],c[2]);
   polygon([[-14,0],[-27,-9+beat*2],[-22,-1],[-29,9+beat*2]],c[1]);
   // Aleta dorsal alta, vientre redondo y frente curva.
   polygon([[-9,-8],[-7,-17],[0,-22],[5,-14],[12,-7]],c[0]);
   polygon([[-6,-9],[-4,-17],[0,-19],[3,-12],[8,-8]],c[2]);
   polygon([[-13,-6],[-8,-11],[3,-13],[13,-10],[19,-5],[22,0],[20,6],[14,11],[4,14],[-6,11],[-12,6]],c[0]);
   polygon([[-11,-5],[-6,-9],[4,-11],[12,-8],[18,-4],[20,1],[17,7],[11,10],[2,12],[-6,8],[-10,4]],c[1]);
   polygon([[-7,-5],[-3,-9],[5,-9],[13,-6],[16,-2],[7,-3],[1,0],[-8,0]],c[2]);
   polygon([[-4,7],[3,10],[11,8],[15,5],[12,10],[3,12]],c[3]);
   // Escamas y reflejos dibujados como bloques.
   ctx.fillStyle=c[3];ctx.fillRect(-2,-8,5,2);ctx.fillRect(5,-6,3,2);
   ctx.fillStyle=c[0];ctx.fillRect(10,-1,1,7);
   polygon([[0,3],[-7,7+beat*2],[-4,14+beat*2],[4,7]],c[2]);
   polygon([[-5,10],[-2,18],[5,12]],c[1]);
   ctx.fillStyle=c[3];ctx.fillRect(14,-4,5,5);
   ctx.fillStyle='#071421';ctx.fillRect(17,-3,2,3);ctx.fillRect(20,2,3,1);
   ctx.restore();
  }
  function position(f,t){
   const a=t*TAU/16*f.speed+f.phase;
   // Curvas en ocho con alturas y fases distintas: se cruzan por el centro.
   const b=2*a+f.i*.63;
   return {f,x:W/2+Math.sin(a)*(225-f.i*5),y:H/2+Math.sin(b)*(77+f.i*3),vx:Math.cos(a)*f.speed*200,vy:Math.cos(b)*f.speed*160};
  }
  return function draw(t){
   ctx.imageSmoothingEnabled=false;ctx.fillStyle='#080e20';ctx.fillRect(0,0,W,H);
   // Polvo estelar tenue y fijo; las estrellas brillan suavemente.
   for(let k=0;k<48;k++){ctx.fillStyle=k%2?'#101c30':'#111a2b';ctx.fillRect((k*73)%W,90+Math.round(Math.sin(k*.8)*65),25,2);}
   for(const s of stars){ctx.fillStyle=s.bright?'#8aa9b6':'#34465e';ctx.globalAlpha=.55+.45*(Math.sin(t*TAU/16*2+s.p)+1)/2;ctx.fillRect(s.x,s.y,1,1);if(s.bright){ctx.fillRect(s.x-2,s.y,5,1);ctx.fillRect(s.x,s.y-2,1,5);}}
   ctx.globalAlpha=1;
   ctx.fillStyle='#23324a';ctx.fillRect(548,40,22,22);ctx.fillRect(544,44,30,14);ctx.fillRect(552,36,14,30);
   ctx.fillStyle='#385069';ctx.fillRect(548,43,5,11);ctx.fillRect(552,39,10,5);
   const positions=fish.map(f=>position(f,t));
   positions.sort((a,b)=>a.f.scale-b.f.scale);
   for(const p of positions)goldfish(p.f,t,p.x,p.y,p.vx,p.vy);
  };
 }
 root.createAquarium=createAquarium;
 if(typeof module!=='undefined')module.exports={createAquarium};
})(typeof window!=='undefined'?window:globalThis);
