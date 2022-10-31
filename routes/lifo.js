const { badRequest } = require('boom');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        const memoryStack = req.app.get('memoryStack');
        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const stack = userIp in memoryStack ? memoryStack[userIp] : [];
        const top = stack.pop() || null;
        return res.send({ value: top });
    } catch (error) {
        next(error);
    }
});

router.post('/add', (req, res, next) => {
    try {
        const { value } = req.body;
        if (!value) throw badRequest('Please provide require field value');
        const memoryStack = req.app.get('memoryStack');
        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const stack = userIp in memoryStack ? memoryStack[userIp] : [];
        stack.push(value);
        memoryStack[userIp] = stack;
        req.app.set('memoryStack', memoryStack);
        return res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
