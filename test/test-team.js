const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const connection = require('../src/database/connection');
const server = require('../server');
const generateUniqueId = require('../src/utils/generateUniqueId');

chai.use(chaiHttp);

describe('Teams', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

    const id = generateUniqueId();

    const first_team = {
      name: 'test-team1',
      established_in: 1899,
      league: 'testing league1',
      division: 'testing division',
      logo: 'some logo',
      number_of_titles: 1,
    };

    const {
      name,
      established_in,
      league,
      division,
      logo,
      number_of_titles,
    } = first_team;

    await connection('team').insert({
      id,
      name,
      established_in,
      league,
      division,
      logo,
      number_of_titles,
    });
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

    const invalid_payload = {
      name: 'test-team',
      established_in: 1870,
      league: 'testing league',
      division: 'test division',
      logo: 'some logo',
      number_of_titles: '',
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

    it('Test create team with invalid data should return 400', (done) => {
      chai
        .request(server)
        .post('/v1/teams')
        .send(invalid_payload)
        .end((request, response) => {
          expect(response.status).to.equal(400);
          done();
        });
    });
  });

  describe('List teams', () => {
    it('Test list team should return 200', (done) => {
      chai
        .request(server)
        .get('/v1/teams')
        .end((request, response) => {
          expect(response.status).to.equal(200);
          expect(response.body).is.an('array');
          expect(response.body[0]).have.property('id');
          expect(response.body[0]).have.property('name');
          expect(response.body[0]).have.property('logo');
          done();
        });
    });

    it('Test list team pagination without number should return 400', (done) => {
      chai
        .request(server)
        .get('/v1/teams?page=n')
        .end((request, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.message).to.equal('"page" must be a number');
          done();
        });
    });
  });

  describe('Find team by id', () => {
    it('Test find team by id should return 200', (done) => {
      chai
        .request(server)
        .get('/v1/teams')
        .end((request, response) => {
          chai
            .request(server)
            .get(`/v1/teams/${response.body[0].id}`)
            .end((request, response) => {
              expect(response.status).to.equal(200);
              expect(response.body).have.property('id');
              expect(response.body).have.property('name');
              expect(response.body).have.property('established_in');
              expect(response.body).have.property('league');
              expect(response.body).have.property('division');
              expect(response.body).have.property('logo');
              expect(response.body).have.property('number_of_titles');
              done();
            });
        });
    });
  });

  describe('Update team', () => {
    it('Test update team should return 200', (done) => {
      chai
        .request(server)
        .get('/v1/teams')
        .end((request, response) => {
          expect(response.body[0].name).is.not.equal('first_team');
          chai
            .request(server)
            .put(`/v1/teams/${response.body[0].id}`)
            .send({ name: 'first_team' })
            .end((request, response) => {
              expect(response.status).to.equal(200);
              expect(response.body.name).to.equal('first_team');
              expect(response.body).has.property('id');
              expect(response.body).has.property('established_in');
              expect(response.body).has.property('league');
              expect(response.body).has.property('division');
              expect(response.body).has.property('logo');
              expect(response.body).has.property('number_of_titles');
              done();
            });
        });
    });

    it('Test update team with invalid data should return 400', (done) => {
      chai
        .request(server)
        .get('/v1/teams')
        .end((request, response) => {
          chai
            .request(server)
            .put(`/v1/teams/${response.body[0]}`)
            .send({ name: 'first_team', established_in: 1870 })
            .end((request, response) => {
              expect(response.status).to.equal(400);
              expect(response.body.message).to.equal(
                '"established_in" must be larger than or equal to 1871'
              );
              done();
            });
        });
    });
  });

  describe('Delete team', () => {
    it('Test delete team should return 204', (done) => {
      chai
        .request(server)
        .get('/v1/teams')
        .end((request, response) => {
          chai
            .request(server)
            .delete(`/v1/teams/${response.body[0].id}`)
            .end((request, response) => {
              expect(response.status).to.equal(204);
              done();
            });
        });
    });
  });
});
