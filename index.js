console.log('STARLIGHT BOOTING UP...');
// Imports
require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js')
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
// Main code

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages
    ]
})



client.login(process.env.TOKEN);
function sendXRay() {
    $.getJSON('https://services.swpc.noaa.gov/json/goes/secondary/xray-flares-latest.json', function( data ) {
        var string = JSON.stringify(data);
        var parsedstring = JSON.parse(string);
        let current_class = parsedstring[0].current_class;
        let max_class = parsedstring[0].max_class;
        let end_class = parsedstring[0].end_class;
        let begin_class = parsedstring[0].begin_class;
        let begin_time = parsedstring[0].begin_time;
        let max_time = parsedstring[0].max_time;
        let end_time = parsedstring[0].end_time;
        let current_time = parsedstring[0].time_tag;
        client.channels.cache.get('1012263038570745936').send("Current X-Ray Class: " + current_class + " at: " + current_time);
        client.channels.cache.get('1012263038570745936').send("--------------------------------------------------------------------------");
       });
}

function sendEFlux() {
    $.getJSON('https://services.swpc.noaa.gov/json/goes/secondary/integral-electrons-6-hour.json', function( data ) {
        console.log(data);
        let latestflux = data[data.length -1].flux;
        let latesttime = data[data.length -1].time_tag;
        let latestsatellite = data[data.length -1].satellite;
        let latestenergy = data[data.length -1].energy;
        if(latestflux < 1000) {
            client.channels.cache.get('1012263038570745936').send("Electron flux at " + latesttime + ": " + Number(Math.floor(latestflux * 100) / 100) + " " + latestenergy + " From GOES " + latestsatellite);
            client.channels.cache.get('1012263038570745936').send("--------------------------------------------------------------------------");
        }
        else if(latestflux > 1000 ) {
            client.channels.cache.get('1012263038570745936').send(":rotating_light: ALERT: ELECTRON FLUX EXCEEDED 1000 :rotating_light: " + "Electron flux at " + latesttime + ": " + Number(Math.floor(latestflux * 100) / 100) + " " + latestenergy + " From GOES " + latestsatellite);
            client.channels.cache.get('1012263038570745936').send("--------------------------------------------------------------------------");
        } 
        
       });  
}
function sendPFlux() {
    $.getJSON('https://services.swpc.noaa.gov/json/goes/secondary/integral-protons-6-hour.json', function( data ) {
    let fildata = data.filter(x => x.energy == ">=10 MeV");

    let latestflux = fildata.slice(-1)[0].flux;
    let latesttime = fildata.slice(-1)[0].time_tag;
    let latestsatellite = fildata.slice(-1)[0].satellite;
    let latestenergy = fildata.slice(-1)[0].energy;
    console.log(fildata);
    if(latestflux < 10) {
        client.channels.cache.get('1012263038570745936').send("Proton flux at " + latesttime + ": " + Number(Math.floor(latestflux * 1000000) / 1000000) + " Pfu " + latestenergy + " From GOES " + latestsatellite);
        client.channels.cache.get('1012263038570745936').send("--------------------------------------------------------------------------");
    }
    else if (latestflux > 10) {
        client.channels.cache.get('1012263038570745936').send(":rotating_light: ALERT: PROTON FLUX EXCEEDED 10pfu :rotating_light: " + "Proton flux at " + latesttime + ": " + Number(Math.floor(latestflux * 1000000) / 1000000) + " Pfu " + latestenergy + " From GOES " + latestsatellite);
        client.channels.cache.get('1012263038570745936').send("--------------------------------------------------------------------------");
    }
    
   });
}
function sendAttenuation() {
    // https://services.swpc.noaa.gov/images/animations/d-rap/global/d-rap/latest.png
    client.channels.cache.get('1012263038570745936').send("https://services.swpc.noaa.gov/images/animations/d-rap/global/d-rap/latest.png");
}
function sendKP() {
    // https://www.n3kl.org/sun/images/noaa_kp_3d.gif
    client.channels.cache.get('1012263038570745936').send("https://www.n3kl.org/sun/images/noaa_kp_3d.gif");
}
function sendProp() {
    // https://www.hamqsl.com/solarbc.php
    client.channels.cache.get('1012263038570745936').send("https://www.hamqsl.com/solarbc.php");
}
function sendSW() {
    client.channels.cache.get('1012263038570745936').send("https://www.sws.bom.gov.au/Images/Solar/Solar%20Conditions/Solar%20Wind%20Speed/solarwind.gif");
    client.channels.cache.get('1012263038570745936').send("--------------------------------------------------------------------------");
}

client.on('ready', () => {
    console.log('STARLIGHT IS OPERATIONAL.');
    setInterval(sendEFlux, 60000);
    setInterval(sendPFlux, 61000);
    setInterval(sendXRay, 62000);
    setInterval(sendAttenuation, 63000);
    setInterval(sendKP, 64000);
    setInterval(sendProp, 65000);
    setInterval(sendSW, 66000);
      
})


