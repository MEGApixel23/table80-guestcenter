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