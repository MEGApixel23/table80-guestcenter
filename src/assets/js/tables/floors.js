$(document).ready(function () {
  const $floorsItems = $('#floors-items');
  const $activeFloor = $('#active-floor');
  const $newFloorName = $('#new-floor-name');
  const $optionsItems = $('#options-items');

  const insertNewFloor = function (floor) {
    const $item = $(
      '<a class="dropdown-item" href="javascript:void(0);" data-floor-uid="' + floor.uid + '">' +
        '<span data-floor-name>' + floor.name + '</span>' +
        '<span class="fa fa-pencil edit-icon" data-edit-floor-menu="' + floor.uid + '"></span>' +
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
      uid: FloorsCollection.generateUid(),
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
    $('[data-rename-floor]').attr('data-rename-floor', uid);

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

  $(document).on('click', '[data-copy-floor]', function () {
    const uid = $(this).attr('data-copy-floor');
    const newUid = FloorsCollection.generateUid();

    ReactiveShapeCollection.cloneInStorage(uid, newUid);

    const cloned = FloorsCollection.getFromStorage(newUid);
    console.log(newUid, cloned);

    insertNewFloor(cloned);
    selectActiveFloor(cloned.uid);
  });

  (function () {
    const $input = $('#new-floor-name');
    $(document).on('click', '[data-rename-floor]', function (e) {
      const uid = $(this).attr('data-rename-floor');
      const floor = FloorsCollection.getFromStorage(uid);

      e.preventDefault();
      e.stopPropagation();

      $input.val(floor.name);
      toggleEditMode('rename');
    });

    $('#rename-floor').click(function () {
      const uid = $('[data-rename-floor]').attr('data-rename-floor');
      const newName = $input.val();
      const floor = FloorsCollection.getFromStorage(uid);
      const activeFloorUid = FloorsCollection.getActiveUid();

      if (!floor) {
        return;
      }

      floor.name = newName;
      FloorsCollection.addToStorage(floor);
      toggleEditMode('add');
      $input.val('');

      if (activeFloorUid === uid) {
        selectActiveFloor(uid);
      }

      $('[data-floor-uid="' + uid + '"] [data-floor-name]').text(newName);
    });
  })();


  selectActiveFloor(FloorsCollection.getActiveUid());
  toggleEditMode('add');
});