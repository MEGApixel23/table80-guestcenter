function FloorsCollection () {}

FloorsCollection.mainFloorId = '1';

FloorsCollection.getFromStorage = function () {
  const data = localStorage.getItem('floors');

  if (data) {
    const floors = JSON.parse(data);

    if (floors && floors.length) {
      return floors;
    }
  }

  FloorsCollection.addToStorage({ uid: FloorsCollection.mainFloorId, name: 'Main' });

  return FloorsCollection.getFromStorage();
};

FloorsCollection.addToStorage = function (floor) {
  let data = [];
  let isUpdated = false;
  const floors = localStorage.getItem('floors');

  if (floors) {
    data = JSON.parse(floors);
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i].uid === floor.uid) {
      data[i] = floor;
      isUpdated = true;
      break;
    }
  }

  if (isUpdated === false) {
    data.push(floor);
  }

  localStorage.setItem('floors', JSON.stringify(data));
};

FloorsCollection.removeFromStorage = function (uid) {
  const floors = FloorsCollection.getFromStorage().filter(function (floor) {
    return floor.uid !== uid;
  });

  localStorage.setItem('floors', JSON.stringify(floors));
};

FloorsCollection.setActiveUid = function (uid) {
  localStorage.setItem('activeFloorUid', uid);
};

FloorsCollection.getActiveUid = function () {
  return localStorage.getItem('activeFloorUid');
};

FloorsCollection.getActive = function () {
  const activeUid = FloorsCollection.getActiveUid();
  const floors = FloorsCollection.getFromStorage();
  const activeFloor = floors.find(function (floor) {
    return floor.uid === activeUid;
  });

  return activeFloor || floors[0];
};

