var $=Object.defineProperty;var I=(a,t,r)=>t in a?$(a,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):a[t]=r;var c=(a,t,r)=>(I(a,typeof t!="symbol"?t+"":t,r),r);const C=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const p of n.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&s(p)}).observe(document,{childList:!0,subtree:!0});function r(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerpolicy&&(n.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?n.credentials="include":e.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(e){if(e.ep)return;e.ep=!0;const n=r(e);fetch(e.href,n)}};C();const g=0,y=1,b=2,m=3,i={stackDirty:1,programDirty:2,stdinDirty:4,stdoutDirty:8};class M{constructor(t,r){c(this,"direction",1);c(this,"stringMode",!1);c(this,"width");c(this,"height");c(this,"halted",!1);c(this,"program",[]);c(this,"stdin");c(this,"x",0);c(this,"y",0);c(this,"stdinPos",0);c(this,"stack",[]);c(this,"stdout","");this.stdin=r;const s=t.split(/\n/g);this.width=s.reduce((e,n)=>n.length>e?n.length:e,0),this.height=s.length,s.forEach(e=>{if(e.length<this.width){const n=e+new Array(this.width-e.length+1).join(" ");this.program.push(Array.from(n))}else this.program.push(Array.from(e))})}nextStdinChar(){return this.stdinPos>=this.stdin.length?null:this.stdin.charAt(this.stdinPos++)}nextStdinNum(){if(this.stdinPos>=this.stdin.length)return-1;let t="";for(;this.stdin.charAt(this.stdinPos).match(/[0-9]/);)t+=this.stdin.charAt(this.stdinPos),this.stdinPos++;(this.stdin.charAt(this.stdinPos)===" "||this.stdin.charAt(this.stdinPos)===`
`)&&this.stdinPos++;const r=parseInt(t);return isNaN(r)?-1:r}nextPosition(){let t=this.x,r=this.y;switch(this.direction){case g:r=this.y-1<0?this.height-1:this.y-1;break;case b:r=(this.y+1)%this.height;break;case m:t=this.x-1<0?this.width-1:this.x-1;break;case y:t=(this.x+1)%this.width;break}this.x=t,this.y=r}step(){if(this.halted)return 0;let t=0;const r=this.program[this.y][this.x];if(this.stringMode)return r==='"'?this.stringMode=!1:(this.stack.push(r.charCodeAt(0)),t|=i.stackDirty),this.nextPosition(),t;switch(r){case"v":this.direction=b;break;case">":this.direction=y;break;case"^":this.direction=g;break;case"<":this.direction=m;break;case"0":this.stack.push(0),t|=i.stackDirty;break;case"1":this.stack.push(1),t|=i.stackDirty;break;case"2":this.stack.push(2),t|=i.stackDirty;break;case"3":this.stack.push(3),t|=i.stackDirty;break;case"4":this.stack.push(4),t|=i.stackDirty;break;case"5":this.stack.push(5),t|=i.stackDirty;break;case"6":this.stack.push(6),t|=i.stackDirty;break;case"7":this.stack.push(7),t|=i.stackDirty;break;case"8":this.stack.push(8),t|=i.stackDirty;break;case"9":this.stack.push(9),t|=i.stackDirty;break;case"+":{const s=this.stack.pop()||0,e=this.stack.pop()||0;this.stack.push(s+e),t|=i.stackDirty;break}case"-":{const s=this.stack.pop()||0,e=this.stack.pop()||0;this.stack.push(e-s),t|=i.stackDirty;break}case"/":{const s=this.stack.pop()||0,e=this.stack.pop()||0;this.stack.push(Math.floor(e/s)),t|=i.stackDirty;break}case"*":{const s=this.stack.pop()||0,e=this.stack.pop()||0;this.stack.push(s*e),t|=i.stackDirty;break}case"%":{const s=this.stack.pop()||0,e=this.stack.pop()||0;this.stack.push(e%s),t|=i.stackDirty;break}case"!":{(this.stack.pop()||0)===0?this.stack.push(1):this.stack.push(0),t|=i.stackDirty;break}case"`":{const s=this.stack.pop()||0;(this.stack.pop()||0)>s?this.stack.push(1):this.stack.push(0),t|=i.stackDirty;break}case"?":{const s=Math.random();s<.25?this.direction=g:s<.5?this.direction=y:s<.75?this.direction=b:this.direction=m;break}case"_":{(this.stack.pop()||0)===0?this.direction=y:this.direction=m,t|=i.stackDirty;break}case"|":{(this.stack.pop()||0)===0?this.direction=b:this.direction=g,t|=i.stackDirty;break}case":":{const s=this.stack.pop()||0;s===void 0?(this.stack.push(0),this.stack.push(0)):(this.stack.push(s),this.stack.push(s)),t|=i.stackDirty;break}case"\\":{const s=this.stack.pop()||0,e=this.stack.pop()||0;this.stack.push(s),this.stack.push(e),t|=i.stackDirty;break}case"$":{this.stack.pop(),t|=i.stackDirty;break}case".":{const s=this.stack.pop()||0;this.stdout+=s+" ",t|=i.stackDirty|i.stdoutDirty;break}case",":{const s=this.stack.pop()||0;this.stdout+=String.fromCharCode(s),t|=i.stackDirty|i.stdoutDirty;break}case"#":{this.nextPosition();break}case"p":{const s=this.stack.pop(),e=this.stack.pop(),n=this.stack.pop();if(t|=i.stackDirty,s===void 0||e===void 0||n===void 0)break;this.program[s][e]=String.fromCharCode(n),t|=i.programDirty;break}case"g":{const s=this.stack.pop()||0,e=this.stack.pop()||0;if(e<this.width&&s<this.height){const n=this.program[s][e];this.stack.push(n.charCodeAt(0))}else this.stack.push(0);t|=i.stackDirty;break}case"&":{this.stack.push(this.nextStdinNum()),t|=i.stackDirty|i.stdinDirty;break}case"~":{const s=this.nextStdinChar();if(!s){t|=i.stackDirty,this.stack.push(-1);break}this.stack.push(s.charCodeAt(0)),t|=i.stackDirty|i.stdinDirty;break}case"@":return this.halted=!0,t;case'"':{this.stringMode=!0;break}}return this.nextPosition(),t}}class A{constructor(t,r,s,e,n,p){c(this,"ticks",0);c(this,"start");c(this,"tbody");c(this,"currHighlight");this.interpreter=t,this.programEl=r,this.stackEl=s,this.stdinEl=e,this.stdoutEl=n,this.statsEl=p,this.renderProgram(),this.renderStdin(),this.renderStack(),this.renderStdout()}renderStdin(){if(!(this.interpreter.stdin.length>0))return;const{stdin:t,stdinPos:r}=this.interpreter;r<t.length?this.stdinEl.innerHTML=t.substring(0,r)+"<strong><u>"+t[r]+"</u></strong>"+t.substring(r+1):this.stdinEl.innerHTML=t+"<strong>EOF</strong>"}renderStack(){let t="";for(let r=this.interpreter.stack.length-1;r>=0;r--){const s=this.interpreter.stack[r];t+=`<li class="list-group-item">${s}${s>31?` (<span class="fw-lighter">${String.fromCharCode(s)}</span>)`:""}</li>`}this.stackEl.innerHTML=t}renderProgram(){let t='<table class="table table-dark table-bordered"><tbody id="table-body">';for(let r=0;r<this.interpreter.program.length;r++){const s=this.interpreter.program[r];t+="<tr>";for(let e=0;e<s.length;e++)t+=`<td id="${e===this.interpreter.x&&r===this.interpreter.y?"highlight":""}">${s[e]}</td>`;t+="</tr>"}t+="</tbody></table>",this.programEl.innerHTML=t,this.tbody=document.getElementById("table-body"),this.currHighlight=document.querySelector("#highlight")}renderStdout(){this.stdoutEl.innerHTML=this.interpreter.stdout}renderTick(t,r){if(t&i.programDirty)this.renderProgram();else{const{x:s,y:e}=this.interpreter;if(this.currHighlight.id="",this.tbody.children.length>e){const n=this.tbody.children[e];if(n.children.length>s){const p=n.children[s];this.currHighlight=p,p.id="highlight"}}}if(t&i.stdoutDirty&&this.renderStdout(),t&i.stdinDirty&&this.renderStdin(),t&i.stackDirty&&this.renderStack(),this.start||(this.start=performance.now()),this.ticks%60===0){const s=(performance.now()-this.start)/1e3,e=this.ticks*r/s;this.statsEl.innerText=`${e.toFixed(0)} OP/S`}this.ticks++}}let h=60;function o(a){const t=document.getElementById(a);if(!t)throw new Error(`No element exists for id ${a}`);return t}const k=o("start-stop"),H=o("program-display"),N=o("stack-display"),O=o("stdout"),P=o("stats"),F=o("stdin"),S=o("stdin-text"),w=o("script"),x=o("run");let l,u,d;o("compile").addEventListener("click",()=>{d&&(clearInterval(d),d=void 0),l=new M(w.value,S.value),u=new A(l,H,N,F,O,P),k.innerText=`Start (${h})`});function T(){d&&clearInterval(d),d=setInterval(()=>{const a=l.step();u.renderTick(a,1),l.halted&&clearInterval(d)},h)}k.addEventListener("click",()=>{if(d){clearInterval(d),d=void 0,k.innerText=`Start (${h})`;return}const a=l.step();u.renderTick(a,1),T(),k.innerText=`Stop (${h})`});o("step").addEventListener("click",()=>{const a=l.step();u.renderTick(a,1)});o("speed-up").addEventListener("click",()=>{h=Math.max(0,Math.floor(h*.75)),d?(k.innerText=`Stop (${h})`,T()):k.innerText=`Start (${h})`});o("slow-down").addEventListener("click",()=>{h+=Math.ceil(h*.25)||1,d?(k.innerText=`Stop (${h})`,T()):k.innerText=`Start (${h})`});const D=1e5;let f,v,E=!1;function L(){if(E)return;let a,t=0;for(a=0;a<D&&!l.halted;a++)t|=l.step();if(l.halted){const s=performance.now()-f,e=(a+v)/(s/1e3);u.renderTick(i.programDirty|i.stackDirty|i.stdinDirty|i.stdoutDirty,D),P.innerText=`Took ${s.toFixed(2)}ms, running at ${e.toFixed(0)} Ops/Sec. Total of ${v+a} operations.`,E=!0,f=0,x.textContent="Start"}else v+=D,u.renderTick(t,D),window.requestAnimationFrame(L)}x.addEventListener("click",()=>{if(f){E=!0,f=0,x.textContent="Start";return}x.textContent="Stop",E=!1,v=0,f=performance.now(),L()});w.addEventListener("change",()=>{localStorage.setItem("program",w.value)});S.addEventListener("change",()=>{localStorage.setItem("stdin",S.value)});document.addEventListener("DOMContentLoaded",()=>{let a=localStorage.getItem("program"),t=localStorage.getItem("stdin");a&&(w.value=a),t&&(S.value=t),o("compile").click()});