const { URL, URLSearchParams } = require('url');
const request = require('request');
const config = require('../config');

async function getChampion(req, res) {
    if (!req.params.champName) {
        return res.status(400).send({ success: false, message: `Champ name was not provided!`});
    }
    const options = {
        url: `http://ddragon.leagueoflegends.com/cdn/${config.apiVersion}/data/en_US/champion/${req.params.champName}.json`,
        method: 'GET',
        headers: {
            'X-Riot-Token': config.riotToken
        }
    };

    request(options, async function(error, response, body) {
        if (error) {
            console.error("Couldn't make the request...");
            return res.status(response.statusCode).send(error);
        }

        if (response.statusCode >= 400) {
            if (response.statusCode === 429) {
                console.error("Reached Riot's rate limits...");
                console.log(response.headers);
                return res.status(response.statusCode).send(body);
            }
            console.error('Bad response from Riot...');
            return res.status(response.statusCode).send(body);
        }

        try {
            console.log('Parsing champion data...');
            const champion = JSON.parse(body).data[`${req.params.champName}`];

            res.status(200).send(champion);
        } catch (e) {
            console.log("Couldn't get champion details...");
            return res.status(500).send({ success: false, message: `Couldn't get ${req.params.champName}'s details...`, error: e });
        }
    });
}

function getChampions(req, res) {
    const options = {
        url: `http://ddragon.leagueoflegends.com/cdn/${config.apiVersion}/data/en_US/champion.json`,
        method: 'GET',
        headers: {
            'X-Riot-Token': config.riotToken
        }
    };

    request(options, async function(error, response, body) {
        if (error) {
            console.error("Couldn't make the request...");
            return res.status(response.statusCode).send(error);
        }

        if (response.statusCode >= 400) {
            if (response.statusCode === 429) {
                console.error("Reached Riot's rate limits...");
                console.log(response.headers);
                return res.status(response.statusCode).send(body);
            }
            console.error('Bad response from Riot...');
            return res.status(response.statusCode).send(body);
        }

        try {
            console.log('Parsing and sorting champion list...');
            let champs = [];
            const champions = JSON.parse(body).data;

            for (var champion in champions) {
                champs.push(champions[champion]);
            }

            res.status(200).send(champs);
        } catch (e) {
            console.log("Couldn't update the champion list...");
            return res.status(500).send({ success: false, message: "Couldn't update the champion list...", error: e });
        }
    });
}

module.exports = { getChampion, getChampions };
