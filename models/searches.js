const fs = require('fs');

const axios = require('axios').default;

class Searches {
    history = [];
    dbPath = './db/database.json';

    constructor() {
        this.readDB();
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'lenguage': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    get capitalizedHistory(){
        return this.history.map( place => {

            let words = place.split(' ');
            words = words.map( word => word[0].toUpperCase() + word.substring(1) );

            return words.join(' ')

        })
    }

    async city ( place = '') {

        try {
            //http request
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();

            return resp.data.features.map( place => ({
                id: place.id,
                name: place.place_name,
                lon: place.center[0],
                lat: place.center[1],
            }));

        } catch (error) {
            return [];
        }     
    }

    async weatherByPlace( lat, lon ){

        try {

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon }
            });

            const response = await instance.get();
            const { weather, main, visibility, wind } = response.data;


            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
                feels_like: main.feels_like,
                wind: wind.speed,
                humidity: main.humidity,
                visibility
            }
            
        } catch (error) {
            console.log(error);
        }
    } 

    addToSearchHistory ( place = '' ) {
        
        if ( this.history.includes( place.toLocaleLowerCase() ) ){
            return;
        } 

        this.history = this.history.splice(0,10);

        this.history.unshift( place.toLocaleLowerCase() );

        this.persistDB();
    }
    
    persistDB(){

        const payload = {
            history: this.history
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );

    }

    readDB(){

        if( !fs.existsSync(this.dbPath) ) return;
    
        
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const {history} = JSON.parse( info );
        this.history = history;

        // console.log(data);


    }

}

module.exports = Searches;