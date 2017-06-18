const os = require('os');
const expect = require('chai').expect;
const Streams = require('../streams');
const Factory = require('../factory');

describe('datafile', function() {
  it('should write data', function() {

    const stringify = Streams.stringify();

    stringify.pipe(Streams.datafile());

    stringify.write(Factory.version());

    for(let i = 0; i <= 10; i++) {
      stringify.write(Factory.team({
        name: 'testname',
        display_name: 'Test Name',
        description: 'Test Description',
        type: 'I',
        allow_open_invite: true
      }));
    }

    stringify.end();
  });
});
