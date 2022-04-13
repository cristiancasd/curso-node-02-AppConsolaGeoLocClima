
const { listarLugares,inquirerMenu, leerInput, pausa } = require('./helpers/inquirer');
const Busqueda=require('./models/busqueda');

require('dotenv').config()
console.log(process.env.MAPBOX_KEY);



const main =async()=>{
    let opt='';
    busqueda=new Busqueda();
    

    while(opt!='0'){
        console.clear();
        //const algo= await busqueda.leerDB();
        //console.log(algo);
        //await pausa();

       

        opt=await inquirerMenu();

        switch(opt){
            case '1':

                const lugar=await leerInput('Ciudad: ');
                const lugares=await busqueda.ciudad(lugar);
                //console.log(lugares)

                //Elegir el lugar y recibir el id
                const id=await listarLugares(lugares);

                if (id==='0') continue;

               

                //buscar las caracteristicas del id seleccionado
                const lugarSel=lugares.find(l=> l.id === id);
                // Con esto ya tengo el nombre, y las coordenadas
                const temp=await busqueda.clima(lugarSel.lat,lugarSel.lng); 


                 //Guardar en DB
                await busqueda.agregarHistorial(lugarSel.nombre);
    
                console.log('Información de la ciudad'.green)
                console.log('Ciudad: ',lugarSel.nombre);
                console.log('Lat: ',lugarSel.lat);
                console.log('Lng: ',lugarSel.lng);
                console.log('Temperatura: ',temp[0]);
                console.log('Mínima: ',temp[1]);
                console.log('Descripción: ',temp[2]);
            break;
            case '2':{
                busqueda.historial.forEach((lugar,i) => {
                    const idx=`${i+1}. `.green;
                    //console.log(`${idx}${lugar}`); //tudo está en minusclas

                    //Las primeras letras en mayusculas
                    //Lo vuelvo arreglo cada ' 'espacio
                    let palabras=lugar.split(' '); 
                    
                    // toUpperCase... vuelve mayusculas ... 
                    palabras = palabras.map(p=> p[0].toUpperCase()+p.substring(1));
                    console.log(`${idx}`.green+palabras.join(' '));
                
                });
            }
        }

        
        await pausa();        
    }
}

main();