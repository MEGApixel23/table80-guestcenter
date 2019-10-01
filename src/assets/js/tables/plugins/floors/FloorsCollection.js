function FloorsCollection () {}

FloorsCollection.mainFloorId = '1';
FloorsCollection.generateUid = function () {
  return +new Date() + '.' + Math.round(Math.random() * 1000);
};

FloorsCollection.getFromStorage = function (uid) {
  const data = localStorage.getItem('floors');

  if (data) {
    const floors = JSON.parse(data);

    if (floors && floors.length) {
      return uid ? floors.find(function (f) { return f.uid === uid; }) : floors;
    }
  }

  FloorsCollection.addToStorage({ uid: FloorsCollection.mainFloorId, name: 'Main' });

  return FloorsCollection.getFromStorage(uid);
};

FloorsCollection.saveToStorage = function (floor) {
  const data = localStorage.getItem('floors');
  const uid = floor.uid;
  const floors = data ? JSON.parse(data) : [];

  for (let i = 0; i < floors.length; i++) {
    if (floors[i].uid === uid) {
      floors[i] = floor;
      break;
    }
  }

  localStorage.setItem('floors', JSON.stringify(floors));
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
    console.log('Updated', floor.uid);
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
  localStorage.setItem('activeFloorUid', JSON.stringify(uid));
};

FloorsCollection.getActiveUid = function () {
  return JSON.parse(localStorage.getItem('activeFloorUid')) || FloorsCollection.mainFloorId;
};

FloorsCollection.getActive = function () {
  const activeUid = FloorsCollection.getActiveUid();
  const floors = FloorsCollection.getFromStorage();
  const activeFloor = floors.find(function (floor) {
    return floor.uid === activeUid;
  });

  return activeFloor || floors[0];
};
