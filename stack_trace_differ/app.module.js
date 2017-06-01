angular.module('StackTraceDiffer', ['LocalStorageModule'])
.config(function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('stack_trace_differ');
})
.controller('RootCtrl', function ($scope, $filter, localStorageService) {
  const minStackSize = 5;

  localStorageService.bind($scope, 'stackFilter', '');
  localStorageService.bind($scope, 'lineFilter', '');
  localStorageService.bind($scope, 'minCount', 1);

  const vm = this;
  vm.stackTracesRaw = '';
  vm.stackTraces = [];
  vm.saveStackTracesRaw = saveStackTracesRaw;

  vm.stats = []; // each element is [line, count]
  vm.loadStats = loadStats;
  vm.refreshStats = refreshStats;

  vm.graph = []; // each element is {line, count, children: [ recurse ]}
  vm.loadTree = loadTree;

  init();


  function init() {
    let compressed = localStorageService.get('stackTracesRaw');
    vm.stackTracesRaw = LZString.decompress(compressed);
    $('.menu .item').tab();
  }

  function saveStackTracesRaw() {
    let compressed = LZString.compress(vm.stackTracesRaw);
    localStorageService.set('stackTracesRaw', compressed);
  }

  function loadStats() {
    parseStacks();
    refreshStats();
  }

  function loadTree() {
    parseStacks();
    refreshTree();
  }

  function parseStacks() {
    vm.stackTraces = [];

    let framePattern = /^[\w\d.]+\([\w\d. :]+\)$/;
    let lines = vm.stackTracesRaw.split("\n");
    let currentStackBuilder = [];

    function checkCompleteStack() {
      if (currentStackBuilder.length >= minStackSize) {
        vm.stackTraces.push(currentStackBuilder.reverse());
        currentStackBuilder = [];
      }
    }

    for (let line of lines) {
      if (line.match(framePattern)) {
        currentStackBuilder.push(line);
      } else {
        checkCompleteStack();
      }
    }
    checkCompleteStack();
    console.log('Parsed ' + vm.stackTraces.length + ' stacks.');
  }

  function refreshStats() {
    let stats = {}; // line -> count
    let filteredStackTraces = $filter('filter')(vm.stackTraces, $scope.stackFilter);
    for (let stackTrace of filteredStackTraces) {
      let filteredLines = $filter('filter')(stackTrace, $scope.lineFilter);
      for (let line of filteredLines) {
        line = line.trim();
        if (!stats[line]) {
          stats[line] = 0;
        }
        stats[line]++;
      }
    }
    vm.stats = _.orderBy(_.entries(stats), 1, 'desc');
    console.log("Refreshed stats: " + vm.stats.length);
  }

  function refreshTree() {
    let filteredStacks = _.map($filter('filter')(vm.stackTraces, $scope.stackFilter), function (st) {
      return $filter('filter')(st, $scope.lineFilter);
    });
    
    function buildBranch(parent, current) {
      // TODO
    }
  }
});