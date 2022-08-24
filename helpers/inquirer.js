const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'What do you want to do?',
        choices: [
            {
                value: 1,
                name: `${ '1.'.green } Search place`
            },
            {
                value: 2,
                name: `${ '2.'.green } Search history`
            },
            {
                value: 0,
                name: `${ '0.'.green } Exit`
            }, 
        ]
    }
];



const inquirerMenu = async() => {

    console.clear();
    console.log('===================='.brightYellow);
    console.log('  Choose an option'.white );
    console.log('====================\n'.brightYellow);

    const { option } = await inquirer.prompt(questions);

    return option;
}

const pause = async() => {
    
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Press ${ 'enter'.green } to continue`
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);
}

const readInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Please, type in a value';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
}

const listPlaces = async( places = [] ) => {

    const choices = places.map( (place, i) => {

        const idx = `${i + 1}.`.green;

        return {
            value: place.id,
            name:  `${ idx } ${ place.name }`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancel'
    });

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Choose place:',
            loop: false,
            choices
        }
    ]

    const { id } = await inquirer.prompt(questions);
    return id;
}

const confirmar = async(message) => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt(question);
    return ok;
}   

const mostrarListadoChecklist = async( tareas = [] ) => {

    const choices = tareas.map( (tarea, i) => {

        const idx = `${i + 1}.`.green;

        return {
            value: tarea.id,
            name:  `${ idx } ${ tarea.desc }`,
            checked: ( tarea.completadoEn ) ? true : false
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]

    const { ids } = await inquirer.prompt(pregunta);
    return ids;
}



module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    confirmar,
    mostrarListadoChecklist
}
