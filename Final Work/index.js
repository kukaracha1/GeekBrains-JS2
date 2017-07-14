
$(function() {
	var library = new List();
	library.setsUrls(
		'backend',
		'books.get.php',
		'book.get.php',
		'book.set.php',
		// 'book.set.json',
		'reader.get.php'
	);
	library.setPrivateFields('id','picture','description','taken_by');

	$('.list').append(library.getData());
})