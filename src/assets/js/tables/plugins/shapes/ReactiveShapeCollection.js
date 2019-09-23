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
  let data = {};
  const key = 'floor.' + floorUid;

  if (shape) {
    data = ReactiveShapeCollection.getFromStorage(floorUid);
    data[shape.uid] = shape.export();
  } else {
    ReactiveShapeCollection.iterate(function (s) {
      data[s.uid] = s.export();
    });
  }

  if (Object.keys(data).length === 0) {
    localStorage.removeItem(key);

    return;
  }

  localStorage.setItem(key, JSON.stringify(data));
};

ReactiveShapeCollection.getFromStorage = function (floorUid) {
  const data = localStorage.getItem('floor.' + floorUid);

  return JSON.parse(data) || {};
};