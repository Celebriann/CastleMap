const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');
const proj4 = require('proj4')
const { features } = require('process');

// URL de la page Wikipedia
const url = 'https://fr.wikipedia.org/wiki/Liste_des_châteaux_de_l%27Aisne';
const urls = ['https://fr.wikipedia.org/wiki/Liste_des_châteaux_de_l%27Ain',// 
            'https://fr.wikipedia.org/wiki/Liste_des_châteaux_de_l%27Aisne', 
            'https://fr.wikipedia.org/wiki/Liste_des_châteaux_de_l%27Allier',
            'https://fr.wikipedia.org/wiki/Liste_des_châteaux_des_Alpes-de-Haute-Provence',
            'https://fr.wikipedia.org/wiki/Liste_des_châteaux_des_Hautes-Alpes',
            'https://fr.wikipedia.org/wiki/Liste_des_châteaux_des_Alpes-Maritimes',
            'https://fr.wikipedia.org/wiki/Liste_des_châteaux_de_l%27Ardèche',
            'https://fr.wikipedia.org/wiki/Liste_des_châteaux_des_Ardennes',
            'https://fr.wikipedia.org/wiki/Liste_des_châteaux_de_l%27Ariège',
            'https://fr.wikipedia.org/wiki/Liste_des_châteaux_de_l%27Aube',
            'https://fr.wikipedia.org/wiki/Liste_des_châteaux_de_l%27Aude',
            'https://fr.wikipedia.org/wiki/Liste_des_châteaux_de_l%27Aveyron']
const sourceProjection = 'EPSG:2154'; // Système de coordonnées local
const targetProjection = 'EPSG:4326'; // WGS84

/***function convertDMS(coord) {
    // Diviser les coordonnées en parties
    const parts = coord.split(',');
    console.log(parts)

    // Définir une fonction pour convertir une partie de DMS en décimal
    function convertPart(part) {
        console.log(part)
        if (!part) {
            console.error('La partie de coordonnées est indéfinie.');
            return null;
        }
        const trimmedPart = part.trim();
        const match = trimmedPart.match(/^(\d+)°\s*(\d+)′\s*(\d+)″\s*([NSEW])$/);
        if (!match) {
            console.error('Format de coordonnées incorrect. Les coordonnées doivent être dans le format "degrés minutes secondes hémisphère".');
            return null; // Retourner null si la partie n'est pas dans le bon format
        }
        const degrees = parseFloat(match[1]);
        const minutes = parseFloat(match[2]);
        const seconds = parseFloat(match[3]);
        const hemisphere = match[4];
    
        let decimal = degrees + (minutes / 60) + (seconds / 3600);
        if (hemisphere === "S" || hemisphere === "W") {
            decimal = -decimal;
        }
        return decimal;
    }

    // Convertir chaque partie en décimal
    const latitude = convertPart(parts[0]);
    const longitude = convertPart(parts[1]);
    console.log(typeof latitude)
    return latitude + ',' + longitude
}***/
function part1(part) {
    console.log(part)
        if (!part) {
            console.error('La partie de coordonnées est indéfinie.');
            return null;
        }
        const trimmedPart = part.trim();
        const match = trimmedPart.match(/^(\d+)°\s*(\d+)′\s*(\d+)″\s*([NSEW])$/);
        if (!match) {
            console.error('Format de coordonnées incorrect. Les coordonnées doivent être dans le format "degrés minutes secondes hémisphère".');
            return null; // Retourner null si la partie n'est pas dans le bon format
        }
        const degrees = parseFloat(match[1]);
        const minutes = parseFloat(match[2]);
        const seconds = parseFloat(match[3]);
        const hemisphere = match[4];
    
        let decimal = degrees + (minutes / 60) + (seconds / 3600);
        if (hemisphere === "S" || hemisphere === "W") {
            decimal = -decimal;
        }
        return decimal;
}
function part2(part) {
    console.log(part)
        if (!part) {
            console.error('La partie de coordonnées est indéfinie.');
            return null;
        }
        const trimmedPart = part.trim();
        const match = trimmedPart.match(/^(\d+)°\s*(\d+)′\s*(\d+)″\s*([NSEW])$/);
        if (!match) {
            console.error('Format de coordonnées incorrect. Les coordonnées doivent être dans le format "degrés minutes secondes hémisphère".');
            return null; // Retourner null si la partie n'est pas dans le bon format
        }
        const degrees = parseFloat(match[1]);
        const minutes = parseFloat(match[2]);
        const seconds = parseFloat(match[3]);
        const hemisphere = match[4];
    
        let decimal = degrees + (minutes / 60) + (seconds / 3600);
        if (hemisphere === "S" || hemisphere === "W") {
            decimal = -decimal;
        }
        return decimal;
}

// Exemple d'utilisation
//const dmsLatitude = "45 5 26 N";
//const dmsLongitude = "5 9 2 E";

//console.log("Latitude (DD):", ddCoordinates.latitude);
//console.log("Longitude (DD):", ddCoordinates.longitude);

// Fonction pour récupérer et traiter les données
async function scrapeTableData(url) {
    try {
        // Récupérer la page HTML
        const response = await fetch(url);
        const html = await response.text();
        //console.log(html)
        // Charger le HTML avec Cheerio
        const $ = cheerio.load(html);

        // Sélectionner le tableau
        const table = $('tbody').eq(1);

        // Initialiser un tableau pour stocker les données
        const features = [];

        // Parcourir chaque ligne du tableau
        $(table).find('tr').each((i, row) => {
            // Sélectionner la colonne qui vous intéresse (par exemple, la première colonne)
            const columnText = $(row).find('td').eq(1).text().trim();
            const coordText = $(row).find('td').eq(5).text().trim();
            //console.log(coordText)
            //console.log(parseIntconvertDMS(coordText))
            const parts = coordText.split(',');



            // Ajouter le texte de la colonne au tableau de données
            if (columnText) {
                features.push({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [ part2(parts[1]), part1(parts[0])] // Coordonnées aléatoires pour l'exemple, convertDMS(dmsLatitude, dmsLongitude)
                    },
                    properties: {
                        title: columnText,
                        description: "Description du " + columnText + "..." // Vous pouvez personnaliser la description selon vos besoins
                    }
                })






                //data.push(columnText);
            }
        });
        const geoJson = {
            type: "FeatureCollection",
            features: features
        }

        //console.log(data)
        // Enregistrer les données dans un fichier JSON
        
        fs.writeFileSync('geojson.json', JSON.stringify(geoJson, null, 2));
        console.log('Les données ont été enregistrées avec succès dans data.json.');
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
    }
}

// Appeler la fonction pour récupérer les données
scrapeTableData(url);
