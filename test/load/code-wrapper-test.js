var expect = require('chai').expect;

var CodeWrapper = require('../..').CodeWrapper;

describe('CodeWrapper', function() {
  var wrapper;

  var createEmptyWrapper = function() {
    wrapper = new CodeWrapper();
  };

  var createNonEmptyWrapper = function() {
    wrapper = new CodeWrapper({variables: ['hello', 'goodbye']});
  };

  var createWrapperSetOriginalWindowName = function() {
    wrapper = new CodeWrapper({variables: ['hello', 'goodbye'], window: 'fooBar'});
  };

  context('#preamble', function() {
    context('without parameters', function() {
      beforeEach(createEmptyWrapper);

      it('should return empty string', function() {
        expect(wrapper.preamble()).to.eq('');
      });
    });

    context('with some variables in options', function() {
      beforeEach(createNonEmptyWrapper);

      it('should return non-empty string', function() {
        expect(wrapper.preamble()).to.not.eq('');
      });

      it('should include `var ` part', function() {
        expect(wrapper.preamble()).to.include('var ');
      });

      it('should include each variable name', function() {
        var preamble = wrapper.preamble();
        expect(preamble).to.include('hello');
        expect(preamble).to.include('goodbye');
      });

      it('should hide window value', function() {
        var preamble = wrapper.preamble();
        expect(preamble).to.include(' = window;');
      });
    });

    context('with custom original window name', function() {
      beforeEach(createWrapperSetOriginalWindowName);

      it('should return non-empty string', function() {
        expect(wrapper.preamble()).to.not.eq('');
      });

      it('should hide window value', function() {
        var preamble = wrapper.preamble();
        expect(preamble).to.include(' = window;');
      });

      it('should save original window into variable with specified name', function() {
        var preamble = wrapper.preamble();
        expect(preamble).to.include('var fooBar = window;');
      });
    });
  });

  context('#afterword', function() {
    context('without parameters', function() {
      beforeEach(createEmptyWrapper);

      it('should return empty string', function() {
        expect(wrapper.afterword()).to.eq('');
      });
    });

    context('with some variables in options', function() {
      beforeEach(createNonEmptyWrapper);

      it('should store values as hash', function() {
        var afterword = wrapper.afterword();

        expect(afterword).to.include('hello: window.hello || hello');
        expect(afterword).to.include('goodbye: window.goodbye || goodbye');
      });

      it('should assign this hash to window property', function() {
        var afterword = wrapper.afterword();

        expect(afterword).to.include('.result = {');
      });
    });

    context('with custom original window name', function() {
      beforeEach(createWrapperSetOriginalWindowName);

      it('should return non-empty string', function() {
        expect(wrapper.afterword()).to.not.eq('');
      });

      it('should hide window value', function() {
        var afterword = wrapper.afterword();
        expect(afterword).to.include('fooBar.result = {');
      });
    });
  });
});
