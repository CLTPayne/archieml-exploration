const express = require('express');
const archieml = require('archieml');
const { google } = require('googleapis');


// Load env vars when not in production
// Vars hould be saved in the host interface for access in prod mode
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Create an oAuth2 client to authorise the API call
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID, 
    process.env.CLIENT_SECRET, 
    process.env.REDIREC_URL
)
const drive = google.drive({version: 'v3', auth: oAuth2Client})

// Generate the url used for authorisation
this.authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/drive'
})

// Open server to access the oauth callback
const app = express();
app.get('/oauth2callback', async (request, response) => {
    const code = request.query.code;
    try {
        const {tokens} = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        response.send(`Authentication successful.`)
        // access and process the document
        // close server?
        // https://github.com/googleapis/google-api-nodejs-client/blob/master/samples/drive/quickstart.js
    } catch (error) {
        console.log(`Error retrieving oAuth tokens caused by: ${error.message}`);
        throw error;
    }
})

// Redirect to authorisation url
app.get('/:key', (request, response) => {
    response.redirect(this.authorizeUrl);
});

// Pass in the google drive document 'key'
app.param('key', (request, response, next, key) => {
    KEY = key || process.env.KEY;
    next();
});

// Launch server with express
const server = app.listen(3000, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`App is listening at http://localhost:${port}`);
});