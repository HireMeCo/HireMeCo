// this is the guy that controller everything on the front end
angular.module('hiremeApp',
     [ // all the dependencies
    'ui.bootstrap',
    'ngAnimate',
    'ngTouch',
    'ngRoute',
    'LoginModule',
    'RegisterModule',
    'AuthServiceApp',
    'JobModule',
    'JobServiceApp',
    'ui.sortable'
])

// set local routes
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/pages/home.html'
        })
        .when('/login', {
            templateUrl: 'views/pages/login.html',
            controller: 'LoginCtrl'
        })
        .when('/logout', {
            controller: 'LogoutCtrl'
        })
        .when('/register', {
            templateUrl: 'views/pages/register.html',
            controller: 'RegisterCtrl'
        })
        .when('/about', {
            templateUrl: 'views/pages/about.html'
        })
		.when('/contact', {
            templateUrl: 'views/pages/contact.html',
            access: {restricted: false}
        })
        .when('/employerDashboard', {
            templateUrl: 'views/pages/employerDashboard.html'
        })
        .when('/postjob', {
            templateUrl: 'views/pages/postjob.html',
            controller: 'JobCtrl'
        })
        .when('/viewjobs', {
            templateUrl: 'views/pages/viewjobs.html',
             controller: 'ViewJobsCtrl',
        })
        .when('/viewposts', {
            templateUrl: 'views/pages/viewposts.html',
            controller: 'EmployerCtrl'
        })
        .when('/jobdetails', {
            templateUrl: 'views/pages/jobdetails.html',
            controller: 'ViewJobsCtrl'
        })
        .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true);
}])

// set up the navigation (contextual based on if you're logged in and who is logged in)
.controller('navigationController', ['$scope', '$rootScope',
    function ($scope, $rootScope, $location, AuthService) {

    //initialize variables
    $rootScope.isLoggedIn = false;
    $rootScope.firstname = " ";

    $scope.updateNav = function() {
        if($rootScope.isLoggedIn){
            // nav items for an employer
            if($rootScope.accountType == "employer"){
                $scope. = "Company: " + $rootScope.firstname;
                $scope.navItems = [
                { name: "View Posted Jobs", path: "/viewposts" },
                { name: "Edit Profile", path: "/profile" },
                { name: "Post A Job", path: "/postjob"}
                ];
            }
            // nav items for a job-seeker
            else{
                $scope.greeting = "Welcome, " + $rootScope.firstname;
                $scope.navItems = [
                    { name: "View Matches", path: "/viewjobs" },
                    { name: "Profile", path: "/profile" }
                ];
            }
        }

        // default nav items
        $scope.globalNav = [
            { name: "About", path: "/about"},
            { name: "Contact", path: "/contact"}
        ];
    };

    $scope.updateNav();

    $scope.navHeadName = "Home";

}])

// redirects to login screen if attempting to access restricted page
.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (next.access.restricted && AuthService.isLoggedIn() === false) {
      $location.path('/login');
      $route.reload();
    }
  });
})

;

