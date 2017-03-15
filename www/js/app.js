// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services']);

app.constant("DB_CONFIG", {
    name: "WCFIDB",
    tables: [{
            name: "user_info",
            columns: [{
                name: "username",
                type: "text primary key"
            }, {
                name: "name",
                type: "text"
            }, {
                name: "password",
                type: "text"
            }, {
                name: "role",
                type: "text"
            }, {
                name: "phoneNo",
                type: "text"
            }, {
                name: "specialization",
                type: "text"
            }]
        },
        {
            name: "request_info5",
            columns: [{
                name: "id",
                type: "text"
            }, {
                name: "provider",
                type: "text"
            }, {
                name: "consumer",
                type: "text"
            }, {
                name: "type",
                type: "text"
            }, {
                name: "fees",
                type: "integer default 0"
            }, {
                name: "paid",
                type: "integer default 0"
            }, {
                name: "received",
                type: "integer default 0"
            }, {
                name: "status",
                type: "text"
            }, {
                name: "dateTime",
                type: "text"
            }, {
                name: "comments",
                type: "text"
            }]
        }
    ]
});

app.run(function($ionicPlatform, DB, DBFactory) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        DB.init();
    });
});

app.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            }
        })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chat-detail.html',
                    controller: 'ChatDetailCtrl'
                }
            }
        })

    .state('tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-account.html',
                    controller: 'AccountCtrl'
                }
            }
        })
        .state('tab.services', {
            url: '/services',
            views: {
                'tab-services': {
                    templateUrl: 'templates/tab-services.html',
                    controller: 'ServicesCtrl'
                }
            }
        })
        .state('tab.conrequests', {
            url: '/conrequests',
            views: {
                'tab-conrequests': {
                    templateUrl: 'templates/tab-conrequests.html',
                    controller: 'ConRequestsCtrl'
                }
            }
        })
        .state('tab.alerts', {
            url: '/alerts',
            views: {
                'tab-alerts': {
                    templateUrl: 'templates/tab-alerts.html',
                    controller: 'AlertsCtrl'
                }
            }
        })
        .state('tab.prorequests', {
            url: '/prorequests',
            views: {
                'tab-prorequests': {
                    templateUrl: 'templates/tab-prorequests.html',
                    controller: 'ProRequestsCtrl'
                }
            }
        })
        .state('tab.pronewservice', {
            url: '/pronewservice',
            views: {
                'tab-pronewservice': {
                    templateUrl: 'templates/tab-pronewservice.html',
                    controller: 'AlertsCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

});

app.factory("DB", function($q, DB_CONFIG) {
    var self = this;
    self.db = null;
    self.init = function() {
        self.db = window.openDatabase(DB_CONFIG.name, "1.0", "database", 655367);
        angular.forEach(DB_CONFIG.tables, function(table) {
            var columns = [];
            angular.forEach(table.columns, function(column) {
                columns.push(column.name + ' ' + column.type);
            });
            var query = "CREATE TABLE IF NOT EXISTS " + table.name + " (" + columns.join(",") + ")";
            var test = self.query(query);
        });
    };

    self.query = function(query, bindings) {
        console.log("DB.query: " + query);
        bindings = typeof bindings !== "undefined" ? bindings : [];
        var deferred = $q.defer();
        self.db.transaction(function(transaction) {
            transaction.executeSql(query, bindings, function(transaction, result) {
                deferred.resolve(result);
            }, function(transaction, error) {
                console.log("query: " + query + "error: " + error.code + ", " + error.message);
                deferred.reject(error);
            });
        });
        return deferred.promise;
    };

    self.fetchAll = function(result) {
        var output = [];
        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        return output;
    };

    self.fetch = function(result) {
        var output = null;
        if (result.rows.length == 1) {
            output = angular.copy(result.rows.item(0));
        }
        return output;
    };

    return self;
});

app.factory("DBFactory", function($q, DB) {
    var self = this;
    self.addUser = function(userData) {
        var deferred = $q.defer();
        var promises = [];
        var username = userData.username;
        var name = userData.name;
        var password = userData.password;
        var role = userData.role;
        var phoneNo = userData.phoneNo;
        var specialization = userData.specialization;

        promises.push(DB.query("INSERT INTO user_info (username, name, password, role, phoneNo, specialization) VALUES ('" + username + "', '" + name + "', '" + password + "', '" + role + "', '" + phoneNo + "', '" + specialization + "')"));
        $q.all(promises).then(function() {
            deferred.resolve(true);
        });
        return deferred.promise;
    };

    self.allUsers = function() {
        return DB.query("SELECT * FROM user_info")
            .then(function(result) {
                return DB.fetchAll(result);
            });
    };

    self.allProviders = function() {
        return DB.query("SELECT * FROM user_info where role='Provider'")
            .then(function(result) {
                return DB.fetchAll(result);
            });
    };

    self.listProviders = function(specialization) {
        return DB.query("SELECT * FROM user_info where specialization='" + specialization + "'")
            .then(function(result) {
                return DB.fetchAll(result);
            });
    };

    self.getUser = function(username) {
        return DB.query("SELECT username, password, name, role, phoneNo, specialization FROM user_info WHERE username = '" + username + "'")
            .then(function(result) {
                return DB.fetch(result);
            });
    };

    self.addRequest = function(requestData) {
        var deferred = $q.defer();
        var promises = [];
        var id = new Date().getUTCMilliseconds();
        promises.push(DB.query("INSERT INTO request_info5 (id, provider, consumer, type, dateTime, comments, status) VALUES ('" + id + "', '" + requestData.provider + "', '" + requestData.consumer + "', '" + requestData.type + "', '" + requestData.dateTime + "', '" + requestData.comments + "', 'new')"));
        $q.all(promises).then(function() {
            deferred.resolve(true);
        });
        return deferred.promise;
    };

    self.listConRequests = function(consumer) {
        return DB.query("SELECT * FROM request_info5 where consumer='" + consumer + "'")
            .then(function(result) {
                return DB.fetchAll(result);
            });
    };

    self.listProRequests = function(provider) {
        return DB.query("SELECT * FROM request_info5 where provider='" + provider + "'")
            .then(function(result) {
                return DB.fetchAll(result);
            });
    };

    return self;
});