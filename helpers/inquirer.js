
const inquirer = require('inquirer');
require('colors');

//Preguntas que deseamos hacer
const preguntas=[
    {
        type: 'list',
        name: 'opcion',
        message:'¿Que desea hacer?',
        //choices: ['opt1','opt2','opt3']
        choices:[
            {value:'1',
            name: '1. Buscar Ciudad'},            
            {value:'2',
            name: '2. Historial'},
            {value:'3',
            name: '0. Salir'},
                        
        ]
    }
];

//Desplegamos menu, con teclado seleccionamos la opción que queremos
const inquirerMenu = async() =>{

    console.log('=================================='.blue);
    console.log('  Seleccione una opción Inquirer'.blue);
    console.log('=================================='.blue);
  
    const {opcion}=await inquirer.prompt(preguntas);
    
    return opcion;
}

//Hacemos pausa para esperar un enter
const pausa=async() =>{
    const question =[
        {
            type:'input',
            name: 'enter',
            message: `Presione ${'ENTER'.green} para continuar`
        }
    ];
    await inquirer.prompt(question);
    console.clear();
}

//Leemos el mensaje de consola (descripción nueva tarea)
const leerInput=async(message)=>{
    const question=[
        {
            type:'input',
            name: 'desc',
            message,
            validate(value){   //Permite validar que ingrese datos
                if(value.length===0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const {desc}=await inquirer.prompt(question);
    return desc;

}

//Listamos todos los lugares, podemos escoger una opción 
//retornamos el id de la opción seleccionada
const listarLugares=async(lugares)=>{
    
    const choices = lugares.map((lugar,i)=>{

        const idx=(i+1+'.').green;

        //Retorna un arreglo
        return { 
            value:lugar.id, //Lo que se enviara al seleccionar la opción
            name:`${idx} ${lugar.nombre}`  //lo que se ve en el listado
        }
        //return  
    })

    choices.unshift({
        value:'0',
        name: '0.'.green + ' cancelar'
    })

    //Listado del menu a desplegar
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message:'Seleccione lugar:',
            choices
        }
    ]
    //Esperar a que se escoja una opción
    //Se retorna el name de la opción escogida, es decir el id
    const {id} = await inquirer.prompt(preguntas);
    return id;
}

module.exports={inquirerMenu, 
    pausa, 
    leerInput,
    listarLugares    
    }

    