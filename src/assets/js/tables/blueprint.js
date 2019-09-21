$(document).ready(function () {
  const $blueprint = $('#blueprint');

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
      '<div data-uid="' + uid + '" class="shape--inserted">' +
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
        drag: function (e, d) {
          reactiveShape.pos.top = d.position.top;
          reactiveShape.pos.left = d.position.left;
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

    $('body').on('mousedown', '.shape--inserted', function () {
      const uid = $(this).data('uid');
      const s = ReactiveShapeCollection.get(uid);

      ReactiveShapeCollection.deactivateAll();

      s.activate();
      openPropertiesMenu(s);
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
    let isInRotation = false;

    $(document).on('mouseover', '.ui-rotatable-handle', function () {
      if (!isInRotation) {
        $(this).closest('.shape--inserted').draggable('disable');
        isInRotation = true;
      }
    });

    $(document).on('mouseup', function () {
      if (isInRotation) {
        $('.shape--inserted').draggable('enable');
        isInRotation = false;
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
      ReactiveShapeCollection.getActive().map(function (s) {
        const $clonedShape = $(s.getNode()).clone();
        const shape = $clonedShape.get()[0];
        const reactiveShape = new ReactiveShape(shape);

        reactiveShape.angle = s.angle;
        reactiveShape.pos.top = s.pos.top + s.height;
        reactiveShape.pos.left = s.pos.left || 20;
        console.log(s.height, s.pos.top);

        insertShape(reactiveShape);
        ReactiveShapeCollection.deactivateAll().add(reactiveShape.uid, reactiveShape);
        reactiveShape.activate().move();
      });
    });
  })();
});