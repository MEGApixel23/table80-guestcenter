function ReactiveShape (svg) {
  const linkAttr = 'xlink:href';
  const defaultWidth = 51;

  this.uid = null;
  this.width = 0;
  this.height = 0;
  this.isActive = false;
  this.name = '';
  this.angle = 0;
  this.type = 0;
  this.minParty = 1;
  this.maxParty = 1;
  this.isInitialized = false;
  this.top = 0;
  this.left = 0;

  this.loaded = new Promise(function (res) {
    svg.onload = function () {
      res();
    };
  });

  this.init = function () {
    this.resize(svg.getAttribute('data-initial-w'), svg.getAttribute('data-initial-h'));
    this.isInitialized = true;

    return this;
  };

  this.generateUid = function () {
    return +new Date() + '' + Math.random();
  };

  this.getNode = function () {
    return svg;
  };

  this.getParentNode = function () {
    if (!this.parentNode) {
      this.parentNode = svg.parentNode;
    }

    return this.parentNode;
  };

  this.getParentNodeJquery = function () {
    if (!this.parentNodeJquery) {
      this.parentNodeJquery = $(svg.parentNode);
    }

    return this.parentNodeJquery;
  };

  this.move = function () {
    svg.parentNode.style.top = this.top + 'px';
    svg.parentNode.style.left = this.left + 'px';

    return this;
  };

  this.activate = function () {
    if (!this.isInitialized) {
      this.init();
    }

    if (this.isActive) {
      return this;
    }

    svg.parentNode.classList.add('active');
    this.isActive = true;

    this.loaded.then(function () {
      this.forEachImage(function (image) {
        const link = image.getAttribute(linkAttr);
        const activeLink = link.replace('.', '--active.');

        image.setAttribute(linkAttr, activeLink);
      });

      $(document).trigger('shapeActivated', [this]);
    }.bind(this));

    return this;
  };

  this.deactivate = function () {
    if (!this.isActive) {
      return this;
    }

    svg.parentNode.classList.remove('active');
    this.isActive = false;

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
    const handle = svg.parentNode.getElementsByClassName('ui-rotatable-handle')[0];
    const handleWidth = handle.offsetWidth;

    this.width = parseInt(w) || defaultWidth;
    this.height = parseInt(h) || defaultWidth;
    svg.setAttribute('width', this.width);
    svg.setAttribute('height', this.height);
    handle.style.left = (this.width - handleWidth) / 2 + 'px';
    this.positionName();

    return this;
  };

  this.setName = function (name) {
    const el = this.getTextNode();

    this.name = name;
    el.innerText = name;
    this.positionName();

    return this;
  };

  this.positionName = function () {
    const el = this.getTextNode();

    el.style.width = this.width + 'px';
    el.style.top = this.height / 2 + 'px';
  };

  this.rotated = function (angle) {
    const el = this.getTextNode();

    this.angle = angle;
    el.style.transform = 'rotate(-' + angle + 'deg)';

    return this;
  };

  this.getTextNode = function () {
    return svg.parentNode.getElementsByClassName('shape-text')[0];
  };

  this.delete = function () {
    const parent = svg.parentNode;

    parent.parentNode.removeChild(parent);
  };

  this.setPos = function (top, left) {
    this.top = top;
    this.left = left;

    return this;
  };

  this.export = function () {
    const currZoom = parseInt($('#blueprint').attr('data-curr-zoom'));
    const relationalRation = 100 / currZoom;
    const originalW = relationalRation * this.width;
    const originalH = relationalRation * this.height;
    const originalTop = relationalRation * this.top;
    const originalLeft = relationalRation * this.left;

    return {
      uid: this.uid,
      w: originalW,
      h: originalH,
      name: this.name,
      angle: this.angle,
      type: this.type,
      minParty: this.minParty,
      maxParty: this.maxParty,
      top: originalTop,
      left: originalLeft,
      svgPath: svg.getAttribute('data')
    }
  };
}

ReactiveShape.import = function (item) {
  const $obj = $(
    '<object data="' + item.svgPath + '" ' +
      'type="image/svg+xml" ' +
      'data-initial-w="' + item.w + '" ' +
      'data-initial-h="' + item.h + '"' +
    '></object>'
  ).css('pointer-events', 'none');
  const shape = $obj.get()[0];
  const reactiveShape = new ReactiveShape(shape);

  reactiveShape.uid = item.uid;
  reactiveShape.top = item.top;
  reactiveShape.left = item.left;
  reactiveShape.height = item.h;
  reactiveShape.width = item.w;
  reactiveShape.angle = item.angle;
  reactiveShape.type = item.type;
  reactiveShape.minParty = item.minParty;
  reactiveShape.maxParty = item.maxParty;
  reactiveShape.name = item.name;

  return reactiveShape;
}