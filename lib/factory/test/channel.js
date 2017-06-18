const expect = require('chai').expect;
const channel = require('../channel');

const basic = {
  team: 'test-team',
  name: 'test-channel',
  display_name: 'Test Channel',
  header: 'Test Channel Header',
  purpose: 'Test the channel generator',
  type: 'P'
};

describe('team generator', function() {

  it('should produce a valid object', function() {
    var c = channel(basic);
    expect(c).to.be.an('object');
    expect(c).to.deep.equal({
      type: 'channel',
      channel: basic
    })
  });

  it('should prevent an invalid type', function() {
    try {
      var c = channel(Object.assign({}, basic, {
        type: 'X'
      }));
    }
    catch (e) {
      expect(e).to.be.an('error');
      expect(e.details[0].message).to.equal('"type" must be one of [O, P]');
    }
  });
});
