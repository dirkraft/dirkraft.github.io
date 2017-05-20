angular.module('StackTraceDiffer', ['LocalStorageModule'])
.config(function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('stack_trace_differ');
})
.controller('RootCtrl', function ($scope, $filter, localStorageService) {
  const minStackSize = 5;

  localStorageService.bind($scope, 'stackTracesRaw');
  localStorageService.bind($scope, 'frameFilter');
  localStorageService.bind($scope, 'stackFilter');

  const vm = this;
  vm.stackTraces = [];
  vm.parseStacks = parseStacks;
  vm.stackGroups = [];

  $('.menu .item').tab();

  function parseStacks() {
    vm.stackTraces = [];

    let framePattern = /^[\w\d.]+\([\w\d. :]+\)$/;
    let lines = $scope.stackTracesRaw.split("\n");
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

    buildStackGroups();
  }

  function buildStackGroups() {
    let commonFrames = [];
    let remainingStackTraces = $filter('filter')(vm.stackTraces, $scope.filter);
    while (remainingStackTraces.length) {
      let frame = '';
      commonFrames.push();
      ++idx;
    }
  }
});