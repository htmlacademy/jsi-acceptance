var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var load = require('../..').load;
var Context = require('../..').MockContext;

var statJs = path.resolve('js/stat.js');

describe('Холст', function() {
  var content;

  it('Файл js/stat.js должен быть создан', function() {
    expect(fs.statSync(statJs).isFile()).to.be.ok;
  });

  context('Содержимое js/stat.js', function() {
    before(function() {
      content = load(statJs, [
        'renderStatistics'
      ]);
    });

    context('renderStatistics', function() {
      var renderStatistics;

      before(function() {
        renderStatistics = content.renderStatistics;
      });

      it('должна быть функцией', function() {
        expect(renderStatistics).to.be.a('function');
      });

      context('когда вызвана', function() {
        var ctx, names, times;

        before(function() {
          names = ['Игорь', 'Вы'];
          times = [1000.301, 1050.55];
        });

        beforeEach(function() {
          ctx = new Context();
          ctx.canvas = { clientHeight: 200, clientWidth: 350 };
          renderStatistics(ctx, names, times);
        });

        it('должна отрисовать бэкграунд', function() {
          expect(
            ctx.hasSequence('fillRect') ||
            ctx.hasSequence('beginPath', 'moveTo', 'closePath', 'fill')
          ).to.be.ok;
        });

        it('должна вывести текст', function() {
          expect(
            ctx.hasCalled('fillText').with(function(msg, x, y) {
              return msg === 'Ура вы победили!';
            })
          ).to.be.ok;

          expect(
            ctx.hasCalled('fillText').with(function(msg, x, y) {
              return msg === 'Список результатов:';
            })
          ).to.be.ok;
        });

        it('должна, как минимум, дважды отрисовать прямоугольники гистограмм', function() {
          expect(ctx.hasSequence('fillRect', 'fillRect')).to.be.ok;
        });

        it('должна вывести имена', function() {
          expect(ctx.hasCalled('fillText'), (msg) => msg === 'Игорь');
          expect(ctx.hasCalled('fillText'), (msg) => msg === 'Вы');
        });

        it('должна вывести время', function() {
          expect(ctx.hasCalled('fillText'), (msg) => msg === '1000');
          expect(ctx.hasCalled('fillText'), (msg) => msg === '1050');
        });
      });
    });
  });
});
