var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');

describe('Файловая система', function() {
  it('Каталог src/js должен присутствовать', function() {
    var jsDir = path.resolve('src/js');

    expect(fs.statSync(jsDir).isDirectory()).to.be.ok;
  });


});
