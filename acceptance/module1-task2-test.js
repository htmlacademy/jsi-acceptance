var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var config = require('..').config;

var checkJs = path.resolve('src/js/check.js');
var getMessageFunction = function() {
  var jsCode = fs.readFileSync(checkJs, 'utf8').toString();
  var window = { eval: function() {}, document: null };
  var fn, getMessage;

  var previousFn = global.getMessage;

  (function() {
    eval(jsCode);
    fn = getMessage || global.getMessage || window.getMessage;
  })();

  global.getMessage = previousFn;

  return fn;
};

describe('Начинаем программировать', function() {
  it('Файл src/js/check.js должен быть создан', function() {
    expect(fs.statSync(checkJs).isFile()).to.be.ok;
  });

  context('Функция getMessage', function() {
    var getMessage;

    beforeEach(function() {
      if(!getMessage) {
        getMessage = getMessageFunction();
      }
    });

    it('Должна быть определена', function() {
      expect(getMessage).to.be.a('function');
    });

    context('Проверяем работу функции', function() {
      if(config.isKekstagram()) {
        it('a === true', function() {
          expect(getMessage(true, 38)).to.
            eq('Переданное GIF-изображение анимировано и содержит 38 кадров');
        });

        it('a === false', function() {
          expect(getMessage(false)).to.
            eq('Переданное GIF-изображение не анимировано');
        });

        it('a - число', function() {
          expect(getMessage(6, 9)).to.eq(
            'Переданное SVG-изображение содержит 6 объектов и 36 атрибутов'
          );
        });

        it('a - массив', function() {
          expect(getMessage([1, 2, 3, 4])).to.eq(
            'Количество красных точек во всех строчках изображения: 10'
          );
        });

        it('a и b - массивы', function() {
          expect(getMessage([1, 2, 3, 4], [2, 2, 2, 2])).to.eq(
            'Общая площадь артефактов сжатия: 20 пикселей'
          );
        });

        it('a - объект, не массив', function() {
          expect(getMessage({})).to.eq('Переданы некорректные данные');
        });
      }

      if(config.isCodeAndMagick()) {
        it('a === true', function() {
          expect(getMessage(true, 'дерево')).to.
            eq('Я попал в дерево');
        });

        it('a === false', function() {
          expect(getMessage(false)).to.
            eq('Я никуда не попал');
        });

        it('a - число', function() {
          expect(getMessage(6, 9)).to.eq(
            'Я прыгнул на 600 сантиметров'
          );
        });

        it('a - массив', function() {
          expect(getMessage([1, 2, 3, 4])).to.eq(
            'Я прошёл 10 шагов'
          );
        });

        it('a и b - массивы', function() {
          expect(getMessage([1, 2, 3, 4], [2, 2, 2, 2])).to.eq(
            'Я прошёл 20 метров'
          );
        });

        it('a - объект, не массив', function() {
          expect(getMessage({})).to.eq('Переданы некорректные данные');
        });
      }
    });
  });
});
