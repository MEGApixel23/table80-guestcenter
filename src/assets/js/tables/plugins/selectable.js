window.attachSelectable = function (element) {
  const selectable = new Selectable();

  element.onmousedown = function (e) {
    e.preventDefault();
    selectable.show()
      .setStart(e.clientX - 1, e.clientY - 1)
      .calculate();
  };

  element.onmousemove = selectable.getSelectionNode().onmousemove = function (e) {
    if (selectable.isActive()) {
      selectable.show()
        .setEnd(e.clientX - 1, e.clientY - 1)
        .calculate();
    }
  };

  document.body.onmouseup = selectable.hide;
}

function Selectable () {
  let x1 = null;
  let y1 = null;
  let x2 = null;
  let y2 = null;

  const node = $('<div></div>')
    .addClass('selection')
    .attr('hidden', 1)
    .get()[0];

  this.construct = function () {
    document.body.appendChild(node);

    return this;
  };

  this.setStart = function (x, y) {
    x1 = x;
    y1 = y;

    return this;
  }

  this.setEnd = function (x, y) {
    x2 = x;
    y2 = y;

    return this;
  }

  this.calculate = function () {
    if (x2 === null || y2 === null) {
      x2 = x1;
      y2 = y1;
    }

    const x3 = Math.min(x1, x2);
    const x4 = Math.max(x1, x2);
    const y3 = Math.min(y1, y2);
    const y4 = Math.max(y1, y2);

    node.style.left = x3 + 'px';
    node.style.top = y3 + 'px';
    node.style.width = x4 - x3 + 'px';
    node.style.height = y4 - y3 + 'px';

    return this;
  }

  this.hide = function () {
    if (node.hidden !== 1) {
      node.hidden = 1;
      x1 = null;
      x2 = null;
      y1 = null;
      y2 = null;
    }

    return this;
  }

  this.show = function () {
    if (node.hidden !== 0) {
      node.hidden = 0;
    }

    return this;
  }

  this.isActive = function () {
    return !node.hidden;
  };

  this.getSelectionNode = function () {
    return node;
  };

  this.construct();
}