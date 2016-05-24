'use strict';

const pages = require('./controllers/pages');

module.exports = function (app) {
    app.get('/', pages.index);

    app.get('/calc', pages.calculate);

    app.get('/cryptotable', pages.cryptotable);

    app.all('*', pages.error404);
    
    app.use((err, req, res, next) => {
        console.error(err);

        res.sendStatus(500);
    });
};