import{a as F,b as L,c as _,d as e,g as b,h as I,i as O,j as N,t as l,v as E,w as x}from"../chunk-ZCLFVYCB.js";var p=Object.defineProperty;var v=(t,n)=>{for(var r in n)p(t,r,{get:n[r],enumerable:!0})};var o={};v(o,{MODE:()=>h,NODE_ENV:()=>m,SSR:()=>g});var h="production",m="production",g=!1;function y(t,n){if(typeof n=="function"){var r=n(t);return r}return _({},t,n)}function u(t){var n=t.children,r=t.theme,i=N(),f=e.useMemo(function(){var a=i===null?r:y(i,r);return a!=null&&(a[I]=i!==null),a},[r,i]);return e.createElement(O.Provider,{value:f},n)}var d=({children:t})=>{let[n,r]=e.useState("");return e.useEffect(()=>{r(window.location.search)},[]),e.useEffect(()=>{history.pushState(null,"",n)},[n]),e.createElement(F.Provider,{value:{search:n,setSearch:r}},t)};function c({children:t}){return e.createElement(L.Provider,{value:{}},t)}var C={overrides:{MuiTypography:{h1:{fontSize:"2rem",fontWeight:600},h2:{fontSize:"1.5rem",fontWeight:600},h3:{fontSize:"1.25rem",fontWeight:600},h4:{fontSize:"1rem"},h5:{fontSize:"0.75rem"}},MuiCssBaseline:{"@global":{body:{position:"absolute",width:"100vw",height:"100vh",backgroundColor:"black",overflow:"hidden"}}}}};function s({children:t}){return e.createElement(d,null,e.createElement(c,null,e.createElement(u,{theme:b(C)},e.createElement(x,null,e.createElement(e.Suspense,{fallback:e.createElement(E,{variant:"h1",align:"center"},"...")},t)))))}import.meta.env=o;var S=e.lazy(()=>import("./App.js"));l.render(e.createElement(s,null,e.createElement(S,null)),document.getElementById("root"));
//# sourceMappingURL=index.js.map
