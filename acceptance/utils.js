//
module.exports = (win, cb) => {

  const doc = win.document;

  const qs = doc.querySelector.bind(doc);
  const qsa = doc.querySelectorAll.bind(doc);

  const KeyboardEvent = win.KeyboardEvent;

  const fireKeyboardEvent = (target, type = 'keydown', key = 'Enter') => {
    const evt = new KeyboardEvent(type, { key });
    target.dispatchEvent(evt);
  };

  const fireKeyboardPress = (target, key = 'Enter') => {
    ['down', 'press', 'up'].forEach((t) => {
      fireKeyboardEvent(target, `key${t}`, key);
    });
  };

  if (typeof (cb) === 'function') {
    cb({
      doc,
      qs,
      qsa,
      fireKeyboardPress
    });
  }
};
