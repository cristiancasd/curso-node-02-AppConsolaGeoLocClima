const fs=require('fs')                                //Guardar archivos en raiz
const axios = require('axios');                       //peticiones http con promesas

const { pausa } = require('../helpers/inquirer');     //Esperar en consola un enter

class Busqueda{
    historial=[];   
    
    constructor(){
        this.leerDB(); //Desde el comienzo leo el historial 
    }

    leerDB(){
        try{
            if(!fs.existsSync(this.dbPath)){
                fs.writeFileSync(this.dbPath,JSON.stringify(`{"historial":[]}`));                
            }else{           
                // Leo info el cual es un string
                const info=fs.readFileSync(this.dbPath,{encoding: 'utf-8'})
                const data=JSON.parse(info);    //data ya lo conviente en el arreglo                         
                this.historial=data.historial;  //Retorno el arreglo
            }
            return 'Lectura correcta';
        }catch(error){
            return error;
        }
    }

    //Petición de coordenadas de la ciudad seleccionada
    get paramsMapbox(){   
        return {
            'limit':5,
            'language':'es',
            'access_token':process.env.MAPBOX_KEY               
        }
    }
    async ciudad(lugar=''){
        try{            
            const instance=axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                // todu  lo que viene despues de un  ? en una petición URL son los parametros
                params: this.paramsMapbox
            });
            
            const resp = await instance.get();  //Hacer solicitud al backend de mapbox        
            
            //Retornar un objeto de manera implicita ({})
            return resp.data.features.map(lugar=>({  //Retorno los datos de interés
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]

            }))
        }catch(error){
            return[];
        }
    }

    //Peticiíon de clima de las coordenadas seleccionadas
    get paramsOpenWeather(){  
        return {            
            'appid':process.env.OPENWEATHER_KEY,
            'units':'metric',
            'lang':'es'
        }
    }
    async clima(lat=0,lon=0){
        
        try{            
            const instance=axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                //Parametros con destructuración
                params:{...this.paramsOpenWeather,'lat':lat, 'lon':lon}
                /*params: {
                    'lat':lat,
                    'lon':lon,   
                    'appid':process.env.OPENWEATHER_KEY,
                    'units':'metric',
            'lang':'es'
                }*/
            });

            const resp = await instance.get(); 
            // Cada solicitud retorna información de manera diferente
            // en este caso la descripción del clima es una arreglo                       
            return [resp.data.main.temp, 
                resp.data.main.temp_min,
                resp.data.weather[0].description];

            //Si quisiera retornar un objeto
            //const {weather,main}=resp.data;
            //return {temp:main.temp, temp_min:main.temp_min, des:weather.description}

        }catch(error){
            return[];
        }
    }


    agregarHistorial(lugar=''){
        //Saber si un valor ya está en el arreglo
        if(this.historial.includes(lugar.toLocaleLowerCase())){ 
           // console.log(lugar.toLocaleLowerCase(),'Ciudad ya en historual'.yellow)           
        }else{
            this.historial=this.historial.splice(0,5); // borrar las demás posiciones
            this.historial.unshift(lugar.toLocaleLowerCase()); //Agregar en la primera posición
           // console.log(lugar.toLocaleLowerCase(),'Ciudad agregada al historial'.red)  
        }
       
        this.guardarDB();  //Guardar el nuevo historia en database.json
        pausa();
    }

    dbPath='./db/database.json';
    guardarDB(){
        //console.log('entro a guardar');
        
        const payload={
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath,JSON.stringify(payload));
    }    
}
module.exports=Busqueda;





