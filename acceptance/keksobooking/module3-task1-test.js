var expect = require('chai').expect;
var path = require('path');
var fs = require('fs');
var jsdom = require('jsdom');

describe('К делу!', () => {
  var formJs = path.resolve('js/form.js');

  it('Файл js/form.js должен быть создан', function() {
    expect(fs.statSync(formJs).isFile()).to.be.ok;
  });

  context('При загрузке index.html', () => {
    var doc, qs, qsa;

    beforeEach((done) => {
      jsdom.env('index.html', ['js/form.js'], (err, window) => {
        if(err) {
          console.error(err.stack.toString());
        } else {
          doc = window.document;
          qs = doc.querySelector.bind(doc);
          qsa = doc.querySelectorAll.bind(doc);
        }

        done();
      });
    });

    context('click(.pin-1)', () => {
      var pin1, pin2;
      var closeDialog, dialog;

      beforeEach(() => {
        pin1 = qsa('.pin')[0];
        pin2 = qsa('.pin')[1];

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

    context('заголовок объявления', () => {
      var title;
      
      beforeEach(() => {
        title = doc.querySelector('#title');
      });

      it('должен быть обязательным полем', () => {
        expect(title.required).to.be.ok;
      });

      it('минимальная длина 30 символов', () => {
        expect(+title.minlength).to.eq(30);
      });

      it('максимальная длина 100 символов', () => {
        expect(+title.maxlength).to.eq(100);
      });
    });

    context('цена за ночь', () => {
      var price;

      beforeEach(() => { price = qs('#price'); });

      it('должна быть обязательным полем', () => {
        expect(price.required).to.be.ok;
      });

      it('должна быть числовым полем', () => {
        expect(price.type).to.eq('number');
      });

      it('минимальное значение 1000', () => {
        expect(+price.min).to.eq(1000);
      });

      it('максимальное значение 1000000', () => {
        expect(+price.max).to.eq(1000000);
      });
    });

    context('адрес', () => {
      var address;

      beforeEach(() => { address = qs('#address'); });

      it('должен быть обязательным полем', () => {
        expect(address.required).to.be.ok;
      });
    });
  });
});