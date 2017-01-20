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
        'wizardWidth',
        'getWizardHeight',
        'getWizardX',
        'getWizardY'
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

    context('getWizardHeight', function() {
      it('должна быть функцией', function() {
        expect(content.getWizardHeight).to.be.a('function');
      });

      context('если wizardWidth == 70', function() {
        it('должна возвращать число от 93 до 94', function() {
          var value = content.getWizardHeight();

          expect(value).to.be.lt(94);
          expect(value).to.be.gt(93);
        });
      });

      context('если wizardWidth == 0', function() {
        it('должна возвращать 0', function() {
          var getWizardHeight = load(configJs, ['getWizardHeight'], {wizardWidth: 0}).getWizardHeight;
          expect(getWizardHeight()).to.eq(0);
        });
      });
    });

    context('getWizardX', function() {
      var getWizardX;

      beforeEach(function() { getWizardX = content.getWizardX; });

      it('должна быть функцией', function() {
        expect(getWizardX).to.be.a('function');
      });

      it('должна возвращать половину ширины', function() {
        expect(getWizardX(100)).to.be.closeTo(50, 0.001);
        expect(getWizardX(1000)).to.be.closeTo(500, 0.001);
      });
    });

    context('getWizardY', function() {
      var getWizardY;

      beforeEach(function() { getWizardY = content.getWizardY; });

      it('должна быть функцией', function() {
        expect(getWizardY).to.be.a('function');
      });

      it('должна возвращать 1/3 от высоты', function() {
        expect(getWizardY(600)).to.be.closeTo(200, 0.001);
        expect(getWizardY(6000)).to.be.closeTo(2000, 0.001);
      });
    });
  });
});
