
const { listarLugares,inquirerMenu, leerInput, pausa } = require('./helpers/inquirer');
const Busqueda=require('./models/busqueda');

//Variables de entorno ... Los archivos de .env se vuelven constantes del sistema
require('dotenv').config();

const main =async()=>{
    let opt='';

    //creamos instancia 
    busqueda=new Busqueda();    

    while(opt!='0'){
        console.clear();     
        //desplegamos menú interactivo
        opt=await inquirerMenu();

        switch(opt){
            case '1': //Buscar una ciudad

                const lugar = await leerInput('Ciudad: '); //leer de consola la ciudad

                //petición a Mapbox ciudades con el nombre seleciconado
                const lugares = await busqueda.ciudad(lugar); 

                //Desplegar los lugares y elegir una de las opciones, retornar id (petición http)
                const id = await listarLugares(lugares);
                
                if (id ==='0') continue; //Elegí 0? ... opción salir              

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

            case '2':{ //historial de busquedas
                
                //Recorrer el arreglo del historial y mostrarlo en consola
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