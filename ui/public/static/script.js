const App = angular.module(`MainApp`, []);

App.controller(`MainCtrl`, ['$scope', function ($scope) {
  console.log($scope);

  $scope.users = [];



  $scope.sendTestEvent = function() {
    fetch(`http://localhost:3000/test`, {
      credentials: 'include', 
      method: `GET`, 
      headers: { 'Content-Type': 'application/json' }
    })
    .then(r => r.json())
    .then((response) => {
      console.log(response);
      M.toast({ html: response.message });
      $scope.$apply(() => {
        console.log($scope);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  };

  $scope.getAllUsers = function() {
    fetch(`http://localhost:3000/users`, {
      credentials: 'include', 
      method: `GET`, 
      headers: { 'Content-Type': 'application/json' }
    })
    .then(r => r.json())
    .then((response) => {
      console.log(response);
      $scope.users = response.data;
      $scope.$apply(() => {
        console.log($scope);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  };
  $scope.getAllUsers();

  $scope.sseErrored = false;
  $scope.startSSE = function() {
    const evtSource = new EventSource("http://localhost:3000/stream", {
      withCredentials: true,
    });
    $scope.evtSource = evtSource;

    evtSource.addEventListener("Success", (event) => {
      const data = JSON.parse(event.data);
      console.log(event, data);
      M.toast({ html: `Events online!` });
      $scope.sseErrored = false;
    });

    evtSource.addEventListener("MY_EVENT_PROCESSED", (event) => {
      const data = JSON.parse(event.data);
      console.log(event, data);
      M.toast({ html: data.message });
    });

    evtSource.addEventListener("MY_EVENT_ERRORED", (event) => {
      const data = JSON.parse(event.data);
      console.log(event, data);
      M.toast({ html: data.message });
    });

    evtSource.addEventListener('error', (event) => {
      console.log(event);
      if ($scope.sseErrored) {
        return;
      }
      $scope.sseErrored = true;
      M.toast({ html: `Lost events connection...` });
    });
  };
  $scope.startSSE();

  $scope.username_input = '';
  $scope.createUser = function() {
    fetch(`http://localhost:3000/users`, {
      credentials: 'include', 
      method: `POST`, 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ username: $scope.username_input }) 
    })
    .then(r => {
      console.log(r);
      const isError = r.status.toString().startsWith('4') || r.status.toString().startsWith('5');
      if (isError) {
        throw r.json();
      }
      return r.json();
    })
    .then((response) => {
      console.log(response);
      M.toast({ html: `New User Created!` });
      $scope.users.unshift(response.data);
      $scope.username_input = '';
      $scope.$apply(() => {
        console.log($scope);
      });
    })
    .catch((error) => {
      error?.then(data => {
        M.toast({ html: data.message });
      });
    });
  };

  $scope.editing_user_index = null;
  $scope.editing_username_input = '';

  $scope.setEditingUser = function(user, index) {
    console.log({ user, index });

    $scope.editing_user_index = $scope.editing_user_index === index ? null : index;
    $scope.editing_username_input = $scope.editing_username_input === user.username ? '' : user.username;
  };
  $scope.submitEdits = function() {
    fetch(`http://localhost:3000/users/${$scope.users[$scope.editing_user_index].id}`, {
      credentials: 'include', 
      method: `PUT`, 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ username: $scope.editing_username_input }) 
    })
    .then(r => {
      console.log(r);
      const isError = r.status.toString().startsWith('4') || r.status.toString().startsWith('5');
      if (isError) {
        throw r.json();
      }
      return r.json();
    })
    .then((response) => {
      console.log(response);
      M.toast({ html: `User Updated!` });
      $scope.users[$scope.editing_user_index] = response.data;
      $scope.editing_user_index = null;
      $scope.editing_username_input = '';
      $scope.$apply(() => {
        console.log($scope);
      });
    })
    .catch((error) => {
      error?.then(data => {
        M.toast({ html: data.message });
      });
    });
  };

  $scope.onEditKeyup = function() {
    // console.log(this, $scope);
  };

  $scope.deleteUser = function(index) {
    console.log({ index });
    fetch(`http://localhost:3000/users/${$scope.users[index].id}`, {
      credentials: 'include', 
      method: `DELETE`, 
      headers: { 'Content-Type': 'application/json' },
    })
    .then(r => {
      console.log(r);
      const isError = r.status.toString().startsWith('4') || r.status.toString().startsWith('5');
      if (isError) {
        throw r.json();
      }
      return r.json();
    })
    .then((response) => {
      console.log(response);
      M.toast({ html: `User Deleted!` });
      $scope.users.splice(index, 1);
      $scope.$apply(() => {
        console.log($scope);
      });
    })
    .catch((error) => {
      error?.then(data => {
        M.toast({ html: data.message });
      });
    });
  };

}]);