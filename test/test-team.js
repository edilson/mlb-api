const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const connection = require('../src/database/connection');
const server = require('../server');

chai.use(chaiHttp);

describe('Teams', () => {
  beforeEach(async () => {
    await connection.migrate.latest();
  });

  afterEach(async () => {
    await connection.migrate.rollback();
  });

  describe('Create Team', () => {
    const payload = {
      name: 'test-team',
      established_in: 1880,
      league: 'testing league1',
      division: 'testing division',
      logo: 'some logo',
      number_of_titles: 0,
    };

    it('Test create team should return 201', (done) => {
      chai
        .request(server)
        .post('/v1/teams')
        .send(payload)
        .end((request, response) => {
          expect(response.status).to.equal(201);
          done();
        });
    });
  });
});
