var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var jsdom = require('jsdom');
var utils = require('../utils');

describe('Нажатие посохом', function () {
  var setup, setupForm, setupOpen, setupClose;
  var fireKeyboardEvent, fireKeyboardPress;
  var isInvisible, isVisible;
  var doc, win;

  beforeEach(function (done) {
    jsdom.env('index.html', [
      'js/setup.js'
    ], function(err, window) {
      win = window;

      utils(win, (o) => {
        doc = o.doc;
        fireKeyboardPress = o.fireKeyboardPress;
      });

      setup = doc.querySelector('.setup');
      setupForm = doc.querySelector('.setup-wizard-form');
      setupOpen = doc.querySelector('.setup-open');
      setupClose = doc.querySelector('.setup-close');

      isInvisible = (elt) => {
        return elt.classList.contains('invisible');
      };

      isVisible = (elt) => {
        return !isInvisible(elt);
      };

      done();
    });
  });

  context('диалог .setup-wizard-form', () => {
    it('должен иметь роль «dialog»', () => {
      expect(setupForm.getAttribute('role')).to.be.oneOf([
        'dialog', 'alertdialog', 'alert']
      );
    });

    it('должен закрываться по нажатию «Esc»', () => {
      setupOpen.click(); // open dialog
      fireKeyboardPress(win, 'Escape');
      expect(isInvisible(setup)).to.be.ok;
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

    it('должна иметь установленный tabindex', () => {
      expect(openIcon.tabIndex).to.eq(0);
    });

    it('должна открывать диалог по Enter', () => {
      fireKeyboardPress(openIcon, 'Enter');
      expect(isVisible(setup)).to.be.ok;
    });
  });

  context('кнопка закрытия диалога', () => {
    beforeEach(() => {
      setupOpen.click(); // open dialog
    });

    it('должна иметь роль «button»', () => {
      expect(setupClose.getAttribute('role')).to.eq('button');
    });

    it('должна иметь установленный tabindex', () => {
      expect(setupClose.tabIndex).to.eq(0);
    });

    it('должна закрывать диалог по «Enter»', () => {
      fireKeyboardPress(setupClose, 'Enter');
      expect(isInvisible(setup)).to.be.ok;
    });
  });

  context('кнопка сохранения', () => {
    let saveButton;

    beforeEach(() => {
      setupOpen.click();
      saveButton = doc.querySelector('.setup-submit');
    });

    it('закрывает диалог по щелчку', () => {
      saveButton.click();
      expect(isInvisible(setup)).to.be.ok;
    });

    it('закрывает диалог по нажатию «Enter»', () => {
      fireKeyboardPress(saveButton, 'Enter');
      expect(isInvisible(setup)).to.be.ok;
    });
  });

});
