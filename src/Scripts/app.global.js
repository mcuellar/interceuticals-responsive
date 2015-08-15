
host = document.location.host;
baseURI = "http://" + host + "/bmshop/api/";


$(document).ready(function () {
    $("#spinner").bind("ajaxSend", function () {
        $(this).show();
    }).bind("ajaxStop", function () {
        $(this).hide();
    }).bind("ajaxError", function () {
        $(this).hide();
    });
});


function getJsonData(webmethod) {
    $('#spinner').show();
    var url = baseURI + webmethod;
    var start = new Date().getTime();
    $.ajax({
        url: url,
        type: 'GET',
        datatype: 'json',
        success: function (data) {
            var duration = new Date().getTime() - start;
            $('#spinner').hide();
        },
        error: function (jqXHR, textStatus, err) { $(controlID).val('Error: ' + err); }
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
        },
        error: function (jqXHR, textStatus, data) {
            //$('#spinner').hide();
            toastr.error("ERROR.  Please try again or call our office.");
        }
    });
}

