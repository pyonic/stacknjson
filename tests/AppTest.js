const request = require('supertest');
const { describe, it, expect } = require('@jest/globals');
const app = require('../app');

const TTL = 2; // TTL for 2 seconds

describe('Test example', () => {
    it('Check starter inMemory state', async () => {
        await request(app).get('/api/lifo').then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.body.value).toBe(null);
        });
    });
    it('Check add and get values', async () => {
        await request(app).post('/api/lifo/add')
            .send({ value: 'Hello' })
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.body.success).toBe(true);
            });
        await request(app).get('/api/lifo').then(r => {
            expect(r.body.value).toBe('Hello');
        });
        await request(app).get('/api/lifo').then(r => {
            expect(r.body.value).toBe(null);
        });

        // Multiple adds
        await request(app).post('/api/lifo/add')
            .send({ value: '2' })
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.body.success).toBe(true);
            });
        await request(app).post('/api/lifo/add')
            .send({ value: '3' })
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.body.success).toBe(true);
            });
        await request(app).get('/api/lifo').then(r => {
            expect(r.body.value).toBe('3');
        });
        await request(app).get('/api/lifo').then(r => {
            expect(r.body.value).toBe('2');
        });
        await request(app).get('/api/lifo').then(r => {
            expect(r.body.value).toBe(null);
        });
    });
});

describe('In-memory Key-Value with TTL test', () => {
    it('Test add key-value', async () => {
        await request(app).post('/api/memo/set')
            .send({ key: 'name', value: 'Andy' })
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.body.success).toBe(true);
            });
        await request(app).get('/api/memo?key=name').then(r => {
            expect(r.body.data.key).toBe('name');
            expect(r.body.data.value).toBe('Andy');
        });
    });
    it('Test add key-value with TTL', async () => {
        await request(app).post('/api/memo/set')
            .send({ key: 'name', value: 'Andy', ttl: TTL })
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.body.success).toBe(true);
            });
        await request(app).get('/api/memo?key=name').then(r => {
            expect(r.body.data.key).toBe('name');
            expect(r.body.data.value).toBe('Andy');
        });

        // Исскуственно задерживаем тест, пока данные не удалятся
        await new Promise((resolve) => {
            setTimeout(resolve, TTL * 1000);
        });

        await request(app).get('/api/memo?key=name').then(r => {
            expect(r.body.data.key).toBe(undefined);
        });
    });
});
