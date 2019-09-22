const areOverlapping = function ($div1, $div2) {
  // Div 1 data
  const d1_offset = $div1.offset();
  const d1_height = $div1.outerHeight(true);
  const d1_width = $div1.outerWidth(true);
  const d1_distance_from_top = d1_offset.top + d1_height;
  const d1_distance_from_left = d1_offset.left + d1_width;

  // Div 2 data
  const d2_offset = $div2.offset();
  const d2_height = $div2.outerHeight(true);
  const d2_width = $div2.outerWidth(true);
  const d2_distance_from_top = d2_offset.top + d2_height;
  const d2_distance_from_left = d2_offset.left + d2_width;

  const not_colliding = (
    d1_distance_from_top < d2_offset.top || d1_offset.top > d2_distance_from_top ||
    d1_distance_from_left < d2_offset.left || d1_offset.left > d2_distance_from_left
  );

  return !not_colliding;
};

const calculateDraggingPosition = function (reactiveShape, e, ui) {
  const $blueprintContainer = $('#blueprint-container');
  let isOutsideBoundaries = false;
  const shapesToMove = [];
  const minLeft = 25;
  const minTop = 25;
  const gridStep = 20;
  const maxRight = $blueprintContainer.width();
  const maxBottom = $blueprintContainer.height();

  if (!reactiveShape.isActive) {
    reactiveShape.activate();
  }

  const originalTop = reactiveShape.pos.top;
  const originalLeft = reactiveShape.pos.left;
  const deltaTop = ui.position.top - originalTop;
  const deltaLeft = ui.position.left - originalLeft;
  const activeReactiveShapes = ReactiveShapeCollection.getActive();

  for (let i = 0; i < activeReactiveShapes.length; i++) {
    const reactiveShape = activeReactiveShapes[i];

    if (e.target === reactiveShape.getParentNode()) {
      continue;
    }

    const newTop = reactiveShape.pos.top + deltaTop;
    const newLeft = reactiveShape.pos.left + deltaLeft;

    if (
      newTop < minTop || newLeft < minLeft || (newTop + reactiveShape.height - gridStep) > maxBottom ||
      (newLeft + reactiveShape.width - gridStep) > maxRight
    ) {
      isOutsideBoundaries = true;
      break;
    }

    shapesToMove.push([reactiveShape, newTop, newLeft]);
  }

  // Reverts a position of dragged node to original if other shapes are out of boundaries.
  if (isOutsideBoundaries) {
    ui.position.top = reactiveShape.pos.top;
    ui.position.left = reactiveShape.pos.left;

    return;
  }

  reactiveShape.setPos(ui.position.top, ui.position.left);
  shapesToMove.map(function (item) {
    const reactiveShape = item[0];
    const newTop = item[1];
    const newLeft = item[2];

    reactiveShape.setPos(newTop, newLeft).move();
  });
};
