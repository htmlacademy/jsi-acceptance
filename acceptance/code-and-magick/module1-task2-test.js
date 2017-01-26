var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var loadFromHtml = require('../..').loadFromHtml;

var indexHtml = path.resolve('index.html');

describe('Начинаем программировать:', function() {
  var content;

  it('Файл index.html должен быть создан', function() {
    expect(fs.statSync(indexHtml).isFile()).to.be.ok;
  });

  context('Содержимое index.html:', function() {
    beforeEach(function() {
      content = loadFromHtml(indexHtml, [
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
          var getWizardHeight = loadFromHtml(indexHtml, ['getWizardHeight'], {wizardWidth: 0}).getWizardHeight;
          expect(getWizardHeight()).to.eq(0);
        });
      });
    });

    context('getWizardX', function() {
      var getWizardX;

      before(function() {
        // getWizardX = loadFromHtml(
        //   indexHtml, ['getWizardX'], {wizardWidth: 0}
        // ).getWizardX;
        getWizardX = content.getWizardX;
      });

      it('должна быть функцией', function() {
        expect(getWizardX).to.be.a('function');
      });

      it('результат должен быть в указанном диапазоне', function() {
        expect(getWizardX(200)).to.be.below(136).and.above(64);
      });
    });

    context('getWizardY', function() {
      var getWizardY;

      before(function() {
        getWizardY = content.getWizardY;
      });

      it('должна быть функцией', function() {
        expect(getWizardY).to.be.a('function');
      });

      it('должна возвращать примерно 1/3 от высоты', function() {
        expect(getWizardY(300)).to.be.above(100 - 94).and.below(101);
      });
    });
  });
});
