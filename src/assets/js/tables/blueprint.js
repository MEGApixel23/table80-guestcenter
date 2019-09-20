$(document).ready(function () {
  const startWidth = 51;
  const $blueprint = $('#blueprint');

  // Select handing
  attachSelectable($blueprint.get()[0]);

  // Drag handing
  $('[data-insert-shape]')
    .each(function () {
      // Allows to catch click events on SVG objects
      $(this).find('object').css('pointer-events', 'none');
    })
    .click(function () {
      const $shapeContainer = $('<div class="shape--inserted"></div>');
      const $shape = $(this).find('object').clone()
        .attr('width', startWidth)
        .attr('height', startWidth);

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
    });

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
  })()
});