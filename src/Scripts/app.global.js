
host = document.location.host;

_LOCAL_CART_ID = "cartId";
_CART_ITEMS = "#cartItems";
_LOCAL_CART_VALUE = localStorage.getItem(_LOCAL_CART_ID) == null ? 0 : localStorage.getItem(_LOCAL_CART_ID);

baseURI = "http://" + host + "/bmshop/api/";

if (host.indexOf('localhost') > -1)
    baseURI = "http://localhost:49250/api/";
    


$(document).ready(function () {
    $("#spinner").bind("ajaxSend", function () {
        $(this).show();
    }).bind("ajaxStop", function () {
        $(this).hide();
    }).bind("ajaxError", function () {
        $(this).hide();
    });
});

function getJsonData(webmethod, divId) {
    $('#spinner').show();
    var url = baseURI + webmethod;
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
    $.getJSON(baseURI + '/cart/totals/' + cartId, function (data) {
        $(_CART_ITEMS).html("Total Items = " + data.TotalItems);
    });
}

function postJsonData(webmethod, postedData) {
    //$('#spinner').show();
    var url = baseURI + webmethod;
   
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

