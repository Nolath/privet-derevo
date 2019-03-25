function dummySegmentTree(array, fn, N) {
  return function (from, to) {
    let result = N;
    for (let i = from; i < to; i++) result = fn(result, array[i]);
    return result;
  }
}

function treeBuild(array, fn) {
  let t = Array(array.length * 4);
  if (array.length == 0) return t;
  function build(v, left, right) {
    if (left == right) t[v] = array[left];
    else {
      let mid = Math.floor((left + right) / 2);
      build(v * 2, left, mid);
      build(v * 2 + 1, mid + 1, right);
      t[v] = fn(t[v * 2], t[v * 2 + 1]);
    }
  }
  build(1, 0, array.length - 1);
  return t;
}

function segmentTree(array, fn, N) {
  let t = treeBuild(array, fn);
  function evaluate(v, left, right, from, to) {
    if (from < 0 || to > array.length) throw new Error("Индекс за пределами границ массива")
    if (from > to) return N;
    if (left == from && right == to) return t[v];
    let mid = Math.floor((left + right) / 2);
    return fn(
      evaluate(v * 2, left, mid, from, Math.min(mid, to)),
      evaluate(v * 2 + 1, mid + 1, right, Math.max(from, mid + 1), to)
    )
  }
  return function(from, to) {
    if (from > to) throw new Error("Неверные индексы");
    return evaluate(1, 0, array.length - 1, from, to - 1);
  }
}

function recursiveSegmentTree(array, fn, N) {
  if (Array.isArray(array[0])) {
    let newArray = array.map(x => recursiveSegmentTree(x, fn, N));
    return segmentTree(newArray, treeCombiner(fn), () => {return 0});
  }
  else return segmentTree(array, fn, N)
}

function treeCombiner(fn) {
  return function(treeOne, treeTwo) {
    return function(from, to) {
      return fn(treeOne(from, to), treeTwo(from, to));
    }
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
