$(document).ready(function () {
  let isInDraggingMode = false;
  let isInRotationMode = false;
  let floorUid = 1;

  const $blueprint = $('#blueprint');
  const $blueprintContainer = $('#blueprint-container');
  const $body = $('body');
  const shapeClass = 'shape--inserted';
  const shapeSelector = '.shape--inserted';

  // Initial scaling of grid
  scaleGrid($blueprintContainer);

  const insertShape = function (reactiveShape) {
    const uid = reactiveShape.uid || reactiveShape.generateUid();
    const $shapeContainer = $(
      '<div data-uid="' + uid + '" class="' + shapeClass + '">' +
        '<div class="shape-text"></div>' +
      '</div>'
    );

    reactiveShape.uid = uid;
    $blueprint.append($shapeContainer);
    $shapeContainer.append(reactiveShape.getNode())
      .draggable({
        containment: 'parent',
        grid: [5, 5],
        cursor: 'grabbing',
        drag: function (event, ui) {
          isInDraggingMode = true;
          calculateDraggingPosition(reactiveShape, event, ui);
          ReactiveShapeCollection.saveToStorage(floorUid, reactiveShape);
        }
      })
      .rotatable({
        snap: true,
        snapStep: 22.5,
        angle: reactiveShape.angle,
        wheel: false,
        rotate: function (e, d) {
          reactiveShape.rotated(d.angle.current);
          ReactiveShapeCollection.saveToStorage(floorUid, reactiveShape);
        }
      });
  };

  // Import
  const importShapes = function () {
    ReactiveShapeCollection.collection = [];
    $blueprint.html('');

    const shapesData = ReactiveShapeCollection.getFromStorage(floorUid);

    Object.keys(shapesData).map(function (uid) {
      const item = shapesData[uid];
      const reactiveShape = ReactiveShape.import(item);

      insertShape(reactiveShape);
      reactiveShape.setName(reactiveShape.name)
        .rotated(reactiveShape.angle)
        .activate()
        .move();
      ReactiveShapeCollection.add(reactiveShape.uid, reactiveShape);
    });

    ReactiveShapeCollection.deactivateAll();
  };

  $(document).on('activeFloorChanged', function (e, uid) {
    floorUid = uid;
    importShapes();
  });

  $(document).on('shapeActivated', function () {
    const activeShapes = ReactiveShapeCollection.getActive();

    if (activeShapes.length === 1) {
      openPropertiesMenu(activeShapes[0]);
    } else if (activeShapes.length > 1) {
      openPropertiesMenu(activeShapes[0], true);
    } else {
      closePropertiesMenu();
    }
  });

  // Select handing
  (function () {
    attachSelectableArea($blueprint.get()[0], {
      onMoving: function (d, $el) {
        ReactiveShapeCollection.iterate(function (s) {
          if (areOverlapping($el, s.getParentNodeJquery())) {
            s.activate();
          }
        });
      }
    });

    $body.on('mouseup', shapeSelector, function () {
      if (isInDraggingMode) {
        isInDraggingMode = false;
      } else {
        const uid = $(this).data('uid');
        const s = ReactiveShapeCollection.get(uid);

        ReactiveShapeCollection.deactivateAll();

        s.activate();
      }
    });

    // If clicked outside of shape and inside a grid deselects all active shapes
    $blueprintContainer.on('mousedown', function (e) {
      const $el = $(e.target);

      if ($el.hasClass(shapeClass) === false && $el.closest(shapeSelector).length === 0) {
        ReactiveShapeCollection.deactivateAll();
        closePropertiesMenu();
      }
    });
  })();

  // Drag handing
  (function () {
    let row = [];
    const insertShapeThumb = function (quantityInRow, $container) {
      return function (s, i, list) {
        row.push(
          $(
            '<div class="dinner-table--wrapper" data-insert-shape>' +
            '<object data="' + s.link + '" ' +
            'type="image/svg+xml" ' +
            (s.w ? 'data-initial-w="' + s.w + '" ' : '') +
            (s.h ? 'data-initial-h="' + s.h + '" ' : '') +
            '></object>' +
            '</div>'
          )
        );

        if ((i !== 0 && (i + 1) % quantityInRow === 0) || list.length === (i + 1)) {
          const $row = $('<div class="elements-row"></div>');

          row.map(function ($item) {
            $row.append($item);
          });

          $container.append($row);
          row = [];
        }
      };
    };

    window.shapesList.map(insertShapeThumb(3, $('#vertical-elements')));
    window.shapesList.map(insertShapeThumb(7, $('#horizontal-elements')));

    // Allows to catch click events on SVG <object>
    $('[data-insert-shape] object').css('pointer-events', 'none');

    $('[data-insert-shape]').click(function () {
      const $shape = $(this).find('object').clone();
      const reactiveShape = new ReactiveShape($shape.get()[0]);

      insertShape(reactiveShape);
      reactiveShape
        .setPos(25, 25)
        .move()
        .activate();
      ReactiveShapeCollection
        .deactivateAll()
        .add(reactiveShape.uid, reactiveShape)
        .saveToStorage(floorUid);
    });
  })();

  // Rotation handing
  (function () {
    $(document).on('mouseover', '.ui-rotatable-handle', function () {
      if (!isInRotationMode) {
        $(this).closest(shapeSelector).draggable('disable');
        isInRotationMode = true;
      }
    });

    $(document).on('mouseup', function () {
      if (isInRotationMode) {
        $(shapeSelector).draggable('enable');
        isInRotationMode = false;
      }
    });
  })();

  // Edit
  (function () {
    $('#table-name').keyup(function () {
      const name = $(this).val();

      ReactiveShapeCollection.getActive()
        .map(function (s) {
          s.setName(name);
        });
      ReactiveShapeCollection.saveToStorage(floorUid);
    });

    $('#table-type').change(function () {
      const type = $(this).val();

      ReactiveShapeCollection.getActive()
        .map(function (s) {
          s.type = type;
        });
      ReactiveShapeCollection.saveToStorage(floorUid);
    });

    $('#table-min-party').change(function () {
      const minParty = $(this).val();

      ReactiveShapeCollection.getActive()
        .map(function (s) {
          s.minParty = minParty;
        });
      ReactiveShapeCollection.saveToStorage(floorUid);
    });

    $('#table-max-party').change(function () {
      const maxParty = $(this).val();

      ReactiveShapeCollection.getActive()
        .map(function (s) {
          s.maxParty = maxParty;
        });
      ReactiveShapeCollection.saveToStorage(floorUid);
    });

    $('#delete-table').click(function () {
      ReactiveShapeCollection.deleteActive();
      ReactiveShapeCollection.saveToStorage(floorUid);
      closePropertiesMenu();
    });

    $('#clone-table').click(function () {
      const cloned = [];
      let direction = 'bottom';

      ReactiveShapeCollection.getActive().map(function (s) {
        const $clonedShape = $(s.getNode()).clone();
        const shape = $clonedShape.get()[0];
        const reactiveShape = new ReactiveShape(shape);
        const top = s.top;
        const left = s.left;

        reactiveShape.height = s.height;
        reactiveShape.width = s.width;
        reactiveShape.angle = s.angle;

        if (s.top + s.height > $blueprintContainer.height()) {
          direction = 'top';
        }

        insertShape(reactiveShape);
        ReactiveShapeCollection.add(reactiveShape.uid, reactiveShape);

        cloned.push([reactiveShape, top, left]);
      });

      ReactiveShapeCollection.deactivateAll();
      cloned.map(function (item) {
        const reactiveShape = item[0];
        let top = item[1];
        let left = item[2];

        if (direction === 'bottom') {
          top += reactiveShape.height;
        } else if (direction === 'top') {
          top -= reactiveShape.height;
        }

        reactiveShape.activate().setPos(top, left).move();
      });
    });
  })();

  // Resize handling
  (function () {
    $blueprintContainer.resizable({
      handles: 'se',
      grid: [20, 20],
      minHeight: 140,
      minWidth: 140
    });
  })();

  // Zoom
  (function () {
    $('[data-zoom-control]').click(function () {
      const zoomStep = 10;
      const defaultZoom = 100;
      const direction = parseInt($(this).attr('data-zoom-control'));
      const currZoom = parseInt($blueprint.attr('data-curr-zoom'));
      const nextZoom = direction === 0 ? defaultZoom : currZoom + (zoomStep * direction);
      const ratio = nextZoom / defaultZoom;
      const relationalRation = defaultZoom / currZoom;

      if (nextZoom < zoomStep) {
        return;
      }

      ReactiveShapeCollection.iterate(function (s) {
        const originalW = relationalRation * s.width;
        const originalH = relationalRation * s.height;
        const originalTop = relationalRation * s.top;
        const originalLeft = relationalRation * s.left;
        const newW = originalW * ratio;
        const newH = originalH * ratio;
        const newTop = originalTop * ratio;
        const newLeft = originalLeft * ratio;

        s.resize(newW, newH).setPos(newTop, newLeft).move();
      });

      $blueprint.attr('data-curr-zoom', nextZoom);
      ReactiveShapeCollection.saveToStorage(floorUid);
    });
  })();

  importShapes();
});