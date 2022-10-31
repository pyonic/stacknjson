const express = require('express');

const app = express();

app.use(express.json());

app.set('memoryStack', {});
app.set('inMemoryJson', {});

app.use('/api', require('./routes'));

app.use((req, res, next) => {
    next(new Error('Page not found'));
});
app.use((err, req, res, next) => {
    res.statusCode = 500;
    return res.send({ error: err.message });
});

module.exports = app;
