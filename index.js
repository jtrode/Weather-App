require('dotenv').config()

const { readInput, inquirerMenu, pause, listPlaces } = require("./helpers/inquirer");
const Searches = require("./models/searches");
const colors = require('colors');

console.clear();
console.log(process.env.MAPBOX_KEY);

const main = async() => {

    const searches = new Searches();

    let opt;

    do {

        opt = await inquirerMenu()

        switch (opt) {
            case 1:
               // Show message
               const searchTerm = await readInput('Place: ');
               const places = await searches.city( searchTerm );
               const id = await listPlaces(places);

               if( id === '0') continue;

               const selectedPlace = places.find( l => l.id === id );

               searches.addToSearchHistory(selectedPlace.name);

               const weather = await searches.weatherByPlace(selectedPlace.lat, selectedPlace.lon);
               //Show Results

               console.log('\n\n'.green);
               console.log('Place:'.bold.brightYellow, selectedPlace.name.brightYellow.dim);
               console.log('Lat:'.bold.brightYellow, selectedPlace.lat);
               console.log('Lng:'.bold.brightYellow, selectedPlace.lon);
               console.log('Weather:'.bold.brightYellow, weather.desc.brightYellow.dim);
               console.log('Temperature:'.bold.brightYellow, `${weather.temp}ºC`.brightYellow.dim );
               console.log('Feels Like:'.bold.brightYellow, `${weather.feels_like}ºC`.brightYellow.dim);
               console.log('Min:'.bold.brightYellow, `${weather.min}ºC`.brightYellow.dim);
               console.log('Max:'.bold.brightYellow, `${weather.max}ºC`.brightYellow.dim);
               console.log('Wind:'.bold.brightYellow, `${weather.wind}km/h`.brightYellow.dim);
               console.log('Humidity:'.bold.brightYellow, `${weather.humidity}%`.brightYellow.dim);
               console.log('Visibility:'.bold.brightYellow, `${weather.visibility}m`.brightYellow.dim);
               
               break;
            case 2:
                searches.capitalizedHistory.forEach ( (place, i) => {
                    const index = `${ i + 1}.`.green;
                    console.log( `${ index } ${ place } `);
                })
               break;
        }

        if ( opt !== 0) await pause();

    } while (opt !== 0);

}

main();