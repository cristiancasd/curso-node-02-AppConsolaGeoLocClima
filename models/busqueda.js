const fs=require('fs')

const axios = require('axios');

const { pausa } = require('../helpers/inquirer');
class Busqueda{
    historial=[];   
    
    constructor(){
        this.leerDB();
    }

    get paramsMapbox(){
        return {
            'limit':5,
            'language':'es',
            'access_token':'pk.eyJ1IjoiY3Jpc3RpYW5jYXNkIiwiYSI6ImNsMXZmcGwwaDJ1czMzZnRjNmVydWxxaDkifQ.Ogat9Fq1-l8IcML-eSpVUg'                 
        }
    }

    async ciudad(lugar=''){
        try{            
            const instance=axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                // todu  lo que viene de spues de un  ? en una petición URL son los parametros
                params: this.paramsMapbox
            });

            const resp = await instance.get();            
            //console.log(resp.data.features);
            //Retornar un objeto de manera implicita ({})
            return resp.data.features.map(lugar=>({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]

            }))
        }catch(error){
            return[];
        }
    }

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
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++'.red)

        if(this.historial.includes(lugar.toLocaleLowerCase())){
            console.log(lugar.toLocaleLowerCase(),'problem'.yellow)           
        }else{
            this.historial=this.historial.splice(0,5); // borrar las demás posiciones
            this.historial.unshift(lugar.toLocaleLowerCase());
        }
        //pausa();
        this.guardarDB();
        pausa();
    }

    dbPath='./db/database.json';
    guardarDB(){
        console.log('entro a guardar');
        
        /*if(this.historial.length>5){ 
            this.historial.splice(5, 1);
            console.log('----- Borre a'.green, this.historial[4]);           
        }*/
        

        const payload={
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath,JSON.stringify(payload));
    }

    leerDB(){
        try{
            if(!fs.existsSync(this.dbPath)){
                fs.writeFileSync(this.dbPath,JSON.stringify(`{"historial":[]}`));
                
            }else{
                //Si existe leo el archio entonces
            
                // Leo info el cual es un string
                const info=fs.readFileSync(this.dbPath,{encoding: 'utf-8'})
                
                //data ya lo conviente en el arreglo
                const data=JSON.parse(info)
            
                //Retorno el arreglo
                //return data;
                this.historial=data.historial;
            }
            return 'Lectura correcta';
        }catch(error){
            return error;
        }
    }
}
module.exports=Busqueda;





