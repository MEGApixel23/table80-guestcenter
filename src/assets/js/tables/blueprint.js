$(document).ready(function () {
  const $blueprint = $('#blueprint');

  // Select handing
  (function () {
    attachSelectableArea($blueprint.get()[0]);

    $('body').on('mousedown', '.shape--inserted', function (e) {
      const uid = $(this).data('uid');

      ReactiveShapeCollection.deactivateAll()
        .activate(uid);
    });
  })();

  // Drag handing
  (function () {
    // Allows to catch click events on SVG <object>
    $('[data-insert-shape] object').css('pointer-events', 'none');

    $('[data-insert-shape]').click(function () {
      const uid = +new Date() + '' + Math.random();
      const $shapeContainer = $('<div data-uid="' + uid + '" class="shape--inserted"></div>');
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
          wheel: false
        });

      ReactiveShapeCollection
        .deactivateAll()
        .add(uid, new ReactiveShape($shape.get()[0]).activate());
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
});