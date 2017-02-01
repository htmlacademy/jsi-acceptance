var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var jsdom = require('jsdom');
var utils = require('../utils');

describe('Делегируй!', () => {
  var doc, win, qs, qsa;
  var fireKeyboardPress;

  beforeEach((done) => {
    jsdom.env('index.html', ['js/form.js'], (err, window) => {
      if(err) {
        console.error(err.stack.toString());
      } else {
        win = window;

        results = utils(win, (o) => {
          doc = o.doc;
          qs = o.qs;
          qsa = o.qsa;
          fireKeyboardPress = o.fireKeyboardPress;
        });

        isInvisible = (elt) => {
          return elt.style.display !== 'none';
        };

        isVisible = (elt) => {
          return !isInvisible(elt);
        };
      }

      done();
    });
  });

  context('.dialog', () => {
    let dialog;

    beforeEach(() => {
      dialog = qs('.dialog');
    });

    it('должен быть диалогом', () => {
      expect(dialog.getAttribute('role')).to.be.oneOf([
        'dialog', 'alertdialog', 'alert'
      ]);
    });
  });
});
