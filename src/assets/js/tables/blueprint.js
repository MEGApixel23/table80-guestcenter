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

  const openPropertiesMenu = function (s) {
    $('#table-name').val(s.name);
    $('#table-type').val(s.meta.type);
    $('#table-min-party').val(s.meta.minParty);
    $('#table-max-party').val(s.meta.maxParty);
    $('#properties-table').removeAttr('hidden');
  };

  const closePropertiesMenu = function () {
    $('#properties-table').attr('hidden', 'hidden');
  };

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
        openPropertiesMenu(s);
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
      openPropertiesMenu(reactiveShape);
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
          s.meta.type = type;
        });
      ReactiveShapeCollection.saveToStorage(floorUid);
    });

    $('#table-min-party').keyup(function () {
      const minParty = $(this).val();

      ReactiveShapeCollection.getActive()
        .map(function (s) {
          s.meta.minParty = minParty;
        });
      ReactiveShapeCollection.saveToStorage(floorUid);
    });

    $('#table-max-party').change(function () {
      const maxParty = $(this).val();

      ReactiveShapeCollection.getActive()
        .map(function (s) {
          s.meta.maxParty = maxParty;
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
        const top = s.pos.top;
        const left = s.pos.left;

        reactiveShape.height = s.height;
        reactiveShape.width = s.width;
        reactiveShape.angle = s.angle;

        if (s.pos.top + s.height > $blueprintContainer.height()) {
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

  // Import
  (function () {
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
  })();
});