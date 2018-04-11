const supertest = require('supertest');
const test = require('tape');
const app = require('./app');

const request = supertest(app);

test('degree', t => {
  request.get('/units/si?units=degree').end((err, res) => {
    t.deepEqual(res.body, { unit_name: 'rad', multiplication_factor: 0.017453292519943 });
    t.end();
  });
});
test('degree/minute', t => {
  request.get('/units/si?units=degree/minute').end((err, res) => {
    t.deepEqual(res.body, { unit_name: 'rad/s', multiplication_factor: 0.00029088820866572 });
    t.end();
  });
});
test('(degree/(minute*hectare))', t => {
  request.get('/units/si?units=(degree/(minute*hectare))').end((err, res) => {
    t.deepEqual(res.body, {
      unit_name: '(rad/(s*m_squared))',
      multiplication_factor: 2.9088820866572e-8,
    });
    t.end();
  });
});
test('degree/ha*°)', t => {
  request.get('/units/si?units=ha*°').end((err, res) => {
    t.deepEqual(res.body, {
      unit_name: 'm_squared*rad',
      multiplication_factor: 174.53292519943,
    });
    t.end();
  });
});
test('bad syntax 1', t => {
  request
    .get('/units/si?units=(degree/)minute*hectare')
    .expect(400)
    .end((err, res) => {
      t.error(err, 'No error');
      t.end();
    });
});
test('bad syntax 2', t => {
  request
    .get('/units/si?units=hectare"')
    .expect(400)
    .end((err, res) => {
      t.error(err, 'No error');
      t.end();
    });
});
