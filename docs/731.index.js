"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[731],{3731:(e,t,r)=>{r.r(t),r.d(t,{default:()=>x});var n,a=r(41120),o=r(48623),l=r(22318),i=r(41749),u=r(89762),c=r.n(u),d=r(67294),s=r(65136),f=r(33170),m=r(97229),p=r(41020),v=r(15484),y=r(68276),g=r(9630),h=r(43017),b=r(8683),E=r(97918),L=r(56912);function S(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,o=[],l=!0,i=!1;try{for(r=r.call(e);!(l=(n=r.next()).done)&&(o.push(n.value),!t||o.length!==t);l=!0);}catch(e){i=!0,a=e}finally{try{l||null==r.return||r.return()}finally{if(i)throw a}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return w(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?w(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function w(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e);var H,G,A="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e},Z=(0,a.Z)({root:{position:"absolute",width:"100vw",height:"100vh",overflow:"hidden",cursor:"none",backgroundSize:"cover"}},{name:"App"});function x(){var e=Z(),t=S(d.useState(Date.now),2),r=t[0],n=(t[1],d.useRef(0));(0,b.Z)((function(){ae&&(n.current+=.016)}),16);var a=d.useRef();d.useEffect((function(){a.current=new(c())({background:"#000",quality:10,repeat:0})}),[]);var u=S(d.useState(!1),2),w=u[0],H=u[1],G=S(d.useState(!1),2),A=G[0],x=G[1];(0,h.Z)((function(e,t){if(e==h.M.Up&&"Escape"===t)x(!A);else if(!A){var r=a.current;r&&e===h.M.Up&&"KeyR"===t&&(w||(H(!0),n.current=0,setTimeout((function(){H(!1),r.on("progress",(function(e){})),r.on("finished",(function(e){window.open(URL.createObjectURL(e))})),r.render(),a.current=new(c())}),8e3)))}}));var R=(0,E.Z)("shaders/backgrounds.json"),_=(0,E.Z)("shaders/foregrounds.json"),D=S((0,L.Nc)("bg.pattern",""),2),M=D[0],k=D[1],C=S((0,L.$w)("bg.speed",1),2),I=C[0],P=C[1],j=S((0,L.Nc)("fg.pattern",""),2),O=j[0],T=j[1],F=S((0,L.$w)("fg.speed",1),2),B=F[0],U=F[1],W=S((0,L.$w)("sb.spacing",1),2),z=W[0],N=W[1],$=S((0,L.$w)("sb.speed",1),2),q=$[0],Q=$[1],V=S((0,L.Nc)("sb.anim","fade"),2),J=V[0],X=V[1],K=S((0,L.aM)("sb.text"),2),Y=K[0],ee=K[1],te=S((0,g.xW)(),2),re=(te[0],te[1]),ne=(0,g.s_)(),ae=!A;return(0,b.Z)((function(){if(0===ne.length||A)re(0);else{var e=(1+Math.cos(.25*n.current))/2;re(Math.min(.5,Math.max(0,1*(e+-.25))))}}),100),d.createElement(d.Fragment,null,d.createElement(p.Xz,{className:e.root,postDraw:function(e,t){return a.current&&w&&a.current.addFrame(t,{delay:16,copy:!0}),a}},d.createElement(d.Fragment,null,M&&d.createElement(v.Z,{zIndex:1,timer:function(){return n.current},play:ae,speed:I,pattern:M}),Y.length>0&&d.createElement(y.Z,{zIndex:0,positionSelector:(0,y.t)(r),timer:function(){return n.current},play:ae,animation:J,speed:q,spacing:z,values:Y}),O&&d.createElement(v.Z,{zIndex:2,timer:function(){return n.current},play:ae,speed:B,pattern:O}))),d.createElement(o.Z,{open:A},d.createElement("div",{style:{padding:"1em"}},d.createElement(l.Z,{variant:"h1",paragraph:!0},"HypnoGen"),d.createElement(i.Z,{container:!0,spacing:2,alignItems:"center"},d.createElement(i.Z,{item:!0,xs:12},d.createElement(l.Z,{variant:"h3",paragraph:!0},"Background"),d.createElement(f.Z,{patterns:null!=R?R:[],pattern:M,speed:I,onChange:function(e){var t=e.pattern,r=e.speed;k(t),P(r)}})),d.createElement(i.Z,{item:!0,xs:12},d.createElement(l.Z,{variant:"h3",paragraph:!0},"Foreground"),d.createElement(f.Z,{patterns:null!=_?_:[],pattern:O,speed:B,onChange:function(e){var t=e.pattern,r=e.speed;T(t),U(r)}})),d.createElement(i.Z,{item:!0,xs:12},d.createElement(l.Z,{variant:"h3",paragraph:!0},"Subliminals"),d.createElement(m.Z,{animation:J,text:Y,speed:q,spacing:z,onChange:function(e){var t=e.animation,r=e.speed,n=e.spacing,a=e.text;X(t),Q(r),N(n),ee(a)}})),d.createElement(i.Z,{item:!0,xs:12},d.createElement(l.Z,{variant:"h3",paragraph:!0},"Haptics"),d.createElement(s.Z,null))))))}A(x,"useAppStyles{classes}\nuseState{[seed, _](Date.now)}\nuseRef{timer}\nuseInterval{}\nuseRef{gif}\nuseEffect{}\nuseState{[recording, setRecording](false)}\nuseState{[showDrawer, setShowDrawer](false)}\nuseJsonFile{availableBackgrounds}\nuseJsonFile{availableForegrounds}\nuseQueryString{[selectedBackground, setSelectedBackground]}\nuseQueryNumber{[backgroundSpeed, setBackgroundSpeed]}\nuseQueryString{[selectedForeground, setSelectedForeground]}\nuseQueryNumber{[foregroundSpeed, setForegroundSpeed]}\nuseQueryNumber{[subliminalSpacing, setSubliminalSpacing]}\nuseQueryNumber{[subliminalSpeed, setSubliminalSpeed]}\nuseQueryString{[subliminalAnimation, setSubliminalAnimation]}\nuseQuery{[subliminalText, setSubliminalText]}\nuseButtplugVibrate{[_v, vibrate]}\nuseButtplugDevices{devices}\nuseInterval{}",(function(){return[Z,b.Z,E.Z,E.Z,L.Nc,L.$w,L.Nc,L.$w,L.$w,L.$w,L.Nc,L.aM,g.xW,g.s_,b.Z]})),(H="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&(H.register(Z,"useAppStyles","D:\\Development\\hypnogen\\src\\App.tsx"),H.register(x,"App","D:\\Development\\hypnogen\\src\\App.tsx")),(G="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&G(e)},65136:(e,t,r)=>{r.d(t,{Z:()=>d});var n,a=r(67294),o=r(41749),l=r(282),i=r(9630);function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e);var c=function(){var e,t,r=(e=(0,i.pQ)(),t=2,function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,o=[],l=!0,i=!1;try{for(r=r.call(e);!(l=(n=r.next()).done)&&(o.push(n.value),!t||o.length!==t);l=!0);}catch(e){i=!0,a=e}finally{try{l||null==r.return||r.return()}finally{if(i)throw a}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return u(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?u(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),n=r[0],c=r[1],d=(0,i.s_)();return a.createElement(o.Z,{container:!0,spacing:2,alignItems:"center"},d.map((function(e,t){return a.createElement(o.Z,{item:!0,xs:12,key:t},a.createElement(o.Z,{container:!0,spacing:2},a.createElement(o.Z,{item:!0,style:{flexGrow:1}},e.Name)))})),a.createElement(o.Z,{item:!0,xs:12},a.createElement(l.Z,{disabled:n,variant:"contained",color:"primary",onClick:c},"Add device")))};("undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e})(c,"useButtplugScan{[scanning, scan]}\nuseButtplugDevices{devices}",(function(){return[i.pQ,i.s_]}));const d=c;var s,f;(s="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&s.register(c,"default","D:\\Development\\hypnogen\\src\\components\\HapticEditor.tsx"),(f="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&f(e)},33170:(e,t,r)=>{r.d(t,{Z:()=>f});var n,a,o,l=r(41749),i=r(64981),u=r(46479),c=r(22318),d=r(44845),s=r(67294);function f(e){var t=e.patterns,r=e.pattern,n=e.speed,a=e.onChange;return s.createElement(l.Z,{container:!0,spacing:2,alignItems:"center"},s.createElement(l.Z,{item:!0,xs:12},s.createElement(i.Z,{label:"Background Effect",fullWidth:!0,value:r,onChange:function(e){return a({speed:n,pattern:e.target.value})}},s.createElement(u.Z,{value:""},"None"),null==t?void 0:t.map((function(e,t){return s.createElement(u.Z,{key:t,value:e},e)})))),s.createElement(l.Z,{item:!0,xs:12},s.createElement(l.Z,{container:!0,spacing:2,alignItems:"center"},s.createElement(l.Z,{item:!0},s.createElement(c.Z,{variant:"body1"},s.createElement("strong",null,"Speed"))),s.createElement(l.Z,{item:!0,xs:!0},s.createElement(d.Z,{value:n,min:0,max:2,step:.25,onChange:function(e,t){a({pattern:r,speed:t})}})),s.createElement(l.Z,{item:!0},s.createElement(c.Z,{style:{minWidth:"2em"},variant:"body1"},n)))))}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e),"undefined"!=typeof reactHotLoaderGlobal&&reactHotLoaderGlobal.default.signature,(a="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&a.register(f,"PatternEditor","D:\\Development\\hypnogen\\src\\components\\PatternEditor.tsx"),(o="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&o(e)},97229:(e,t,r)=>{r.d(t,{Z:()=>m});var n,a,o,l=r(41749),i=r(36253),u=r(64981),c=r(46479),d=r(22318),s=r(44845),f=r(67294);function m(e){var t=e.text,r=e.speed,n=e.spacing,a=e.animation,o=e.onChange;return f.createElement(l.Z,{container:!0,spacing:2,alignItems:"center"},f.createElement(l.Z,{item:!0,xs:12},f.createElement(i.Z,{label:"Messages",multiline:!0,fullWidth:!0,value:t.join("\n"),onChange:function(e){return o({animation:a,spacing:n,speed:r,text:e.target.value.split("\n")})}})),f.createElement(l.Z,{item:!0,xs:12},f.createElement(u.Z,{fullWidth:!0,label:"Animation",value:a,onChange:function(e){return o({animation:e.target.value,spacing:n,speed:r,text:t})}},f.createElement(c.Z,{value:"collapse"},"Collapse"),f.createElement(c.Z,{value:"fade"},"Fade"),f.createElement(c.Z,{value:"grow"},"Grow"),f.createElement(c.Z,{value:"slide"},"Slide"),f.createElement(c.Z,{value:"zoom"},"Zoom"))),f.createElement(l.Z,{item:!0,xs:12},f.createElement(l.Z,{container:!0,spacing:2,alignItems:"center"},f.createElement(l.Z,{item:!0},f.createElement(d.Z,{variant:"body1"},f.createElement("strong",null,"Speed"))),f.createElement(l.Z,{item:!0,xs:!0},f.createElement(s.Z,{value:r,min:0,max:5,step:.25,onChange:function(e,r){o({animation:a,spacing:n,text:t,speed:r})}})),f.createElement(l.Z,{item:!0},f.createElement(d.Z,{style:{minWidth:"2em"},variant:"body1"},r)))),f.createElement(l.Z,{item:!0,xs:12},f.createElement(l.Z,{container:!0,spacing:2,alignItems:"center"},f.createElement(l.Z,{item:!0},f.createElement(d.Z,{variant:"body1"},f.createElement("strong",null,"Spacing"))),f.createElement(l.Z,{item:!0,xs:!0},f.createElement(s.Z,{value:n,min:0,max:5,step:1,onChange:function(e,n){o({animation:a,speed:r,text:t,spacing:n})}})),f.createElement(l.Z,{item:!0},f.createElement(d.Z,{style:{minWidth:"2em"},variant:"body1"},n)))))}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e),"undefined"!=typeof reactHotLoaderGlobal&&reactHotLoaderGlobal.default.signature,(a="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&a.register(m,"PatternEditor","D:\\Development\\hypnogen\\src\\components\\SubliminalEditor.tsx"),(o="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&o(e)},41020:(e,t,r)=>{r.d(t,{L6:()=>s,Xz:()=>y});var n,a=r(67294),o=r(83363),l=r(55164);function i(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,o=[],l=!0,i=!1;try{for(r=r.call(e);!(l=(n=r.next()).done)&&(o.push(n.value),!t||o.length!==t);l=!0);}catch(e){i=!0,a=e}finally{try{l||null==r.return||r.return()}finally{if(i)throw a}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return u(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?u(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e);var c="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e},d=a.createContext({canvas:null,renders:[],nextRenderId:function(){return 0}});function s(e,t){var r=a.useContext(d),n=a.useRef(t);a.useEffect((function(){n.current=t}),[t]),a.useEffect((function(){var t=r.nextRenderId();return r.renders.push([t,function(e,t){return n.current(e,t)},e]),r.renders.sort((function(e,t){var r=i(e,3),n=(r[0],r[1],r[2]),a=i(t,3);return a[0],a[1],n-a[2]})),function(){r.renders.splice(r.renders.findIndex((function(e){var r=i(e,3),n=r[0];return r[1],r[2],n===t})),1)}}),[e])}function f(){return a.useContext(d).canvas}c(s,"useContext{context}\nuseRef{renderer}\nuseEffect{}\nuseEffect{}"),c(f,"useContext{context}");var m,p,v=function(e){var t=e.postDraw,r=e.canvas,n=e.children,l=a.useRef([]).current,u=a.useRef(0),c=a.useMemo((function(){return r.getContext("2d")}),[r]);return(0,o.Z)((function(){c.clearRect(0,0,r.width,r.height),c.fillStyle="black",c.fillRect(0,0,r.width,r.height),l.forEach((function(e){var t=i(e,3),n=(t[0],t[1]);t[2],n(c,r)})),t&&t(c,r)})),a.createElement(d.Provider,{value:{canvas:r,renders:l,nextRenderId:function(){return u.current++}}},n)};function y(e){var t=e.postDraw,r=e.className,n=e.children,o=i((0,l.Z)(),2),u=o[0],c=o[1],d=i(a.useState(null),2),s=d[0],f=d[1];return a.createElement("canvas",{ref:f,width:u,height:c,className:r},s&&a.createElement(v,{canvas:s,postDraw:t},n))}c(v,"useRef{}\nuseRef{nextRenderId}\nuseMemo{context}\nuseRequestAnimationFrame{}",(function(){return[o.Z]})),c(y,"useScreenSize{[sw, sh]}\nuseState{[ref, setRef](null)}",(function(){return[l.Z]})),(m="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&(m.register(d,"CanvasContext","D:\\Development\\hypnogen\\src\\effects\\Canvas.tsx"),m.register(s,"useRender","D:\\Development\\hypnogen\\src\\effects\\Canvas.tsx"),m.register(f,"useCanvas","D:\\Development\\hypnogen\\src\\effects\\Canvas.tsx"),m.register(v,"CanvasRenderer","D:\\Development\\hypnogen\\src\\effects\\Canvas.tsx"),m.register(y,"Canvas","D:\\Development\\hypnogen\\src\\effects\\Canvas.tsx")),(p="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&p(e)},15484:(e,t,r)=>{r.d(t,{Z:()=>g});var n,a,o,l=r(67294),i=r(55164),u=r(86624),c=r(83363),d=r(98875),s=r(41020);function f(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function m(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?f(Object(r),!0).forEach((function(t){p(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function v(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,o=[],l=!0,i=!1;try{for(r=r.call(e);!(l=(n=r.next()).done)&&(o.push(n.value),!t||o.length!==t);l=!0);}catch(e){i=!0,a=e}finally{try{l||null==r.return||r.return()}finally{if(i)throw a}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return y(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?y(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function y(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function g(e){var t=e.timer,r=e.play,n=e.pattern,a=e.speed,o=e.colors,f=e.zIndex,p=l.useRef(Date.now()/1e3),y=(0,u.Z)("shaders/spiral.vs"),g=(0,u.Z)(n?"shaders/".concat(n,".fs"):null),h=v(l.useState(null),2),b=h[0],E=h[1],L=v((0,i.Z)(),2),S=L[0],w=L[1],H=l.useMemo((function(){return document.createElement("canvas")}),[]);l.useEffect((function(){H.width=S,H.height=w}),[S,w,H]),l.useEffect((function(){E(new d.ZP(H))}),[H]);var G=v(l.useState(null),2),A=G[0],Z=G[1];l.useEffect((function(){if(null!=b){var e=b.createBuffer();return Z(e),function(){return e.destroy()}}}),[b]);var x=v(l.useState(null),2),R=x[0],_=x[1];l.useEffect((function(){if(null!=b&&null!=y&&null!=g){var e=b.createProgram(y,g);return _(e),function(){return e.destroy()}}_(null)}),[b,y,g]);var D=l.useMemo((function(){return m({rotation:1,direction:1,branchCount:4,resolution:[S,w],aspect:[S/w,1]},m({bgColor:[0,0,0,0],fgColor:[1,1,1,1],pulseColor:[.7,.3,.9,1],dimColor:[0,0,0,1]},null!=o?o:{}))}),[S,w,o]);return(0,c.Z)((function(){if(null!=b&&(b.clear(),null!=A&&A.ok()&&null!=R&&R.ok())){A.bind();var e=Date.now()/1e3,n=r?e-p.current:0;p.current=e;var o=(t()+n)*(null!=a?a:1);b.render(R,m(m({},D),{},{time:o}))}})),(0,s.L6)(null!=f?f:0,(function(e,t){n&&e.drawImage(H,0,0,t.width,t.height)})),l.createElement(l.Fragment,null)}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e),("undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e})(g,"useRef{lastRender}\nuseFile{vertexShader}\nuseFile{fragmentShader}\nuseState{[context, setContext](null)}\nuseScreenSize{[screenWidth, screenHeight]}\nuseMemo{target}\nuseEffect{}\nuseEffect{}\nuseState{[buffer, setBuffer](null)}\nuseEffect{}\nuseState{[program, setProgram](null)}\nuseEffect{}\nuseMemo{parameters}\nuseRequestAnimationFrame{}\nuseRender{}",(function(){return[u.Z,u.Z,i.Z,c.Z,s.L6]})),(a="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&a.register(g,"Pattern","D:\\Development\\hypnogen\\src\\effects\\Pattern.tsx"),(o="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&o(e)},68276:(e,t,r)=>{r.d(t,{t:()=>f,Z:()=>m});var n,a,o,l=r(67294),i=r(46387),u=r(8683),c=r(53059);function d(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,o=[],l=!0,i=!1;try{for(r=r.call(e);!(l=(n=r.next()).done)&&(o.push(n.value),!t||o.length!==t);l=!0);}catch(e){i=!0,a=e}finally{try{l||null==r.return||r.return()}finally{if(i)throw a}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return s(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?s(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function f(e){return function(t){return[80*(0,i.Z)(e,2*t)+10|0,80*(0,i.Z)(e,2*t+1)+10|0]}}function m(e){var t=e.timer,r=e.zIndex,n=(e.play,e.values),a=e.speed,o=e.spacing,i=e.animation,s=e.positionSelector,m=d(l.useState(0),2),p=m[0],v=m[1],y=d(l.useState(0),2),g=y[0],h=y[1];(0,u.Z)((function(){var e=(null!=a?a:1)*t()*3|0;v(e)}),10),l.useEffect((function(){0==t()&&(console.log(n),v(0),h(0))}),[t()]);var b=d(l.useState((null!=s?s:f(0))(0)),2),E=b[0],L=b[1],S=d(l.useState(0),2),w=S[0],H=S[1];return l.useEffect((function(){switch(p%(3+3*(null!=o?o:0))){case 0:L((null!=s?s:f(0))(p)),H(0),h(g+1);break;case 1:H(1);break;case 2:H(2);break;default:H(3)}}),[p,o]),(0,c.Z)({speed:a,zIndex:r,show:w>=0&&w<=2,x:E[0],y:E[1],animation:i,children:n.length>0?n[g%n.length]:""}),l.createElement(l.Fragment,null)}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e),("undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e})(m,"useState{[currentCounter, setCurrentCounter](0)}\nuseState{[textFrame, setTextFrame](0)}\nuseInterval{}\nuseEffect{}\nuseState{[position, setPosition]((positionSelector ?? RandomPosition(0))(0))}\nuseState{[animationState, setAnimationState](0)}\nuseEffect{}\nuseAnimatedText{}",(function(){return[u.Z,c.Z]})),(a="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&(a.register(f,"RandomPosition","D:\\Development\\hypnogen\\src\\effects\\SubliminalText.tsx"),a.register(m,"Subliminal","D:\\Development\\hypnogen\\src\\effects\\SubliminalText.tsx")),(o="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&o(e)},53059:(e,t,r)=>{r.d(t,{Z:()=>s});var n,a,o,l=r(67294),i=r(41020),u=r(55164);function c(e){return function(e){if(Array.isArray(e))return d(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return d(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?d(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function s(e){var t=e.zIndex,r=(e.speed,e.show),n=(e.animation,e.x),a=e.y,o=e.children,d=(0,u.Z)(),s=l.useMemo((function(){return Math.min(Math.max(24,Math.min.apply(Math,c(d))/25),128)}),c(d));(0,i.L6)(null!=t?t:0,(function(e,t){if(r){e.textAlign="center",e.fillStyle="white",e.font="".concat(s,'px "Roboto", "Helvetica", "Arial", sans-serif');var l=e.measureText(o),i=n/100*t.width;i<l.width/2&&(i+=l.width/2),i+l.width/2>t.width&&(i-=l.width/2);var u=a/100*t.height;e.fillText(o,i,u)}}))}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e),("undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e})(s,"useScreenSize{screenSize}\nuseMemo{fontSize}\nuseRender{}",(function(){return[u.Z,i.L6]})),(a="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&a.register(s,"useAnimatedText","D:\\Development\\hypnogen\\src\\effects\\useAnimatedText.tsx"),(o="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&o(e)},55164:(e,t,r)=>{r.d(t,{Z:()=>u});var n,a,o,l=r(67294);function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function u(){var e,t,r=(e=l.useState([1280,720]),t=2,function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,o=[],l=!0,i=!1;try{for(r=r.call(e);!(l=(n=r.next()).done)&&(o.push(n.value),!t||o.length!==t);l=!0);}catch(e){i=!0,a=e}finally{try{l||null==r.return||r.return()}finally{if(i)throw a}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return i(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?i(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),n=r[0],a=r[1];return l.useEffect((function(){var e=function(){return a([document.body.clientWidth,document.body.clientHeight])};return e(),window.addEventListener("resize",e),function(){return window.removeEventListener("resize",e)}}),[]),n}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e),("undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e})(u,"useState{[screenSize, setScreenSize]([1280, 720])}\nuseEffect{}"),(a="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&a.register(u,"useScreenSize","D:\\Development\\hypnogen\\src\\effects\\useScreenSize.ts"),(o="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&o(e)},98875:(module,__webpack_exports__,__webpack_require__)=>{var enterModule;function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}__webpack_require__.d(__webpack_exports__,{ZP:()=>WebGLRef}),module=__webpack_require__.hmd(module),enterModule="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0,enterModule&&enterModule(module);var __signature__="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e},WebGLRef=function(){function WebGLRef(e){var t,r;_classCallCheck(this,WebGLRef),this.canvas=e,this.gl=null!==(t=null!==(r=e.getContext("webgl"))&&void 0!==r?r:e.getContext("experimental-webgl"))&&void 0!==t?t:function(){throw new Error("")}()}return _createClass(WebGLRef,[{key:"ref",value:function(){return this.gl}},{key:"createBuffer",value:function(){var e=this.gl.createBuffer();if(null==e)throw new Error("");return new BufferRef(this.gl,e)}},{key:"createProgram",value:function(e,t){var r=this.gl.createProgram();if(null==r)throw new Error("");var n=this.createShader(e,this.gl.VERTEX_SHADER);this.gl.attachShader(r,n),this.gl.deleteShader(n);var a=this.createShader("precision highp float;\n\n"+t,this.gl.FRAGMENT_SHADER);if(this.gl.attachShader(r,a),this.gl.deleteShader(a),this.gl.linkProgram(r),!this.gl.getProgramParameter(r,this.gl.LINK_STATUS))throw new Error("VALIDATE_STATUS: ".concat(this.gl.getProgramParameter(r,this.gl.VALIDATE_STATUS)," ERROR: ").concat(this.gl.getError()));return new ProgramRef(this.gl,r)}},{key:"clear",value:function(){this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT|this.gl.STENCIL_BUFFER_BIT),this.gl.clearColor(0,0,0,1)}},{key:"render",value:__signature__((function(e,t){var r=this,n=e.ref();this.gl.viewport(0,0,this.canvas.width,this.canvas.height),this.gl.useProgram(n),Object.keys(t).forEach((function(e){var a=t[e],o=r.gl.getUniformLocation(n,e);if(o)if(Array.isArray(a))switch(a.length){case 2:r.gl.uniform2f(o,a[0],a[1]);break;case 3:r.gl.uniform3f(o,a[0],a[1],a[2]);break;case 4:r.gl.uniform4f(o,a[0],a[1],a[2],a[3])}else r.gl.uniform1f(o,a)})),this.gl.drawArrays(this.gl.TRIANGLES,0,6)}),"useProgram{}")},{key:"createShader",value:function(e,t){var r=this.gl.createShader(t);if(null==r)throw new Error("");if(this.gl.shaderSource(r,e),this.gl.compileShader(r),!this.gl.getShaderParameter(r,this.gl.COMPILE_STATUS))throw new Error((t==this.gl.VERTEX_SHADER?"VERTEX":"FRAGMENT")+" SHADER:\n"+this.gl.getShaderInfoLog(r));return r}},{key:"width",value:function(){return this.canvas.clientWidth}},{key:"height",value:function(){return this.canvas.clientHeight}},{key:"__reactstandin__regenerateByEval",value:function __reactstandin__regenerateByEval(key,code){this[key]=eval(code)}}]),WebGLRef}(),ProgramRef=function(){function ProgramRef(e,t){_classCallCheck(this,ProgramRef),_defineProperty(this,"destroyed",!1),this.gl=e,this.program=t}return _createClass(ProgramRef,[{key:"ref",value:function(){return this.program}},{key:"ok",value:function(){return!this.destroyed}},{key:"destroy",value:function(){this.gl.deleteProgram(this.program),this.destroyed=!0}},{key:"__reactstandin__regenerateByEval",value:function __reactstandin__regenerateByEval(key,code){this[key]=eval(code)}}]),ProgramRef}(),BufferRef=function(){function BufferRef(e,t){_classCallCheck(this,BufferRef),_defineProperty(this,"destroyed",!1),this.gl=e,this.buffer=t}return _createClass(BufferRef,[{key:"ref",value:function(){return this.buffer}},{key:"ok",value:function(){return!this.destroyed}},{key:"bind",value:function(){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.buffer),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,-1,1,1,-1,1]),this.gl.STATIC_DRAW),this.gl.vertexAttribPointer(0,2,this.gl.FLOAT,!1,0,0),this.gl.enableVertexAttribArray(0)}},{key:"destroy",value:function(){this.gl.deleteBuffer(this.buffer),this.destroyed=!0}},{key:"__reactstandin__regenerateByEval",value:function __reactstandin__regenerateByEval(key,code){this[key]=eval(code)}}]),BufferRef}(),reactHotLoader,leaveModule;reactHotLoader="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0,reactHotLoader&&(reactHotLoader.register(WebGLRef,"WebGLRef","D:\\Development\\hypnogen\\src\\effects\\webgl\\WebGLRef.ts"),reactHotLoader.register(ProgramRef,"ProgramRef","D:\\Development\\hypnogen\\src\\effects\\webgl\\WebGLRef.ts"),reactHotLoader.register(BufferRef,"BufferRef","D:\\Development\\hypnogen\\src\\effects\\webgl\\WebGLRef.ts")),leaveModule="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0,leaveModule&&leaveModule(module)},43017:(e,t,r)=>{r.d(t,{M:()=>o,Z:()=>c});var n,a=r(67294);e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e);var o,l,i,u="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e};function c(e){var t=a.useRef(e);a.useEffect((function(){t.current=e}),[e]),a.useEffect((function(){function e(e){t.current(o.Down,e.code)}function r(e){t.current(o.Up,e.code)}return window.addEventListener("keydown",e),window.addEventListener("keyup",r),function(){window.removeEventListener("keydown",e),window.removeEventListener("keyup",r)}}),[])}!function(e){e[e.Down=0]="Down",e[e.Up=1]="Up"}(o||(o={})),u(c,"useRef{invoker}\nuseEffect{}\nuseEffect{}"),(l="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&l.register(c,"onKeyboard","D:\\Development\\hypnogen\\src\\util\\onKeyboard.tsx"),(i="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&i(e)},46387:(e,t,r)=>{var n,a,o;function l(e,t){t|=0;var r=function(e,t){return t^t>>e};return t*=3039394381,t=r(8,t+=e=e),t=function(e,t){return t^t<<8}(0,t+=1759714724),r(8,t*=458671337)}function i(e,t){return((1048320&l(e,t))>>8)/4095}r.d(t,{Z:()=>i}),e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e),"undefined"!=typeof reactHotLoaderGlobal&&reactHotLoaderGlobal.default.signature,(a="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&(a.register(l,"random_int32","D:\\Development\\hypnogen\\src\\util\\random.ts"),a.register(i,"random","D:\\Development\\hypnogen\\src\\util\\random.ts")),(o="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&o(e)},86624:(e,t,r)=>{r.d(t,{Z:()=>d});var n,a,o,l=r(67294),i=r(62143);function u(e,t,r,n,a,o,l){try{var i=e[o](l),u=i.value}catch(e){return void r(e)}i.done?t(u):Promise.resolve(u).then(n,a)}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function d(e){var t,r,n=(0,i.ZP)("file-load"),a=(t=l.useState(null),r=2,function(e){if(Array.isArray(e))return e}(t)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,o=[],l=!0,i=!1;try{for(r=r.call(e);!(l=(n=r.next()).done)&&(o.push(n.value),!t||o.length!==t);l=!0);}catch(e){i=!0,a=e}finally{try{l||null==r.return||r.return()}finally{if(i)throw a}}return o}}(t,r)||function(e,t){if(e){if("string"==typeof e)return c(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?c(e,t):void 0}}(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),o=a[0],d=a[1];return l.useEffect((function(){if(null!=e){n.increment();var t,r=!1,a=!1;return(t=regeneratorRuntime.mark((function t(){var o;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(e).then((function(e){return e.text()}));case 2:o=t.sent,r?a=!0:(d(o),n.decrement());case 4:case"end":return t.stop()}}),t)})),function(){var e=this,r=arguments;return new Promise((function(n,a){var o=t.apply(e,r);function l(e){u(o,n,a,l,i,"next",e)}function i(e){u(o,n,a,l,i,"throw",e)}l(void 0)}))})(),function(){r=!0,a||n.decrement()}}}),[e]),o}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e),("undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e})(d,"useSemaphore{semaphore}\nuseState{[file, setVertexShader](null)}\nuseEffect{}",(function(){return[i.ZP]})),(a="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&a.register(d,"useFile","D:\\Development\\hypnogen\\src\\util\\useFile.ts"),(o="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&o(e)},8683:(e,t,r)=>{r.d(t,{Z:()=>c});var n,a,o,l=r(67294);function i(e){return function(e){if(Array.isArray(e))return u(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return u(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?u(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function c(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],n=l.useRef(e);l.useEffect((function(){n.current=e}),[e].concat(i(r))),l.useEffect((function(){var e=setInterval((function(){n.current&&n.current()}),t);return function(){return clearInterval(e)}}),[t])}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e),("undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e})(c,"useRef{fn}\nuseEffect{}\nuseEffect{}"),(a="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&a.register(c,"useInterval","D:\\Development\\hypnogen\\src\\util\\useInterval.ts"),(o="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&o(e)},97918:(e,t,r)=>{r.d(t,{Z:()=>i});var n,a,o,l=r(86624);function i(e){var t=(0,l.Z)(e);return null!=t?JSON.parse(t):null}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e),("undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e})(i,"useFile{file}",(function(){return[l.Z]})),(a="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&a.register(i,"useJsonFile","D:\\Development\\hypnogen\\src\\util\\useJsonFile.ts"),(o="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&o(e)},83363:(e,t,r)=>{r.d(t,{Z:()=>c});var n,a,o,l=r(67294);function i(e){return function(e){if(Array.isArray(e))return u(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return u(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?u(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function c(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],r=l.useRef(e);l.useEffect((function(){r.current=e}),[e].concat(i(t))),l.useEffect((function(){var e=!1,t=0;return t=requestAnimationFrame((function n(){e||(r.current&&r.current(),t=requestAnimationFrame(n))})),function(){cancelAnimationFrame(t),e=!0}}),[])}e=r.hmd(e),(n="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.enterModule:void 0)&&n(e),("undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default.signature:function(e){return e})(c,"useRef{fn}\nuseEffect{}\nuseEffect{}"),(a="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.default:void 0)&&a.register(c,"useRequestAnimationFrame","D:\\Development\\hypnogen\\src\\util\\useRequestAnimationFrame.ts"),(o="undefined"!=typeof reactHotLoaderGlobal?reactHotLoaderGlobal.leaveModule:void 0)&&o(e)}}]);