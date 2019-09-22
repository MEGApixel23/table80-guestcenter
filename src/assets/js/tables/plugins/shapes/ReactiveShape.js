function ReactiveShape (svg) {
  const linkAttr = 'xlink:href';
  const defaultWidth = 51;

  this.uid = null;
  this.width = 0;
  this.height = 0;
  this.isActive = false;
  this.name = '';
  this.angle = 0;
  this.meta = {
    type: 0,
    minParty: 1,
    maxParty: 1
  };
  this.isInitialized = false;
  this.pos = {
    top: 0,
    left: 0
  };

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
    svg.parentNode.style.top = this.pos.top + 'px';
    svg.parentNode.style.left = this.pos.left + 'px';

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
    this.pos.top = top;
    this.pos.left = left;

    return this;
  }
}
