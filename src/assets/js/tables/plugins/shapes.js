function ReactiveShape (svg) {
  const linkAttr = 'xlink:href';

  this.loaded = new Promise(function (res) {
    svg.onload = function () {
      res();
    }
  })

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
  }

  this.forEachImage = function (cb) {
    this.loaded.then(function () {
      const images = svg.contentDocument.getElementsByTagName('image');

      for (let i = 0; i < images.length; i++) {
        cb(images[i]);
      }
    });
  }
}

const collection = {};

function ReactiveShapeCollection () {}

ReactiveShapeCollection.add = function (id, reactiveShape) {
  collection[id] = reactiveShape;

  return this;
};

ReactiveShapeCollection.get = function (id) {
  return collection[id];
};

ReactiveShapeCollection.deactivateAll = function () {
  Object.keys(collection).map(function (id) {
    ReactiveShapeCollection.get(id).deactivate();
  });

  return this;
}
