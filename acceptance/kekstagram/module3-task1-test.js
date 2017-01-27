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

      context('закрытие формы кадрирования', () => {
        beforeEach(() => {
          var cancel = qs('.upload-form-cancel');
          cancel.click();
        });

        it('форма кадрирования должна исчезнуть', () => {
          expect(overlay.classList.contains('invisible')).to.be.ok;
        });

        it('форма загрузки должна появиться', () => {
          expect(uploadForm.classList.contains('invisible')).to.not.be.ok;
        });
      });

      context('смена фильтра', () => {
        var chrome, sepia, labels, preview;
        var filter;

        beforeEach(() => {
          labels = qsa('.upload-filter-label');
          chrome = labels[1];
          sepia = labels[2];
          preview = qs('.filter-image-preview');
          filter = qs('.upload-filter').elements['upload-filter'];
        });

        context('click(chrome)', () => {
          beforeEach(() => { 
            filter.value = 'chrome';
            chrome.click(); 
          });

          it('применить фильтр «chrome»', () => {
            expect(preview.classList.contains('filter-chrome')).to.be.ok;
          });

          it('класс «image-preview» должен остаться', () => {
            expect(preview.classList.contains('filter-image-preview')).to.be.ok;
          });
        });

        context('click(chrome) -> click(sepia)', () => {
          beforeEach(() => {
            filter.value = 'chrome';
            chrome.click(); 
            filter.value = 'sepia';
            sepia.click(); 
          });

          it('применить фильтр «sepia»', () => {
            expect(preview.classList.contains('filter-sepia')).to.be.ok;
          });

          it('не должно остаться фильтра «chrome»', () => {
            expect(preview.classList.contains('filter-chrome')).to.not.be.ok;
          });

          it('класс «image-preview» должен остаться', () => {
            expect(preview.classList.contains('filter-image-preview')).to.be.ok;
          });
        });
      });

      context('изменение масштаба', () => {
        var decBtn, incBtn, scale;
        var preview;

        var getTransform = (preview) => {
          return (
            preview.style.transform.replace(/\s+/g, '')
          );
        };

        beforeEach(() => {
          decBtn = qs('.upload-resize-controls-button-dec');
          incBtn = qs('.upload-resize-controls-button-inc');
          scale = qs('.upload-resize-controls-value');
          preview = qs('.filter-image-preview');
        });

        it('значение по умолчанию «100%»', () => {
          expect(scale.value).to.eq('100%');
        });

        context('+', () => {
          beforeEach(() => { incBtn.click(); });
          it('значение не вырастет больше 100%', () => {
            expect(scale.value).to.eq('100%');
          });

          it('картинка будет показана один к одному', () => {
            expect(getTransform(preview)).to.be.oneOf(['', 'scale(1)']);
          });
        });

        context('-, -', () => {
          beforeEach(() => {
            decBtn.click();
            decBtn.click();
          });

          it('значение уменьшится до 50%', () => {
            expect(scale.value).to.eq('50%');
          });

          it('картинка будет показана уменьшенной в два раза', () => {
            expect(getTransform(preview)).to.eq('scale(0.5)');
          });
        });

        context('-, -, +', () => {
          beforeEach(() => {
            decBtn.click();
            decBtn.click();
            incBtn.click();
          });

          it('значение уменьшится до 75%', () => {
            expect(scale.value).to.eq('75%');
          });

          it('картинка будет показана в масштабе 0.75', () => {
            expect(getTransform(preview)).to.eq('scale(0.75)');
          });
        });

        context('-, -, -, -', () => {
          beforeEach(() => {
            for(var i = 0; i < 4; ++i) {
              decBtn.click();              
            }
          });

          it('значение уменьшится до 25%, но не дальше', () => {
            expect(scale.value).to.eq('25%');
          });

          it('картинка будет показана уменьшенной в четыре раза', () => {
            expect(getTransform(preview)).to.eq('scale(0.25)');
          });
        });
      });
    });
  });    
});