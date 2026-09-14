const member=n=>({id:`P${n}`,slug:`persona-${n}`,nombre:`Persona ${n}`,titulo:'Rey',dinastia:'Casa de prueba',nac:1200,muer:1270});
const government=(territorio,desde,hasta,condicion='efectivo')=>({territorio,titulo:'Rey',clase:'reinado',condicion,desde,hasta});
const payload=(kind,slug,data)=>({schema:1,kind,slug,path:`/es/${kind}/${slug}`,data:{slug,...data}});
export const person=payload('persona','persona-1',{
 ...member(1),biografia:'Una biografía de prueba con vínculos y fechas.',
 gobiernos:[government('Castilla',1217,1252),government('León',1230,1252)],
 reinados:[government('Castilla',1217,1252),government('León',1230,1252)],
 fuentes:[{titulo:'Fuente de prueba',url:'https://example.org/source'}],padres:[member(2)],
});
export const dynasty=payload('dinastia','casa-de-prueba',{
 nombre:'Casa de prueba',resumen:'Historia editorial de prueba.',editorial:true,total:40,
 origen:'Origen documentado.',trayectoria:'Trayectoria documentada.',legado:'Legado documentado.',
 miembros:Array.from({length:40},(_,i)=>member(i+1)),ramas:[],gobiernos:[],fuentes:[],territorios:['Castilla'],protagonistas:[],
});
export const territory=payload('territorio','castilla',{
 nombre:'Castilla',clase:'reino',naturaleza:'entidad',resumen:'Un territorio con gobierno efectivo y una pretensión.',
 gobiernos:[{...government('Castilla',1217,1252),persona:member(1)},{...government('Castilla',1217,1252,'pretensión'),persona:member(2)}],
 personas:[member(1),member(2)],fuentes:[],dinastias:[],historias:[],eventos:[],relacionados:[],componentes:[],
});
