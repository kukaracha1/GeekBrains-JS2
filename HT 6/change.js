function getQueryParam(param) 
{
    var search = document.location.search;
    var values = search.slice(1).split('&').filter(
        function(item) {
            return item.split('=')[0] === param;
        }
    );

    return values.pop().split('=').pop();
}



$(function() {
    var itemId = getQueryParam('id');
    var url = getQueryParam('url');

    console.log(itemId);

    var dogs = new List();
    dogs.setUrl(url);

    function form(result) {
        $('.list').append($(result));
    };
    dogs.getChangeTable(itemId , form);


})