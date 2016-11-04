// acceptance/code-and-magick/module2-task1-test.js

var chai = require('chai');
var expect = chai.expect;
var path = require('path');
var fs = require('fs');
var load = require('../..').load;
var MockContext = require('../..').MockContext;

var moduleJs = path.resolve('src/js/modules/draw-pause-screen.js');

describe('Canvas', function() {
  var saveConsole;

  beforeEach(function() {
    saveConsole = global.console;
    global.console = {};
  });

  afterEach(function() {
    global.console = saveConsole;
  });

  it('Файл src/js/modules/draw-resizer-border.js должен быть создан', function() {
    expect(fs.statSync(moduleJs).isFile()).to.be.ok;
  });

  context('Функция drawPauseScreen', function() {
    var drawPauseScreen;

    before(function() {
      drawPauseScreen = load(moduleJs, ['drawPauseScreen']).drawPauseScreen;
    });

    it('Должна быть определена', function() {
      expect(drawPauseScreen).to.be.a('function');
    });

    context('Проверяем работу функции', function() {
      var ctx, pendalf, message;

      beforeEach(function() {
        ctx = new MockContext();
        pendalf = {
          direction: 1, /* Direction.LEFT */
          x: 100,
          y: 100,
          width: 36,
          height: 36
        };
        message = 'Добро пожаловать на борт. Просьба сохранять билеты до конца поездки. Строка должна быть очень длинной, чтобы обязательно были переносы';

        drawPauseScreen(message, ctx, pendalf);
      });

      it('Рисует прямоугольник или заполняет путь', function() {
        expect(
          ctx.hasCalled('fillRect') ||
          ctx.hasSequence('beginPath', 'moveTo', 'lineTo', 'closePath', 'fill')
        ).to.be.ok;
      });

      it('Выводит текст сообщения', function() {
        expect(
          ctx.hasCalled('fillText') &&
          ctx.hasCalled('fillText').with(function(message, x, y) {
            return message.indexOf('Добро пожаловать') > -1;
          })
        ).to.be.ok;
      });

      it('Выводит текст сообщения в несколько строк', function() {
        expect(
          ctx.hasSequence('fillText', 'fillText')
        ).to.be.ok;
      });
    });
  });
});
