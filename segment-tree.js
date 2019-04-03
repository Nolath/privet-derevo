function emptyTree() {
  return 0;
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
  if (Array.isArray(array[0][0])) {
    array = array.map(function(subarray) {
      return subarray.map(function(subarray) {
        return segmentTree(subarray, fn, 0);
      });
    });
    array = array.map(function(subarray) {
      return segmentTree(subarray, treeCombiner(fn), emptyTree);
    });
    return segmentTree(array, treeCombiner((t1, t2) => {return treeCombiner(fn)(t1, t2)}), () => emptyTree);
  }
  else if (Array.isArray(array[0])) {
    array = array.map(function(subarray) {
      return segmentTree(subarray, fn, 0);
    });
    return segmentTree(array, treeCombiner(fn), emptyTree);
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

function minOfArray(array) {
  let min = +Infinity;
  for (let i = 0; i < array.length; i++) if (array[i] < min) min = array[i];
  return min;
}

function assignEqually(tree, wishes, stash, elves, gems, week) {
  let result = {};
  let gemsCount = [];
  for (let i = 0; i < elves.length; i++) {
    let temp = tree(i, i + 1)(0, gems.length)(0, week);
    gemsCount.push(temp);
  }
  for (gem in stash) {
    for (let i = 0; i < stash[gem]; i++) {
      let min = minOfArray(gemsCount);
      let minIndex = gemsCount.indexOf(min);
      gemsCount[minIndex]++;
      if (result[elves[minIndex]] == undefined) result[elves[minIndex]] = {};
      if (result[elves[minIndex]][gem] == undefined) result[elves[minIndex]][gem] = 0;
      result[elves[minIndex]][gem]++;
    }
  }
  return result;
}

function assignAtLeastOne(tree, wishes, stash, elves, gems, week) {
  let result = {};
  let gemsCount = [];
  for (let i = 0; i < elves.length; i++) {
    let temp = tree(i, i + 1)(0, gems.length)(week, week);
    gemsCount.push(temp);
  }
  for (gem in stash) {
    for (let i = 0; i < stash[gem]; i++) {
      let min = minOfArray(gemsCount);
      let minIndex = gemsCount.indexOf(min);
      gemsCount[minIndex]++;
      if (result[elves[minIndex]] == undefined) result[elves[minIndex]] = {};
      if (result[elves[minIndex]][gem] == undefined) result[elves[minIndex]][gem] = 0;
      result[elves[minIndex]][gem]++;
    }
  }
  return result;
}

function assignPreferredGems(tree, wishes, stash, elves, gems) {
  let result = {};
  let elvesWishes = [];
  for (gem in stash) {
    elvesWishes = elves.map(elf => wishes[elves.indexOf(elf)][gems.indexOf(gem)])
    elvesWishes = elvesWishes.map(x => 1 - x);
    let min = minOfArray(elvesWishes);
    let minIndex = elvesWishes.indexOf(min);
    if (result[elves[minIndex]] == undefined) result[elves[minIndex]] = {};
    if (result[elves[minIndex]][gem] == undefined) result[elves[minIndex]][gem] = 0;
    result[elves[minIndex]][gem] += stash[gem];
  }
  return result;
}

function nextState(state, assignment, elves, gems) {
  for (let e = 0; e < state.length; e++) {
    for (let g = 0; g < state[e].length; g++) {
      if (elves[e] in assignment && gems[g] in assignment[elves[e]]) state[e][g].push(assignment[elves[e]][gems[g]]);
      else state[e][g].push(0);
    }
  }
  return state;
}
