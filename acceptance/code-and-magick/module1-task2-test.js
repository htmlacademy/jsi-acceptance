// acceptance/code-and-magick/module1-task2-test.js

var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var load = require('../..').load;

var checkJs = path.resolve('src/js/check.js');

describe('Начинаем программировать', function() {
  it('Файл src/js/check.js должен быть создан', function() {
    expect(fs.statSync(checkJs).isFile()).to.be.ok;
  });

  context('Функция getMessage', function() {
    var getMessage;

    before(function() {
      getMessage = load(checkJs, ['getMessage']).getMessage;
    });

    it('Должна быть определена', function() {
      expect(getMessage).to.be.a('function');
    });

    context('Проверяем работу функции', function() {
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
    });
  });
});
