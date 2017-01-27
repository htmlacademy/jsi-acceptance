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
    var overlay, uploadForm;

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

          overlay = qs('.upload-overlay');
          uploadForm = qs('#upload-select-image');
        }

        done();
      });
    });

    it('div.upload-overlay должен быть скрыт', () => {
      expect(overlay.classList.contains('invisible')).to.be.ok;
    });

    it('форма #upload-select-image должна быть показана', () => {
      expect(uploadForm.classList.contains('invisible')).to.not.be.ok;
    });

    context('выбор файла в форме загрузки', () => {
      beforeEach(() => {
        var fileInput = qs('#upload-file');
        fileInput.value = '/tmp/image.jpg';
        fireEvent(fileInput);
      });

      it('форма загрузки должна исчезнуть', () => {
        expect(uploadForm.classList.contains('invisible')).to.be.ok;
      });

      it('форма кадрирования должна появиться', () => {
        expect(overlay.classList.contains('invisible')).to.not.be.ok;
      });
    });
  });    
});