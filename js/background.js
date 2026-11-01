/* WebGL background shader (React Bits style Plasma/Aurora, ported to vanilla JS) */
(function(){
const c=document.getElementById("bg");
// If anything GL-related fails, drop the canvas so the CSS gradient bg shows
// instead of an opaque black quad.
const fallback=()=>{c.style.display="none"};
const gl=c.getContext("webgl",{antialias:false,alpha:false});
if(!gl){fallback();return}

const vs="attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const fs=`precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return s;}
void main(){
vec2 p=(gl_FragCoord.xy-.5*r)/r.y;vec2 mm=(m-.5)*vec2(r.x/r.y,1.);float tt=t*.07;
vec2 q=vec2(fbm(p*1.3+tt),fbm(p*1.3+vec2(5.2,1.3)-tt));
float f=fbm(p*1.5+2.*q+mm*.35+tt);
float band=.5+.5*sin(5.*f+p.x*2.+t*.2);
vec3 base=vec3(.075,.075,.082),pu=vec3(.36,.18,.85),bl=vec3(.2,.34,.95);
vec3 col=base;
col+=pu*smoothstep(.4,.95,f)*.38;
col+=bl*smoothstep(.55,1.,q.x)*.2*band;
col*=mix(.75,1.,smoothstep(1.5,.3,length(p)));
float g=exp(-2.*length(p-vec2(-.9,.22)))*.9+exp(-2.*length(p-vec2(.95,-.1)))*.8+exp(-2.2*length(p-vec2(.1,-.8)))*.2;
g*=.93+.07*sin(t*.5);
col+=pu*g*.75;
col+=pu*exp(-7.*length(p-mm))*.1;
col+=(h(gl_FragCoord.xy+fract(t))-.5)*.012;
gl_FragColor=vec4(col,1.);}`;

function sh(t,s){const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);
if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)){gl.deleteShader(o);return null}return o}
try{
const v=sh(gl.VERTEX_SHADER,vs),f=sh(gl.FRAGMENT_SHADER,fs);
if(!v||!f){fallback();return}
const pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);
if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){fallback();return}
gl.useProgram(pr);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
const a=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
const U={r:gl.getUniformLocation(pr,"r"),t:gl.getUniformLocation(pr,"t"),m:gl.getUniformLocation(pr,"m")};
let S=.55,mx=.5,my=.5,sx=.5,sy=.5,lost=false;
function rs(){c.width=Math.max(2,innerWidth*S|0);c.height=Math.max(2,innerHeight*S|0);gl.viewport(0,0,c.width,c.height)}
addEventListener("resize",rs);rs();
addEventListener("pointermove",e=>{mx=e.clientX/innerWidth;my=1-e.clientY/innerHeight},{passive:true});
c.addEventListener("webglcontextlost",e=>{e.preventDefault();lost=true;fallback()});
const still=matchMedia("(prefers-reduced-motion:reduce)").matches;let t0=performance.now(),vis=true,raf=false;
document.addEventListener("visibilitychange",()=>{vis=!document.hidden;if(vis&&!raf)raf=requestAnimationFrame(fr)});
function fr(now){raf=false;if(!vis||lost)return;sx+=(mx-sx)*.04;sy+=(my-sy)*.04;
gl.uniform2f(U.r,c.width,c.height);gl.uniform1f(U.t,still?12:(now-t0)/1000+12);gl.uniform2f(U.m,sx,sy);gl.drawArrays(gl.TRIANGLES,0,3);
if(!still)raf=requestAnimationFrame(fr)}
raf=requestAnimationFrame(fr);
}catch(e){fallback()}
})();
