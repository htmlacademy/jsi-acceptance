// lib/mock-context.js

/**
 * Class to mock canvas2d context
 */

var mockObject = require('./utils/mock-object');

var MockContext = module.exports = function() {
  this.charWidth = 10;
  mockObject(this, {
    stubs: [
      // Rectangles methods
      'clearRect', 'fillRect', 'strokeRect',

      // Drawing text methods
      'fillText', 'strokeText', 'measureText',

      // Paths methods
      'beginPath', 'closePath', 'moveTo', 'lineTo', 'arc', 'ellipse', 'rect',

      // Drawing paths methods
      'fill', 'stroke', 'clip', 'isPointInPath', 'isPointInStroke',

      // Transform methods
      'rotate', 'scale', 'transform', 'setTransform', 'resetTransform',

      // Image methods
      'drawImage',

      // Canvas state methods
      'save', 'restore'
    ],
    mocks: {
      measureText: function(text) {
        return text.length * this.charWidth;
      }
    }
  });
};
