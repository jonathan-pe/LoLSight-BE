const { URL, URLSearchParams } = require('url');
const request = require('request');
const config = require('../config');

function getMatches(req, res) {
    if (!req.query.accountId) {
        return res.status(400).send({ success: false, message: `Account ID was not provided!`});
    }
    const options = {
        url: `https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${req.query.accountId}/recent`,
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
            console.log('Received match history data...');
            const matches = JSON.parse(body).matches;
            res.status(200).send(matches);
        }
        catch (e) {
            return res.status(500).send({ success: false, message: 'Couldn\'t parse match history...', error: e})
        }
    });
}

module.exports = { getMatches };
