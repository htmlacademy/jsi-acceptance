var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var load = require('../..').load;

var configJs = path.resolve('js/config.js');

describe('Начинаем программировать:', function() {
  var content;

  it('Файл js/config.js должен быть создан', function() {
    expect(fs.statSync(configJs).isFile()).to.be.ok;
  });

  context('Содержимое config.js:', function() {
    beforeEach(function() {
      content = load(configJs, [
        'fireballSize',
        'getFireballSpeed',
        'wizardSpeed',
        'wizardWidth'
      ]);
    });

    context('fireballSize', function() {
      it('должен быть равен 22', function() {
        expect(content.fireballSize).to.eq(22);
      });
    });

    context('getFireballSpeed', function() {
      it('должна быть функцией', function() {
        expect(content.getFireballSpeed).to.be.a('function');
      });

      it('должна возвращать 5, если первый параметр — true', function() {
        expect(content.getFireballSpeed(true)).to.eq(5);
      });

      it('должна возвращать 2, если первый параметр — false', function() {
        expect(content.getFireballSpeed(false)).to.eq(2);
      });
    });

    context('wizardSpeed', function() {
      it('должна быть равна 3', function() {
        expect(content.wizardSpeed).to.eq(3);
      });
    });

    context('wizardWidth', function() {
      it('должна быть равна 70', function() {
        expect(content.wizardWidth).to.eq(70);
      });
    });


  });
});
