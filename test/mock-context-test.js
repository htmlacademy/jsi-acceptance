// test/mock-context-test.js

var expect = require('chai').expect;
var MockContext = require('..').MockContext;

var Canvas2dMethods = [
  // Rectangles methods
  'clearRect', 'fillRect', 'strokeRect',

  // Drawing text methods
  'fillText', 'strokeText', 'measureText',

  // Paths methods
  'beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'ellipse', 'rect',
  'bezierCurveTo',

  // Drawing paths methods
  'fill', 'stroke', 'clip', 'isPointInPath', 'isPointInStroke',

  // Transform methods
  'rotate', 'scale', 'transform', 'setTransform', 'resetTransform',

  // Image methods
  'drawImage',

  // Canvas state methods
  'save', 'restore'
];

describe('MockContext', function() {
  var ctx;

  beforeEach(function() {
    ctx = new MockContext();
  });

  it('should be ok', function() {
    expect(ctx).to.be.ok;
  });

  Canvas2dMethods.forEach(function(method) {
    it('should respond to ' + method, function() {
      expect(ctx).to.respondTo(method);
    });
  });

  context('after called some methods', function() {
    beforeEach(function() {
      ctx.beginPath();
      ctx.rect(0, 0, 100, 100);
      ctx.closePath();
    });

    it('should report that methods have been called', function() {
      expect(ctx.hasCalled('beginPath')).to.be.ok;
      expect(ctx.hasCalled('rect')).to.be.ok;
      expect(ctx.hasCalled('closePath')).to.be.ok;
    });

    it('should report arguments', function() {
      expect(ctx.hasCalled('beginPath').with()).to.be.ok;
      expect(ctx.hasCalled('rect').with(0, 0, 100, 100)).to.be.ok;
    });

    it('should report arguments to callback', function() {
      expect(ctx.hasCalled('rect').with(function(x, y, width, height) {
        return width === 100 && height === 100;
      })).to.be.ok;
    });

    it('should report sequence', function() {
      expect(ctx.hasSequence('beginPath', 'closePath')).to.be.ok;
    });

    it('should not report sequence for same call', function() {
      expect(ctx.hasSequence('beginPath', 'beginPath')).to.not.be.ok;
    });

    it('should not report sequence for wrong order', function() {
      expect(ctx.hasSequence('closePath', 'beginPath')).to.not.be.ok;
    });
  });
});
