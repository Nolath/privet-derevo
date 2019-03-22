function dummySegmentTree(array, fn, N) {
  return function (from, to) {
    let result = N;

    for (let i = from; i < to; i++) {
      result = fn(result, array[i]);
    }

    return result;
  }
}

function segmentTree(array, fn, N) {
  return function (from, to) {
    if (from < 0 || to > array.length) throw new Error("Индекс за пределами границ массива")
    if (from > to) throw new Error("Поданы некорректные индексы")
    let result = N;
    for (let i = from; i < to; i++) {
      result = fn(result, array[i]);
    }
    return result;
  }
}

function recursiveSegmentTree(array, fn, N) {
  return function (from, to) {
    if (from < 0 || to > array.length) throw new Error("Индекс за пределами границ массива")
    if (from > to) throw new Error("Поданы некорректные индексы")
    for (let i = from; i < to; i++) {
      if (typeof array[i] == "object") return recursiveSegmentTree(array[i], fn, N);
    }
    let result = N;
    for (let i = from; i < to; i++) {
      result = fn(result, array[i]);
    }
    return result;
  }
}

function getElfTree(array) {
  return recursiveSegmentTree(array, sum, 0);
}

function assignEqually(tree, wishes, stash, elves, gems, week) {
  return {};
}

function assignAtLeastOne(tree, wishes, stash, elves, gems, week) {
  return {};
}

function assignPreferredGems(tree, wishes, stash, elves, gems) {
  return {};
}

function nextState(state, assignment, elves, gems) {
  return state;
}
