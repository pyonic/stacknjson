const { badRequest } = require('boom');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        const { key } = req.query;
        const inMemoryJson = req.app.get('inMemoryJson');

        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const json = userIp in inMemoryJson ? inMemoryJson[userIp] : {};

        const value = json[key] || {};
        const data = value.data ? { key, value: value.data, ttl: value.ttl } : {};

        return res.send({ data });
    } catch (error) {
        next(error);
    }
});

router.post('/set', (req, res, next) => {
    try {
        const { key, value, ttl } = req.body;
        if (!key || !value) throw badRequest('Please provide required fields key, value');
        const inMemoryJson = req.app.get('inMemoryJson');
        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const json = userIp in inMemoryJson ? inMemoryJson[userIp] : {};

        // Delete key from memory timer
        if (ttl) {
            setTimeout(() => {
                const inMemoryJson = req.app.get('inMemoryJson');
                const json = userIp in inMemoryJson ? inMemoryJson[userIp] : {};
                json[key] = null;
                inMemoryJson[userIp] = json;
                req.app.set('inMemoryJson', inMemoryJson);
            }, ttl * 1000);
        }

        json[key] = { data: value, ttl };
        inMemoryJson[userIp] = json;
        req.app.set('inMemoryJson', inMemoryJson);
        return res.json({ success: true, key, value });
    } catch (error) {
        next(error);
    }
});

router.delete('/:key', (req, res, next) => {
    try {
        const { key } = req.params;
        const inMemoryJson = req.app.get('inMemoryJson');
        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const json = userIp in inMemoryJson ? inMemoryJson[userIp] : {};
        json[key] = null;
        inMemoryJson[userIp] = json;
        req.app.set('inMemoryJson', inMemoryJson);
        return res.send({ success: true });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
