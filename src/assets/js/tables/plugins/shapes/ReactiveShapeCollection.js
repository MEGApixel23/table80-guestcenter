function ReactiveShapeCollection () {}

ReactiveShapeCollection.collection = {};

ReactiveShapeCollection.add = function (uid, reactiveShape) {
  ReactiveShapeCollection.collection[uid] = reactiveShape;
  reactiveShape.uid = uid;

  return this;
};

ReactiveShapeCollection.get = function (uid) {
  return ReactiveShapeCollection.collection[uid];
};

ReactiveShapeCollection.deactivateAll = function () {
  Object.keys(ReactiveShapeCollection.collection)
    .map(function (uid) {
      ReactiveShapeCollection.get(uid).deactivate();
    });

  return this;
}

ReactiveShapeCollection.activate = function (uid) {
  ReactiveShapeCollection.get(uid).activate();

  return this;
};

ReactiveShapeCollection.getActive = function () {
  const res = [];

  Object.keys(ReactiveShapeCollection.collection)
    .map(function (uid) {
      const s = ReactiveShapeCollection.get(uid);

      if (s.isActive) {
        res.push(s);
      }
    });

  return res;
};

ReactiveShapeCollection.deleteActive = function () {
  const active = ReactiveShapeCollection.getActive();

  active.map(function (s) {
    s.delete();

    delete ReactiveShapeCollection.collection[s.uid];
  });
};

ReactiveShapeCollection.iterate = function (cb) {
  Object.keys(ReactiveShapeCollection.collection)
    .map(function (uid) {
      cb(ReactiveShapeCollection.get(uid));
    });
};

ReactiveShapeCollection.saveToStorage = function (floorUid, shape) {
  let tables = {};

  if (shape) {
    tables = ReactiveShapeCollection.getFromStorage(floorUid);
    tables[shape.uid] = shape.export();
  } else {
    // If no shape provided export all
    ReactiveShapeCollection.iterate(function (s) {
      tables[s.uid] = s.export();
    });
  }

  const floor = FloorsCollection.getFromStorage(floorUid + '');

  floor.tables = tables;
  FloorsCollection.saveToStorage(floor);
};

ReactiveShapeCollection.getFromStorage = function (floorUid) {
  const floor = FloorsCollection.getFromStorage(floorUid + '');

  return floor && floor.tables || {};
};

ReactiveShapeCollection.cloneInStorage = function (sourceFloorId, destSourceId) {
  const source = FloorsCollection.getFromStorage(sourceFloorId);

  if (!source) {
    return false;
  }

  const clone = cloneObj(source);
  const tables = {};

  clone.name = clone.name + ' (copy)';
  clone.uid = destSourceId;

  if (clone.tables && typeof clone.tables === 'object') {
    const uids = Object.keys(clone.tables);

    for (let i = 0; i < uids.length; i++) {
      const currTable = clone.tables[uids[i]];

      currTable.uid = +new Date() + '' + Math.random();
      tables[currTable.uid] = currTable;
    }
  }

  clone.tables = tables;
  FloorsCollection.addToStorage(clone);
};