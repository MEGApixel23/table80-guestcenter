$(document).ready(function () {
  const $floorsItems = $('#floors-items');
  const $activeFloor = $('#active-floor');
  const $newFloorName = $('#new-floor-name');
  const $optionsItems = $('#options-items');

  const insertNewFloor = function (floor) {
    const $item = $(
      '<a class="dropdown-item" href="javascript:void(0);" data-floor-uid="' + floor.uid + '">' +
        floor.name +
        '<span class="fa fa-pencil" data-edit-floor-menu="' + floor.uid + '"></span>' +
      '</a>'
    );
    const $lastItem = $floorsItems.find('[data-floor-uid]').last();

    if ($lastItem.length > 0) {
      $lastItem.after($item);
    } else {
      $floorsItems.prepend($item);
    }
  };

  const selectActiveFloor = function (uid) {
    FloorsCollection.setActiveUid(uid);

    const floor = FloorsCollection.getActive();

    $activeFloor.text(floor.name);

    setTimeout(function () {
      $(document).trigger('activeFloorChanged', [uid]);
    });
  };

  const removeActiveFloor = function (uid) {
    if (uid === FloorsCollection.mainFloorId) {
      return false;
    }

    FloorsCollection.removeFromStorage(uid);
    selectActiveFloor(FloorsCollection.mainFloorId);

    $('[data-floor-uid="' + uid + '"]').remove();
  };

  // Initial import
  (function () {
    FloorsCollection.getFromStorage().map(insertNewFloor);
  })();

  $('#add-new-floor').click(function () {
    const name = $newFloorName.val();

    if (!name) {
      return false;
    }

    const floor = {
      uid: +new Date() + '.' + Math.round(Math.random() * 1000),
      name: name
    };

    FloorsCollection.addToStorage(floor);
    insertNewFloor(floor);
    $newFloorName.val('');
  });

  $(document).on('click', '[data-edit-floor-menu]', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const uid = $(this).attr('data-edit-floor-menu');

    $('[data-copy-floor]').attr('data-copy-floor', uid);
    $('[data-delete-floor]').attr('data-delete-floor', uid);

    $optionsItems.addClass('show');
  });

  $(document).on('click', function () {
    if ($optionsItems.hasClass('show')) {
      $optionsItems.removeClass('show');
    }
  });

  $(document).on('click', '[data-floor-uid]', function () {
    const uid = $(this).attr('data-floor-uid');

    selectActiveFloor(uid);
  });

  $(document).on('click', '[data-delete-floor]', function () {
    const uid = $(this).attr('data-delete-floor');

    removeActiveFloor(uid);
  });

  selectActiveFloor(FloorsCollection.getActiveUid());
});