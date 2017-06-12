const expect = require('chai').expect;
const World = require('../world');

describe('world', function() {
  it('should say hello', function() {
    expect(World.hello()).to.equal('hello');
  });
});
