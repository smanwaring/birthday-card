const db = require('../../server/db');
const People = require('../../server/db/models').People;
// Unit testing libraries
const chai = require('chai');
const expect = chai.expect;
const chalk = require('chalk');
// Route testing for routes
const app = require('../../server/app');
const supertest = require('supertest');
const agent = supertest.agent(app);

describe('People', () => {
  before('wait for the db', (done) => {
    db.sync( {force: true} )
      .then(() => {
        console.log(chalk.yellow('Sync success'));
        done();
      })
      .catch(done);
  });

  after('clear db', () => db.didSync);

  const validPerson = {
    name: 'Stephanie',
    favoriteCity: 'Manhattan'
  };

  const invalidPerson = {
    name: 'Stephanie'
  };

  describe('Model: ', () => {

    describe('People Validations: ', () => {

      it('successfully creates a valid person', () => {
        return People.create(validPerson)
          .then(createdPerson => {
            expect(createdPerson.dataValues).to.include.keys('name');
            expect(createdPerson.dataValues).to.include.keys('favoriteCity');
          })
          .catch(err => console.error(err));
      });

      it('reports a validation error for invalid person entries', () => {
        return People.create(invalidPerson)
          .then(error => {
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.contain('invalid input');
          })
          .catch(err => console.log(chalk.green('You got a validation error')));
      });
    });
  });

  describe('Routes: ', () => {

    before('wait for the db', (done) => {
      db.sync( {force: true} )
        .then(() => {
          console.log(chalk.yellow('Sync success'));
          done();
        })
        .catch(done);
    });

    after('clear db', () => db.didSync);

    const validPersonB = {
      id: 400,
      name: 'Tony',
      favoriteCity: 'Milan'
    };

      it('POST /api/people >> creates a person and returns that created person', (done) => {
        agent.post('/api/people')
          .set('Content-type', 'application/json')
          .send(validPersonB)
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.include({ name: 'Tony' });
            expect(res.body).to.include({ favoriteCity: 'Milan' });
            done();
          });
      });

      it('GET /api/people >> returns all the people in the database', (done) => {
        agent.get('/api/people')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body[0]).to.include({ name: 'Tony' });
            expect(res.body).to.have.length(1);
            done();
          });
      });

      it('GET /api/people/:userID >> sends a 204 if it a non-valid id is passed in', (done) => {
        agent.get('/api/people/8675309')
          .expect(204)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });

      it('GET /api/people/:userId >> returns a valid person', (done) => {
        agent.get('/api/people/400')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.name).to.be.equal('Tony');
          done();
        });
    });

      it('PUT /api/people/:userId >> sends a 204 if the person does not exist', (done) => {
        agent.put('/api/people/8675309')
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

      it('PUT /api/people/:userId >> updates the user', (done) => {
        agent.put('/api/people/400')
        .set('Content-type', 'application/json')
        .send({
          favoriteCity: 'Brooklyn'
        })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.name).to.be.equal('Tony');
          expect(res.body.favoriteCity).to.be.equal('Brooklyn');
          done();
        });
      });

      it('DELETE /api/people/:userId >> sends a 204 if the person does not exist', (done) => {
        agent.delete('/api/people/8675309')
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
      });

      it('DELETE /api/people/:userId >> deletes a user', (done) => {
        agent.delete('/api/people/400')
        .expect(204);
        done();
      });
  });
});
