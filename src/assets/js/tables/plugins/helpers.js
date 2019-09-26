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

  const originalTop = reactiveShape.top;
  const originalLeft = reactiveShape.left;
  const deltaTop = ui.position.top - originalTop;
  const deltaLeft = ui.position.left - originalLeft;
  const activeReactiveShapes = ReactiveShapeCollection.getActive();

  for (let i = 0; i < activeReactiveShapes.length; i++) {
    const reactiveShape = activeReactiveShapes[i];

    if (e.target === reactiveShape.getParentNode()) {
      continue;
    }

    const newTop = reactiveShape.top + deltaTop;
    const newLeft = reactiveShape.left + deltaLeft;

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
    ui.position.top = reactiveShape.top;
    ui.position.left = reactiveShape.left;

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

const scaleGrid = function ($blueprintContainer) {
  const padding = 2;
  const sidePadding = 20;
  const gridStep = 20;
  const $container = $('.floor--wrapper');
  const width = $container.width();
  const height = $container.height() - $container.offset().top;
  const sidebarWidth = $('.workspace-sidebar').width();
  const $propsEl = $('#properties-table');
  const propertiesWidth = $propsEl.width();
  const propertiesMargin = parseInt($propsEl.css('margin-left'));
  const availableWidth = width - sidebarWidth - propertiesWidth - propertiesMargin - sidePadding * 2 - gridStep;

  $blueprintContainer.width(availableWidth - availableWidth % gridStep)
    .height(height - height % gridStep + padding)
    .removeClass('loading');
};

const cloneObj = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

const openPropertiesMenu = function (s, shortVersion) {
  const $tableName = $('#table-name');
  const $tableType = $('#table-type');
  const $tableMinParty = $('#table-min-party');
  const $tableMaxParty = $('#table-max-party');

  if (shortVersion) {
    $tableName.closest('.form-group').hide();
    $tableMinParty.closest('.form-group').hide();
    $tableMaxParty.closest('.form-group').hide();
  } else {
    $tableName.closest('.form-group').show();
    $tableMinParty.closest('.form-group').show();
    $tableMaxParty.closest('.form-group').show();
    $tableName.val(s.name);
    $tableMinParty.val(s.minParty);
    $tableMaxParty.val(s.maxParty);
  }

  $tableType.val(s.type);

  $('#properties-table').removeAttr('hidden');
};

const closePropertiesMenu = function () {
  $('#properties-table').attr('hidden', 'hidden');
};

const toggleEditMode = function (mode) {
  const $addNewFloorButton = $('#add-new-floor');
  const $renameFloorButton = $('#rename-floor');

  if (mode === 'add') {
    $addNewFloorButton.show();
    $renameFloorButton.hide();
  } else {
    $addNewFloorButton.hide();
    $renameFloorButton.show();
  }
};
