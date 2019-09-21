function ReactiveShape (svg) {
  const linkAttr = 'xlink:href';
  const defaultWidth = 51;
  const handleWidth = 50;

  this.loaded = new Promise(function (res) {
    svg.onload = function () {
      res();
    }
  });

  this.activate = function () {
    svg.parentNode.classList.add('active');

    this.loaded.then(function () {
      this.forEachImage(function (image) {
        const link = image.getAttribute(linkAttr);
        const activeLink = link.replace('.', '--active.');

        image.setAttribute(linkAttr, activeLink);
      });
    }.bind(this));

    return this;
  };

  this.deactivate = function () {
    svg.parentNode.classList.remove('active');

    this.loaded.then(function () {
      this.forEachImage(function (image) {
        const link = image.getAttribute(linkAttr);
        const activeLink = link.replace('--active.', '.');

        image.setAttribute(linkAttr, activeLink);
      });
    }.bind(this));
  };

  this.forEachImage = function (cb) {
    this.loaded.then(function () {
      const images = svg.contentDocument.getElementsByTagName('image');

      for (let i = 0; i < images.length; i++) {
        cb(images[i]);
      }
    });
  };

  this.resize = function (w, h) {
    const width = w || defaultWidth;
    const height = h || defaultWidth;
    const handle = svg.parentNode.getElementsByClassName('ui-rotatable-handle')[0];

    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    handle.style.left = (width - handleWidth) / 2 + 'px';

    return this;
  };

  this.resize(svg.getAttribute('data-initial-w'), svg.getAttribute('data-initial-h'));
}

const collection = {};

function ReactiveShapeCollection () {}

ReactiveShapeCollection.add = function (uid, reactiveShape) {
  collection[uid] = reactiveShape;

  return this;
};

ReactiveShapeCollection.get = function (uid) {
  return collection[uid];
};

ReactiveShapeCollection.deactivateAll = function () {
  Object.keys(collection).map(function (uid) {
    ReactiveShapeCollection.get(uid).deactivate();
  });

  return this;
}

ReactiveShapeCollection.activate = function (uid) {
  ReactiveShapeCollection.get(uid).activate();

  return this;
};
