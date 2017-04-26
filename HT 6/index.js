
$(function() {
	var dogs = new List();
	dogs.setUrl('dogsList.json');

	$('.list').append(dogs.getData());
})