// TODO: Split Controller into app.cart-controller.js
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


    $http.get(url)
    .success(function (response) {
        $scope.cartItems = response;
        setTotals();
    });

    $http.get(_BASE_URL + 'data/get/states')
    .success(function (response) {
        $scope.states = response;
    });

    $http.get(_BASE_URL + 'data/get/countries')
    .success(function (response) {
        $scope.countries = response;
    });



    var getCartItemsSuccessCallback = function (data, status) {
        $scope.cartItems = data;
        setTotals();
    };

    var successCallback = function (data, status, headers, config) {
        notificationFactory.success(data.Message);
        
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

    function setTotals() {
        var count = 0;
        var total = 0;

        angular.forEach($scope.cartItems, function (value, index) {
            count++;
            total = total + value.Price;
        })


        $scope.totalItems = count;
        $scope.totalPrice = total;
       // $('hdnTotalPrice').val(total);
    }
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
        'finishSelector': '.button-next',
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

    $('#finish').click(function () {
        var data = {
            CartId: _LOCAL_CART_VALUE,
            SiteId: 21,
            OrderCost: $('#totalPrice').val(),
            FirstName: $.trim($('#firstName').val()),
            LastName: $.trim($('#lastName').val()),
            Email: $.trim($('#email').val()),
            Address: $.trim($('#address').val()),
            City: $.trim($('#city').val()),
            State: $.trim($('#state').val()),
            Zip: $.trim($('#province').val()),
            Country: $.trim($('#country').val()),
            ShippingFirstName: $.trim($('#shipFirstName').val()),
            ShippingLastName: $.trim($('#shipAddress').val()),
            ShippingAddress: $.trim($('#shipCity').val()),
            ShippingCity: $.trim($('#shipState').val()),
            LastName: $.trim($('#shipProvince').val()),
            ShippingCountry: $.trim($('#shipCountry').val()),
            ShippingEmail: $.trim($('#shipEmail').val()),
        }

        postJsonData('order/save', data);
    });
});


