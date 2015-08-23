var app = angular.module('orderApp', []);

app.factory('orderFactory', function ($http) {
    return {
        getCartItems: function () {
            return $http.get(_BASE_URL + 'cart/items?id=' + _LOCAL_CART_VALUE);
        },
        removeItemFromCart: function (item) {
            return $http.post(_BASE_URL + 'cart/deleteitem?id=' + item.CartItemId);
        },
    };
});

app.factory('notificationFactory', function () {

    return {
        success: function (message) {
            toastr.success(message);
        },
        error: function (text) {
            toastr.error(text, "Error Happened.");
        }
    };
});

app.controller('orderCtrl', function ($scope, $http, orderFactory, notificationFactory) {
    var url = _BASE_URL + 'cart/items?id=' + _LOCAL_CART_VALUE
    //$http.get("http://www.w3schools.com/angular/customers.php")
    $http.get(url)

    .success(function (response) {
        $scope.cartItems = response;
    });

    var getCartItemsSuccessCallback = function (data, status) {
        $scope.cartItems = data;
    };
    var successCallback = function (data, status, headers, config) {
        notificationFactory.success(data.Message);
        
        setCartTotals(_LOCAL_CART_VALUE);

        return orderFactory.getCartItems().success(getCartItemsSuccessCallback).error(errorCallback);
    };

    var errorCallback = function (data, status, headers, config) {
        notificationFactory.error(data.Message);
    };

    $scope.removeItemFromCart = function (item) {
        orderFactory.removeItemFromCart(item).success(successCallback).error(errorCallback);
    };
});