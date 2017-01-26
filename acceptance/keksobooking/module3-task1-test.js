var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var jsdom = require('jsdom');

describe('К делу!', () => {
  var formJs = path.resolve('js/form.js');

  var code = (`
    <html>
      <head>
        <style>
          .pin { width: 20px; height: 20px; }
        </style>
      </head>
      <body>
        <div class="pin pin-1">Pin1</div>
        <div class="pin pin-2">Pin2</div>

        <div class="dialog">
          <div class="dialog__close">x</div>
        </div>
      </body>
    </html>
  `);

  it('Файл js/form.js должен быть создан', function() {
    expect(fs.statSync(formJs).isFile()).to.be.ok;
  });

  context('При загрузке index.html', () => {
    var doc, qs;

    beforeEach((done) => {
      jsdom.env(code, ['js/form.js'], (err, window) => {
        doc = window.document;
        qs = doc.querySelector.bind(doc);
        done();
      });
    });

    context('click(.pin-1)', () => {
      var pin1, pin2;
      var closeDialog, dialog;

      beforeEach(() => {
        pin1 = qs('.pin-1');
        pin2 = qs('.pin-2');

        dialog = qs('.dialog');
        closeDialog = qs('.dialog__close');

        pin1.click();
      });

      it('pin-1 должен быть активен', () => {
        expect(pin1.classList.contains('pin--active')).to.be.ok;
      });

      context('click(.pin-2)', () => {
        beforeEach(() => {
          pin2.click();
        });

        it('pin-2 должен быть активен', () => {
          expect(pin2.classList.contains('pin--active')).to.be.ok;
        });

        it('pin-1 должен быть неактивен', () => {
          expect(pin1.classList.contains('pin--active')).to.not.be.ok;
        });

        it('dialog должен быть показан', () => {
          var style = doc.defaultView.getComputedStyle(dialog);
          expect(style.display).to.eq('block');
        });
      });

      context('click(.dialog__close)', () => {

        beforeEach(() => { 
          closeDialog.click();
        });

        it('диалог должен быть спрятан', () => {
          var style = doc.defaultView.getComputedStyle(dialog);
          expect(style.display).to.eq('none');
        });

        it('pin-1 должен стать неактивным', () => {
          expect(pin1.classList.contains('pin--active')).to.not.be.ok;
        });
      });
    });
  });
});