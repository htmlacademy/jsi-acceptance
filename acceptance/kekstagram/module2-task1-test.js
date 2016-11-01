// acceptance/kekstagram/module2-task1-test.js

var chai = require('chai');
var expect = chai.expect;
var path = require('path');
var fs = require('fs');
var load = require('../..').load;
var MockContext = require('../..').MockContext;

var moduleJs = path.resolve('src/js/modules/draw-resizer-border.js');

describe('Canvas', function() {
  it('Файл src/js/modules/draw-resizer-border.js должен быть создан', function() {
    expect(fs.statSync(moduleJs).isFile()).to.be.ok;
  });

  context('Функция drawResizerBorder', function() {
    var drawResizerBorder;

    before(function() {
      drawResizerBorder = load(moduleJs, ['drawResizerBorder']).drawResizerBorder;
    });

    it('Должна быть определена', function() {
      expect(drawResizerBorder).to.be.a('function');
    });

    context('Проверяем работу функции', function() {
      var ctx, resizer, image, container;

      beforeEach(function() {
        ctx = new MockContext();

        ctx.lineWidth = 0;
        container = { width: 200, height: 200 };
        resizer = { side: 120 };
        image = { naturalWidth: 100, naturalHeight: 100 };

        drawResizerBorder(ctx, resizer, container, image);
      });

      it('Рисует прямоугольник или заполняет путь', function() {
        expect(
          ctx.hasCalled('fillRect') ||
          ctx.hasSequence('beginPath', 'moveTo', 'lineTo', 'closePath', 'fill')
        ).to.be.ok;

        if(ctx.hasCalled('fill')) {
          expect(ctx.hasCalled('fill').with('evenodd')).to.be.ok;
        }
      });

      it('Выводит текст над рамкой', function() {
        expect(
          ctx.hasCalled('fillText').with(function(message, x, y) {
            return (
              message.replace(/\s+/g, '') === '100x100' &&
              (x > -60 && x < 60) &&
              (y <= -60)
            );
          })
        ).to.be.ok;
      });
    });
  });
});
