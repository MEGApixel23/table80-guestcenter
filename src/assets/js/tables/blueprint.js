$(document).ready(function () {
  let isInDraggingMode = false;
  let isInRotationMode = false;

  const $blueprint = $('#blueprint');
  const $blueprintContainer = $('#blueprint-container');
  const $body = $('body');
  const shapeClass = 'shape--inserted';
  const shapeSelector = '.shape--inserted';

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
    const uid = reactiveShape.generateUid();
    const $shapeContainer = $(
      '<div data-uid="' + uid + '" class="' + shapeClass + '">' +
        '<div class="shape-text"></div>' +
      '</div>'
    );

    reactiveShape.uid = uid;
    $blueprint.append($shapeContainer);
    $shapeContainer.append(reactiveShape.getNode())
      .draggable({
        containment: '.workspace',
        grid: [5, 5],
        cursor: 'grabbing',
        drag: function (e, d) {
          isInDraggingMode = true;

          if (!reactiveShape.isActive) {
            reactiveShape.activate();
          }

          const originalTop = reactiveShape.pos.top;
          const originalLeft = reactiveShape.pos.left;

          reactiveShape.pos.top = d.position.top;
          reactiveShape.pos.left = d.position.left;

          const deltaTop = reactiveShape.pos.top - originalTop;
          const deltaLeft = reactiveShape.pos.left - originalLeft;

          ReactiveShapeCollection.getActive()
            .map(function (s) {
              if (e.target === s.getParentNode()) {
                return;
              }

              s.pos.top += deltaTop;
              s.pos.left += deltaLeft;
              s.move();
            });
        }
      })
      .rotatable({
        snap: true,
        snapStep: 22.5,
        angle: reactiveShape.angle,
        wheel: false,
        rotate: function (e, d) {
          reactiveShape.rotated(d.angle.current);
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
      reactiveShape.activate();
      openPropertiesMenu(reactiveShape);
      ReactiveShapeCollection
        .deactivateAll()
        .add(reactiveShape.uid, reactiveShape);
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
    });

    $('#table-type').change(function () {
      const type = $(this).val();

      ReactiveShapeCollection.getActive()
        .map(function (s) {
          s.meta.type = type;
        });
    });

    $('#table-min-party').keyup(function () {
      const minParty = $(this).val();

      ReactiveShapeCollection.getActive()
        .map(function (s) {
          s.meta.minParty = minParty;
        });
    });

    $('#table-max-party').change(function () {
      const maxParty = $(this).val();

      ReactiveShapeCollection.getActive()
        .map(function (s) {
          s.meta.maxParty = maxParty;
        });
    });

    $('#delete-table').click(function () {
      ReactiveShapeCollection.deleteActive();
      closePropertiesMenu();
    });

    $('#clone-table').click(function () {
      const cloned = [];

      ReactiveShapeCollection.getActive().map(function (s) {
        const $clonedShape = $(s.getNode()).clone();
        const shape = $clonedShape.get()[0];
        const reactiveShape = new ReactiveShape(shape);

        reactiveShape.angle = s.angle;
        reactiveShape.pos.top = s.pos.top + s.height;
        reactiveShape.pos.left = s.pos.left || 20;

        insertShape(reactiveShape);
        ReactiveShapeCollection.add(reactiveShape.uid, reactiveShape);

        cloned.push(reactiveShape);
      });

      ReactiveShapeCollection.deactivateAll();
      cloned.map(function (s) {
        s.activate().move();
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
});