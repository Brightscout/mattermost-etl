const expect = require('chai').expect;
const version = require('../version');

describe('version generator', function() {
  it('should produce a valid version', function() {
    var v = version();
    expect(v).to.be.an('object');
    expect(v).to.deep.equal({
      type: "version",
      version: 1
    })
  });
});
