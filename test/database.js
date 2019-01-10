const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

const DbUtils = require('../src/DbUtils');

describe('Database interaction', () => {
  let comparisonId = '';
  let userId = '';
  const repoName = 'test2';
  const testUserName = 'testUser';

  it('should insert a comparison', (done) => {
    expect(DbUtils.newComparison(repoName).then((comparison) => {
      comparisonId = comparison.id;
      return comparison.id;
    })).to.eventually.be.not.null.notify(done);
  });

  it('should get a comparison', (done) => {
    if (comparisonId != null) {
      expect(DbUtils.getComparison(comparisonId)
        .then(comparison => comparison.repoName)).to.eventually.be.equal(repoName).notify(done);
    }
  });

  it('should add a user to comparison', (done) => {
    if (comparisonId != null) {
      expect(DbUtils.addUser(comparisonId, testUserName).then((user) => {
        userId = user.id;
        return user.id;
      })).to.eventually.be.not.null.notify(done);
    }
  });

  it('should have a user in the comparison', (done) => {
    expect(DbUtils.getComparison(comparisonId)
      .then(comparison => comparison.users.length)).to.eventually.be.equal(1).notify(done);
  });

  it('should remove a user to comparison', (done) => {
    if (comparisonId != null) {
      expect(DbUtils.removeUser(comparisonId, userId)
        .then(() => DbUtils.getComparison(comparisonId))
        .then(comparison => comparison.users.length)).to.eventually.be.equal(0).notify(done);
    }
  });
});
