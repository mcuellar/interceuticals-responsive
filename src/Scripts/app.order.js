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
        },
        addToCart: function (data) {
            return $http.post(_BASE_URL + 'cart/save', data);
        },
        makeRequest: function (method, data) {
            return $http.post(_BASE_URL + method, data)
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

    var currentYear = new Date().getFullYear();
    var years = [];

    for (index = 0 ; index <= 15; index++) {
        years[index] = { label: currentYear, value: currentYear }
        currentYear += 1;
    }

    $scope.ccyears = years;
    $scope.selectedYears = $scope.ccyears[0];

    $http.get(url)
    .success(function (response) {
        $scope.cartItems = response;
        setTotals();
    });

    $http.get(_BASE_URL + 'data/get/states')
    .success(function (response) {
        $scope.states = response;
        $scope.selectedState = $scope.states[0];
        $scope.selecteShipState = $scope.states[0];
    });

    $http.get(_BASE_URL + 'data/get/countries')
    .success(function (response) {
        $scope.countries = response;
        $scope.selectedCountry = $scope.countries[0];
        $scope.selectedShipCountry = $scope.countries[0];
    });


    var getCartItemsSuccessCallback = function (data, status) {
        $scope.cartItems = data;
        setTotals();
    };

    var successCallback = function (data, status, headers, config) {
        notificationFactory.success(data.Message);
        
        return orderFactory.getCartItems().success(getCartItemsSuccessCallback).error(errorCallback);
    };

    var addToCartSuccessCallback = function (data, status, headers, config) {
        // Save Cart Id to Local Storage if not present
        setCartIdSession(data);

        toastr.success('<div>' + data.Message + '<a href="../order" class="btn btn-sm btn-warning">Checkout</a>' + '</div>');

        return orderFactory.getCartItems().success(getCartItemsSuccessCallback).error(errorCallback);
    }


    var errorCallback = function (data, status, headers, config) {
        notificationFactory.error(data.Message);
    };

    $scope.removeItemFromCart = function (item) {
        orderFactory.removeItemFromCart(item).success(successCallback).error(errorCallback);
    };

    $scope.makeRequest = function (method, data) {
        orderFactory.makeRequest(method, data).success().error(errorCallback);
    };

    $scope.clearCart = function () {
        orderFactory.clearCart().success(successCallback).error(errorCallback);
    };

    $scope.addToCart = function (data) {
        orderFactory.addToCart(data).success(addToCartSuccessCallback).error(errorCallback);
    };

    function setCartIdSession(data) {
        if (_LOCAL_CART_VALUE == 0) {
            localStorage.setItem(_LOCAL_CART_ID, data.Id);
            _LOCAL_CART_VALUE = data.Id;
        }
    }

    function setTotals() {
        var count = 0;
        var total = 0;

        angular.forEach($scope.cartItems, function (value, index) {
            count++;
            total = total + value.Price;
        })

        $scope.totalItems = count;
        $scope.totalPrice = total;
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

    var $validator = $("#checkoutForm").validate({
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
            var currentTab = tab;
            var $valid = $("#checkoutForm").valid();
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
        //onTabShow: function (tab, navigation, index) {
        //    var $total = navigation.find('li').length;
        //    var $current = index + 1;
        //    var $percent = ($current / $total) * 100;
        //    $('#rootwizard').find('.bar').css({ width: $percent + '%' });

        //    // If it's the last tab then hide the last button and show the finish instead
        //    if ($current >= $total) {
        //        $('#rootwizard').find('.pager .next').hide();
        //        $('#rootwizard').find('.pager .finish').show();
        //        $('#rootwizard').find('.pager .finish').removeClass('disabled');
        //    } else {
        //        $('#rootwizard').find('.pager .next').show();
        //        $('#rootwizard').find('.pager .finish').hide();
        //    }

        //}

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

        // Access Angular App Scope
        var cart = angular.element($("#cartApp")).scope();
        if (cart.totalItems > 0)
            postJsonData('order/save', data);
        else
            toastr.warning("Cart is empty. Nothing to checkout.");
    });
});


