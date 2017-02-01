var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var jsdom = require('jsdom');

describe('Одеть Надежду', function () {
  var doc, setup, setupOpen, setupClose;

  beforeEach(function (done) {
    jsdom.env('index.html', [
      'js/setup.js'
    ], function(err, window) {
      doc = window.document;

      setup = doc.querySelector('.setup');
      setupOpen = doc.querySelector('.setup-open');
      setupClose = doc.querySelector('.setup-close');

      done();
    });
  });

  context('click(.setup-open)', function () {
    beforeEach(function() {
      setupOpen.click();
    });

    it('диалог .setup должен быть показан', function () {
      expect(setup.classList.contains('invisible')).to.not.be.ok;
    });

    context('click(.setup-close)', function () {
      beforeEach(function() {
        setupClose.click();
      });

      it('диалог .setup должен быть скрыт', function () {
        expect(setup.classList.contains('invisible')).to.be.ok;
      });
    });

    context('валидация имени', function () {
      var nameInput;

      beforeEach(function () {
        nameInput = doc.querySelector('.setup-user-name');
      });

      it('имя должно быть указано', function () {
        expect(nameInput.required).to.be.ok;
      });

      it('имя не может быть длинее 50 символов', function () {
        expect(+nameInput.maxLength).to.be.eq(50);
      });
    });

    context('цвет мантии персонажа', function() {
      var wizardCoat;

      var coatColors = [
        "rgb(101,137,164)", "rgb(241,43,107)", "rgb(146,100,161)",
        "rgb(56,159,117)", "rgb(215,210,55)", "rgb(0,0,0)"
      ];

      beforeEach(function () {
        wizardCoat = doc.querySelector('#wizard-coat');
        wizardCoat.click();
      });

      it('должен выбираться из указанного списка', function () {
        expect(
          wizardCoat.style.fill.replace(/\s+/g, '')
        ).to.be.oneOf(coatColors);
      });
    });

    context('цвет глаз персонажа', function () {
      var wizardEyes;

      var eyesColors = [
        "black", "red", "blue", "yellow", "green"
      ];

      beforeEach(function () {
        wizardEyes = doc.querySelector('#wizard-eyes');
        wizardEyes.click();
      });

      it('должен выбираться из указанного списка', function () {
        expect(
          wizardEyes.style.fill
        ).to.be.oneOf(eyesColors);
      });
    });

    context('цвет огненного шара', function () {
      var fireball;

      var fireColors = [
        "rgb(238,72,48)", "rgb(48,168,238)", "rgb(92,230,192)",
        "rgb(232,72,213)", "rgb(230,232,72)"
      ];

      beforeEach(function () {
        fireball = doc.querySelector('.setup-fireball-wrap');
        fireball.click();
      });

      it('должен выбираться из указанного списка', function () {
        expect(
          fireball.style.background.replace(/\s+/g, '')
        ).to.be.oneOf(fireColors);
      });
    });
  });
});
