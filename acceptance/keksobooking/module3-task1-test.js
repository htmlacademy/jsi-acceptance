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
    var fireEvent;

    beforeEach((done) => {
      jsdom.env('index.html', ['js/form.js'], (err, window) => {
        if(err) {
          console.error(err.stack.toString());
        } else {
          doc = window.document;
          qs = doc.querySelector.bind(doc);
          qsa = doc.querySelectorAll.bind(doc);

          fireEvent = (element, type = 'change') => {
            var event = doc.createEvent("HTMLEvents");
            event.initEvent(type, false, true);
            element.dispatchEvent(event);
          };
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

    context('время заезда и время выезда', () => {
      var time, timeout;
      var timeValues, timeoutValues;
      var valueIdx;

      beforeEach(() => {
        time = qs('#time');
        timeout = qs('#timeout');

        timeValues = Array.from(time.querySelectorAll('option')).map((o) => o.value);
        timeoutValues = Array.from(timeout.querySelectorAll('option')).map((o) => o.value);

        valueIdx = Math.floor(Math.random() * 2);

        time.value = timeValues[valueIdx];
        fireEvent(time);
      });

      it('должны быть синхронизированы', () => {
        expect(timeout.value).to.eq(timeoutValues[valueIdx]);
      });
    });

    context('тип жилья', () => {
      var type, typeValues;
      var price;

      beforeEach(() => {
        type = qs('#type');
        typeValues = Array.from(type.querySelectorAll('option')).map((o) => o.value);

        price = qs('#price');
      });

      context('«лачуга»', () => {
        beforeEach(() => { 
          type.value = typeValues[1];
          fireEvent(type, 'change');
        });

        it('устанавливает минимальную цену в 0', () => {
          expect(+price.min).to.eq(0);
        });
      });

      context('«квартира»', () => {
        beforeEach(() => { 
          type.value = typeValues[1];
          fireEvent(type, 'change');
          type.value = typeValues[0];
          fireEvent(type, 'change');
        });

        it('устанавливает минимальную цену в 1000', () => {
          expect(+price.min).to.eq(1000);
        });
      });

      context('«дворец»', () => {
        beforeEach(() => { 
          type.value = typeValues[2];
          fireEvent(type, 'change');
        });

        it('устанавливает минимальную цену в 10000', () => {
          expect(+price.min).to.eq(10000);
        });
      });
    });

    context('количество комнат и гостей', () => {
      var rooms, guests;
      var roomValues, guestValues;

      beforeEach(() => {
        rooms = qs('#room_number');
        guests = qs('#capacity');

        roomValues = Array.from(rooms.querySelectorAll('option')).map((o) => o.value);
        guestValues = Array.from(guests.querySelectorAll('option')).map((o) => o.value);
      });

      context('1 комната', () => {
        beforeEach(() => {
          rooms.value = roomValues[0];
          fireEvent(rooms);
        });

        it('— «не для гостей»', () => {
          expect(guests.value).to.eq(guestValues[1]);
        });
      });

      context('2 комнаты', () => {
        beforeEach(() => {
          rooms.value = roomValues[1];
          fireEvent(rooms);
        });

        it('— «для 3 гостей»', () => {
          expect(guests.value).to.eq(guestValues[0]);
        });
      });

      context('3 комнаты', () => {
        beforeEach(() => {
          rooms.value = roomValues[2];
          fireEvent(rooms);
        });

        it('— «для 3 гостей»', () => {
          expect(guests.value).to.eq(guestValues[0]);
        });
      });
    });
  });
});