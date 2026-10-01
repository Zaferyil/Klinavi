window.NMC=true;
function nmcData(){
  const P=(x,y)=>({x:Math.round(x*1000/1884),y:Math.round(y*1000/1884)});
  const floors=[{id:'campus',name:'Campus Neuromed',short:'NMC',image:NMC_IMG,h:706,scale:0.5}];
  const nodes=[],edges=[];
  const N=(id,x,y,o={})=>{nodes.push({id,f:'campus',...P(x,y),t:'g',...o});return id};
  const E=(...ids)=>{for(let i=1;i<ids.length;i++)edges.push([ids[i-1],ids[i]])};
  const COL={B:'#B07A00',C:'#1D5FDB',D:'#04864A',G:'#BF5A0E',K:'#D4202F',L:'#46586A',J:'#6A38CF',N:'#D94A08',R:'#A332C4',H:'#06809A',AZ:'#46586A',P:'#1D5FDB',Bus:'#04864A'};
  const badge=k=>({t:k==='Bus'?'H':k,c:COL[k]});
  // Anreise & Eingänge
  N('bus',150,515,{t:'e',name:'Haltestelle Wagner-Jauregg-Weg',cat:'Anreise',info:'Linz AG Linien 41 und 43',badge:badge('Bus'),where:'Hanuschstraße'});
  N('pw',310,668,{t:'e',name:'Besucherparkplatz West',cat:'Anreise',info:'Mit Behindertenparkplätzen',badge:badge('P'),where:'Wagner-Jauregg-Weg'});
  N('pnw',512,352,{t:'e',name:'Besucherparkplatz Nord',cat:'Anreise',info:'Nahe Bau D',badge:badge('P'),where:'Beim Kindergarten'});
  N('ps',650,985,{t:'e',name:'Parkplatz Süd',cat:'Anreise',badge:badge('P'),where:'Niedernharter Straße'});
  N('he',790,690,{t:'e',name:'Haupteingang Nord',cat:'Anreise',info:'Bei der Ein- und Ausstiegszone',badge:badge('B'),where:'Bau B',start:true,tag:'Haupteingang'});
  N('az',787,985,{t:'e',name:'Haupteingang Süd (Bau AZ)',cat:'Anreise',badge:badge('AZ'),where:'Niedernharter Straße',tag:'Haupteingang Süd'});
  N('dn',575,410,{t:'e',name:'Eingang Bau D Nord',cat:'Anreise',info:'Barrierefreier Zugang',badge:badge('D'),where:'Bau D',tag:'Eingang D Nord'});
  // Wege (Entwurf)
  N('j1',205,555);N('j2',370,580);N('j5',378,420);N('j3',480,622);N('j4',705,648);
  N('b1',900,725);N('b2',1050,745);N('b3',1205,738);N('azk',930,915);
  E('bus','j1','j2','j3','j4','he','b1','b2','b3');E('pw','j2');E('j2','j5','pnw','dn');E('ps','az','azk');
  // Gebäude-Eingänge
  const ENT={C:{x:805,y:752,via:['he']},D:{x:705,y:632,via:['j4','dn']},G:{x:990,y:660,via:['b1']},K:{x:935,y:792,via:['b1','azk']},
    L:{x:1265,y:735,via:['b3']},J:{x:1185,y:792,via:['b3']},R:{x:1172,y:648,via:['b3']},N:{x:1280,y:668,via:['b3']},H:{x:1495,y:770,via:['b3']}};
  let k=0;
  const Z=(bau,name,cat,info,then,o={})=>{const id='z'+(k++),e=ENT[bau];nodes.push({id,f:'campus',...P(e.x,e.y),t:'z',name,cat,info,then,bau:'Bau '+bau,where:'Bau '+bau+(o.stock?' · '+o.stock:''),badge:badge(bau),tag:o.tag||('Bau '+bau),visit:o.visit});for(const v of e.via)edges.push([v,id])};
  for(const b of ['C','D','G','K','L','J','N','R','H'])Z(b,'Bau '+b,'Gebäude','',null,{tag:'Bau '+b});
  const NEU='Neurologie';
  Z('C','Station C102 – Neurologie','Station','T 05 7680 87-35770','Station C102 liegt im 1. Stock von Bau C. Folgen Sie im Gebäude der Beschilderung „C102“.',{stock:'1. Stock',visit:'@v_gen'});
  Z('C','Station C102 – Schlaflabor','Station','T 05 7680 87-25784','Das Schlaflabor gehört zur Station C102 im 1. Stock von Bau C.',{stock:'1. Stock',visit:false});
  Z('C','Station C202 – Neurologie','Station','T 05 7680 87-25750','Station C202 liegt im 2. Stock von Bau C. Folgen Sie im Gebäude der Beschilderung „C202“.',{stock:'2. Stock',visit:'@v_gen'});
  Z('C','Station C302 – Stroke Unit und IMCU','Station','T 05 7680 87-25790','Station C302 liegt im 3. Stock von Bau C. Bitte an der Stationstür läuten.',{stock:'3. Stock',visit:'@v_c302'});
  Z('C','Station C302 – EMU (Epilepsie-Monitoring)','Station','T 05 7680 87-35791','Die EMU gehört zur Station C302 im 3. Stock von Bau C.',{stock:'3. Stock',visit:'@v_gen'});
  Z('N','Neurologische Tagesklinik N104','Ambulanz','T 05 7680 87-25899','Die Tagesklinik N104 liegt im 1. Stock von Bau N.',{stock:'1. Stock'});
  Z('N','Station N204 – Akutnachsorge','Station','T 05 7680 87-25810','Station N204 liegt im 2. Stock von Bau N.',{stock:'2. Stock',visit:'@v_n204'});
  Z('D','Station D101 – Psychosomatik','Station','T 05 7680 87-29470','Station D101 liegt im 1. Stock von Bau D.',{stock:'1. Stock',visit:'@v_gen'});
  Z('D','Station D102 – Psychosomatik','Station','T 05 7680 87-29480','Station D102 liegt im 1. Stock von Bau D.',{stock:'1. Stock',visit:'@v_gen'});
  // Quelle Zentrale, Besuchszeiten, Regeln: kepleruniklinikum.at (Besuchsinformationen, Neurologie – Stationen), abgerufen 10/2026
  return {name:'Neuromed Campus · Prototyp',portier:'+43 5 7680 87-0',rules:['@r_four','@r_cold','@r_icu'],floors,nodes,edges};
}
