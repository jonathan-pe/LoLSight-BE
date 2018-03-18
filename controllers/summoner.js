const { URL, URLSearchParams } = require('url');
const request = require('request');
const config = require('../config');

function getSummoner(req, res) {
    if (!req.query.name) {
        return res.status(400).send({ success: false, message: `Summoner name was not provided!`});
    }
    const options = {
        url: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.query.name}`,
        method: 'GET',
        headers: {
            "X-Riot-Token": config.riotToken
        }
    };
    request(options, function(error, response, body) {
        if (error) {
            console.error('Couldn\'t make the request...');
            return res.status(response.statusCode).send(error);
        }

        if (response.statusCode >= 400) {
            if (response.statusCode === 429) {
                console.error('Reached Riot\'s rate limits...');
                console.log(response.headers);
                return res.status(response.statusCode).send(body);
            }
            console.error('Bad response from Riot...')
            return res.status(response.statusCode).send(body);
        }

        try {
            console.log('Received summoner data...');
            const summoner = JSON.parse(body);
            res.status(200).send(summoner);
        }
        catch (e) {
            return res.status(500).send({ success: false, message: 'Couldn\'t parse summoner data...', error: e})
        }
    });
}

module.exports = { getSummoner };