!function (a, b, c) { "use strict"; b.module("ui.sortable", []).value("uiSortableConfig", {}).directive("uiSortable", ["uiSortableConfig", "$timeout", "$log", function (a, d, e) { return { require: "?ngModel", scope: { ngModel: "=", uiSortable: "=" }, link: function (f, g, h, i) { function j(a, b) { return b && "function" == typeof b?function () { a.apply(this, arguments), b.apply(this, arguments) }:a } function k(a) { var b = a.data("ui-sortable"); return b && "object" == typeof b && "ui-sortable" === b.widgetFullName?b:null } function l(a, b) { var c = a.sortable("option", "helper"); return "clone" === c || "function" == typeof c && b.item.sortable.isCustomHelperUsed() } function m(a) { return /left|right/.test(a.css("float")) || /inline|table-cell/.test(a.css("display")) } function n(a, b) { for (var c = null, d = 0; d < a.length; d++) { var e = a[d]; if (e.element[0] === b[0]) { c = e.scope; break } } return c } function o(a, b) { b.item.sortable._destroy() } var p, q = {}, r = { "ui-floating": c }, s = { receive: null, remove: null, start: null, stop: null, update: null }, t = { helper: null }; return b.extend(q, r, a, f.uiSortable), b.element.fn && b.element.fn.jquery?(i?(f.$watch("ngModel.length", function () { d(function () { k(g) && g.sortable("refresh") }, 0, !1) }), s.start = function (a, d) { if ("auto" === q["ui-floating"]) { var e = d.item.siblings(), f = k(b.element(a.target)); f.floating = m(e) } d.item.sortable = { model: i.$modelValue[d.item.index()], index: d.item.index(), source: d.item.parent(), sourceModel: i.$modelValue, cancel: function () { d.item.sortable._isCanceled = !0 }, isCanceled: function () { return d.item.sortable._isCanceled }, isCustomHelperUsed: function () { return !!d.item.sortable._isCustomHelperUsed }, _isCanceled: !1, _isCustomHelperUsed: d.item.sortable._isCustomHelperUsed, _destroy: function () { b.forEach(d.item.sortable, function (a, b) { d.item.sortable[b] = c }) } } }, s.activate = function (a, c) { p = g.contents(); var d = g.sortable("option", "placeholder"); if (d && d.element && "function" == typeof d.element) { var e = d.element(); e = b.element(e); var h = g.find('[class="' + e.attr("class") + '"]:not([ng-repeat], [data-ng-repeat])'); p = p.not(h) } var i = c.item.sortable._connectedSortables || []; i.push({ element: g, scope: f }), c.item.sortable._connectedSortables = i }, s.update = function (a, b) { if (!b.item.sortable.received) { b.item.sortable.dropindex = b.item.index(); var c = b.item.parent(); b.item.sortable.droptarget = c; var d = n(b.item.sortable._connectedSortables, c); b.item.sortable.droptargetModel = d.ngModel, g.sortable("cancel") } l(g, b) && !b.item.sortable.received && "parent" === g.sortable("option", "appendTo") && (p = p.not(p.last())), p.appendTo(g), b.item.sortable.received && (p = null), b.item.sortable.received && !b.item.sortable.isCanceled() && f.$apply(function () { i.$modelValue.splice(b.item.sortable.dropindex, 0, b.item.sortable.moved) }) }, s.stop = function (a, b) { !b.item.sortable.received && "dropindex" in b.item.sortable && !b.item.sortable.isCanceled()?f.$apply(function () { i.$modelValue.splice(b.item.sortable.dropindex, 0, i.$modelValue.splice(b.item.sortable.index, 1)[0]) }):"dropindex" in b.item.sortable && !b.item.sortable.isCanceled() || l(g, b) || p.appendTo(g), p = null }, s.receive = function (a, b) { b.item.sortable.received = !0 }, s.remove = function (a, b) { "dropindex" in b.item.sortable || (g.sortable("cancel"), b.item.sortable.cancel()), b.item.sortable.isCanceled() || f.$apply(function () { b.item.sortable.moved = i.$modelValue.splice(b.item.sortable.index, 1)[0] }) }, t.helper = function (a) { return a && "function" == typeof a?function (b, c) { var d = a.apply(this, arguments); return c.sortable._isCustomHelperUsed = c !== d, d }:a }, f.$watch("uiSortable", function (a) { var c = k(g); c && b.forEach(a, function (a, b) { return b in r?("ui-floating" !== b || a !== !1 && a !== !0 || (c.floating = a), void (q[b] = a)):(s[b]?("stop" === b && (a = j(a, function () { f.$apply() }), a = j(a, o)), a = j(s[b], a)):t[b] && (a = t[b](a)), q[b] = a, void g.sortable("option", b, a)) }) }, !0), b.forEach(s, function (a, b) { q[b] = j(a, q[b]), "stop" === b && (q[b] = j(q[b], o)) })):e.info("ui.sortable: ngModel not provided!", g), void g.sortable(q)):void e.error("ui.sortable: jQuery should be included before AngularJS!") } } }]) }(window, window.angular);

