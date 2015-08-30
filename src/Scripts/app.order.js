var app = angular.module('orderApp', []);

app.factory('orderFactory', function ($http) {
    return {
        getCartItems: function () {
            return $http.get(_BASE_URL + 'cart/items?id=' + _LOCAL_CART_VALUE);
        },
        removeItemFromCart: function (item) {
            return $http.post(_BASE_URL + 'cart/deleteitem?id=' + item.CartItemId);
        },
        clearCart: function () {
            return $http.post(_BASE_URL + 'cart/clear/' + _LOCAL_CART_VALUE);
        }
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

    $scope.clearCart = function () {
        orderFactory.clearCart().success(successCallback).error(errorCallback);
    };
});

$(document).ready(function () {

    jQuery.validator.setDefaults({
        //debug: true,
        success: "valid",
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });

    var $validator = $("#commentForm").validate({
        rules: {
            emailfield: {
                required: true,
                email: true,
                minlength: 3
            },
            namefield: {
                required: true,
                minlength: 3
            },
            urlfield: {
                required: true,
                minlength: 3,
                url: true
            }
        }
    });

    $('#rootwizard').bootstrapWizard({
        //Options: nav-divider nav-stacked nav-tabs nav-pills
        'nextSelector': '.button-next',
        'previousSelector': '.button-previous',
        'tabClass': 'nav nav-tabs',
        'onNext': function (tab, navigation, index) {
            var $valid = $("#commentForm").valid();
            if (!$valid) {
                $validator.focusInvalid();
                return false;
            }
            else {
                $('#shipFirstName').val($('#firstName').val());
                $('#shipLastName').val($('#lastName').val());
                $('#shipAddress').val($('#address').val());
                $('#shipCity').val($('#city').val());
                $('#shipEmail').val($('#email').val());
                $('#shipState').val($('#state').val());
                $('#shipProvince').val($('#province').val());
            }
        }
    });
});


