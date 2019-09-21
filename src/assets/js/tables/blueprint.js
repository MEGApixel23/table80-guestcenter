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

  // Select handing
  (function () {
    attachSelectableArea($blueprint.get()[0]);

    $('body').on('mousedown', '.shape--inserted', function (e) {
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
      const uid = +new Date() + '' + Math.random();
      const $shapeContainer = $(
        '<div data-uid="' + uid + '" class="shape--inserted">' +
          '<div class="shape-text"></div>' +
        '</div>'
      );
      const $shape = $(this).find('object').clone();

      $blueprint.append($shapeContainer);
      $shapeContainer.append($shape)
        .draggable({
          containment: 'parent',
          grid: [5, 5],
          cursor: 'grabbing'
        })
        .rotatable({
          snap: true,
          snapStep: 22.5,
          wheel: false,
          rotate: function (e, d) {
            reactiveShape.rotated(d.angle.current);
          }
        });

      const reactiveShape = new ReactiveShape($shape.get()[0])
        .activate();

      openPropertiesMenu(reactiveShape);
      ReactiveShapeCollection
        .deactivateAll()
        .add(uid, reactiveShape);
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
  })();
});