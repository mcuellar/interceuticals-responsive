
host = document.location.host;

_LOCAL_CART_ID = "cartId";
_CART_ITEMS = "#cartItems";
_CART_HEADER = "#cartHeader";
_LOCAL_CART_VALUE = localStorage.getItem(_LOCAL_CART_ID) == null ? 0 : localStorage.getItem(_LOCAL_CART_ID);

_BASE_URL = "http://" + host + "/bmshop/api/";

if (host.indexOf('localhost') > -1)
    _BASE_URL = "http://localhost:49250/api/";
    


//$(document).ready(function () {
//    $("#spinner").bind("ajaxSend", function () {
//        $(this).show();
//    }).bind("ajaxStop", function () {
//        $(this).hide();
//    }).bind("ajaxError", function () {
//        $(this).hide();
//    });
//});

function getJsonData(webmethod, divId) {
    $('#spinner').show();
    var url = _BASE_URL + webmethod;
    var start = new Date().getTime();
    $.ajax({
        url: url,
        type: 'GET',
        datatype: 'json',
        success: function (data) {
            var duration = new Date().getTime() - start;
            divId.html(data);
            $('#spinner').hide();
        },
        error: function (jqXHR, textStatus, err) {
            toastr.error("ERROR.  Unable to get data.");
        }
    });
}

function setCartTotals(cartId) {
    if (_LOCAL_CART_VALUE > 0) {
        $.getJSON(_BASE_URL + '/cart/totals/' + cartId, function (data) {
            $(_CART_ITEMS).html("Total = $" + data.TotalPrice);
            $(_CART_HEADER).html("Cart (" + data.TotalItems + ")");
        });
    } else {
        $(_CART_ITEMS).html("Total Items = 0");
    }
}

function postJsonData(webmethod, postedData) {
    //$('#spinner').show();
    var url = _BASE_URL + webmethod;
   
    $.ajax({
        url: url,
        crossDomain: true,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(postedData),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            //$('#spinner').hide();
            toastr.success(data.Message);
            if (_LOCAL_CART_VALUE == 0)
                setCartIdSession(data);
            else
                setCartTotals(_LOCAL_CART_VALUE);

        },
        error: function (jqXHR, textStatus, data) {
            //$('#spinner').hide();
            toastr.error("ERROR.  Please try again or call our office.");
        }
    });
}

