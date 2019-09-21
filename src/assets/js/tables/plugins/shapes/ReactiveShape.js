function ReactiveShape (svg) {
  const linkAttr = 'xlink:href';
  const defaultWidth = 51;
  const handleWidth = 50;

  this.uid = null;
  this.width = 0;
  this.height = 0;
  this.isActive = false;
  this.name = '';
  this.angle = 0;
  this.meta = {
    type: 0,
    minParty: 1,
    maxParty: 1,
  };

  this.loaded = new Promise(function (res) {
    svg.onload = function () {
      res();
    }
  });

  this.activate = function () {
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

    this.width = w || defaultWidth;
    this.height = h || defaultWidth;
    svg.setAttribute('width', this.width);
    svg.setAttribute('height', this.width);
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

  this.resize(svg.getAttribute('data-initial-w'), svg.getAttribute('data-initial-h'));
}
