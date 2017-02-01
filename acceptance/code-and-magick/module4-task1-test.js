var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var jsdom = require('jsdom');

describe('Нажатие посохом', function () {
  var setup, setupForm, setupOpen, setupClose;

  beforeEach(function (done) {
    jsdom.env('index.html', [
      'js/setup.js'
    ], function(err, window) {
      doc = window.document;

      setup = doc.querySelector('.setup');
      setupForm = doc.querySelector('.setup-wizard-form');
      setupOpen = doc.querySelector('.setup-open');
      setupClose = doc.querySelector('.setup-close');

      done();
    });
  });

  context('диалог .setup-wizard-form', () => {
    it('должен иметь роль «dialog»', () => {
      expect(setupForm.getAttribute('role')).to.be.oneOf([
        'dialog', 'alertdialog', 'alert']
      );
    });
  });

  context('кнопка открытия диалога', () => {
    var openIcon;

    beforeEach(() => {
       openIcon = doc.querySelector('.setup-open-icon');
    });

    it('должна иметь роль «button»', () => {
      expect(openIcon.getAttribute('role')).to.eq('button');
    });
  });

});