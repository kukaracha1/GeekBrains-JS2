var tags;		// json list of tags tesyt

function CategoryForm(parent_id=null, inherit = true)
{
	var parent_id = parent_id,
		form = $('<form/>' , {
			class	:	"search-form"
			}),
		select = $('<select/>' , {
			class : 'col-md-offset-1'
		}),
		input = $('<input/>' , { 
				class	:	"tags form-inline" ,
				placeholder	:	"...or create new"
			}),
		button = $('<button/>' , {
				class	:	"btn btn-success btn-add-tag",
				text	:	'Create'
			}),
		child = $('<form/>' , {
			class	:	"search-form"
			}),
		buttonAdd = $('<button/>' , {
				class	:	"btn btn-success btn-create-tag",
				text	:	'Add'
			}),
		paragraph = $('<h4/>' , { 
			text : (parent_id==null)? 'Categories:' : 'Subcategories:',
			class : 'col-md-offset-1'
			}),
		inherit = inherit;
	var selected;


	function getSelectedTags()
	{
		var result = [];
		$(selected).each(function(index , item) {
			result.push($(item).data('id'));
		});
		// if (result==undefined)
		// 	return null;
		return result;
	}

	function addToSelection(id , text)
	{
		$(selected).append(
			$('<button/>' , {
				class	:	'btn btn-default btn-small',
				text	:	text,
				'data-id':	id
			})
			.prepend($('i', {
				class	:	'fa - fa-tag'
			}))
			.click(function() {
				$(this).remove();
			})
		);
	}

	function loadTags()
	{
		// $('.tags').keyup(function() {
		console.log('start loading suggest');
		var selectedTags = getSelectedTags();
		console.log(selectedTags);
		$(select).empty();

		// find the unmatched tags from selected text
		// var value = $(this).val();
		var matchedTags = tags.filter(function(item) {
			return /*(item.title.indexOf(value) === 0 ) &&*/ (selectedTags.indexOf(item.id) === -1) && (item.parent_id == parent_id);
		});
		console.log(matchedTags);

		$(select).append(
			$('<option/>' , {
				class	: 'none_category',
				text	: 'Choose category...',
			})
		);

		//add elements to suggested text
		$.each(matchedTags , function(index, item) {
			$(select).append(
				$('<option/>' , {
					class	:	'tag-suggest',
					text	:	item.title,
					'data-id':	item.id
				}).click(function(e) {
					e.preventDefault();
					var tagId = $(this).data('id');
					var tagText = $(this).text();
					addToSelection(tagId , tagText);
					$(this).remove();
				})
			);
		});
	// });
	}

	$(select).change(function() {
		// var selectedLine = $($(this) + " option:selected");
		// var selectedLine = $(this).val();
		var selectedLine = $(this)[0].selectedIndex;
		var selectedElem = $(this)[0][selectedLine];
		console.log(selectedLine);
		console.log($(this)[0][selectedLine]);
		var selectedId = $(selectedElem).data('id');
		$(child).empty();
		if (selectedId!=null && inherit)
		{
// must be changed			
			var newForm = new CategoryForm(selectedId , false);
			newForm.setSelected($(selected));
			$(child).append(newForm);
		}
	})

	// take input value
	function CreateTag( inputValue , callback)
	{
		var returnItem = {};
		input.prop('disabled','disabled');
		button.prop('disabled','disabled');

		$.ajax({
			url:	'php/create-tag.php',
			method:	'POST',
			dataType:	'json',
			data:	
				{
					name: inputValue
				}
		})
		.done(function(response) {
			// console.log(response.id);
			// console.log(inputValue);
			// addToSelection(response.id, inputValue);

			returnItem = {
					"id": response.id,
					"parent_id": parent_id,
					"title": inputValue
			};

			tags.push(returnItem);
			loadTags();
			console.log(returnItem);
			callback(returnItem.id , returnItem.title);	
		})
		.fail(function(status) {
			// alert(status.text);
			console.log()
			console.log(status);
			
		})
		.always(function() {
			input.prop('disabled',false);
			button.prop('disabled',false);
			$(input).val(null);
					
		})
	}


	$(form).submit(function(e) {
	// $('.btn btn-success btn-add-tag').click(function(e) {
		e.preventDefault();
		// alert('submit button');

		 
		// inputText = $('.tags'),
			// addButton = $('.btn btn-success btn-add-tag');
		var tagValue = $(input).val();
			console.log(tagValue);
		if (tagValue!="")
		{
			CreateTag(tagValue);
		}
		else
		{
			// add tag from currents

			// var selectedLine = $(select)[0].selectedIndex;
			// var selectedElem = $(select)[0][selectedLine];
			// var selectedId = $(selectedElem).data('id');

			// addToSelection( selectedId , $(select).val() );
		}
	})

	$(buttonAdd).click(function(e) {
		e.preventDefault();
		 
		var tagValue = $(input).val();
			console.log(tagValue);
		if (tagValue!="")
		{
			var newItem = CreateTag(tagValue, addToSelection);
			// console.log('create Tag');
			// console.log(newItem);
			// addToSelection(newItem.id, newItem.title);
		}
		else
		{
			// add tag from currents

			var selectedLine = $(select)[0].selectedIndex;
			var selectedElem = $(select)[0][selectedLine];
			var selectedId = $(selectedElem).data('id');

			addToSelection( selectedId , $(select).val() );
		}
	})

	
//////////////////////////////////////////////////////////////////
	form.setSelected = function(div) {
		selected = div;
	}
	
//////////////////////////////////////////////////////////////////
	loadTags();

	form.append($(paragraph)).append($(select)).append($(input)).append($(button)).append($(buttonAdd)).append($(child));
	return form;
}




$(function() {
var form1;

	$.ajax({
		url: 'categories.json',
		method: 'POST',
		dataType: 'json'
	})
	.done(function(response) {

		tags = response;
		// alert("Success");
		// loadTags();
		form1 = new CategoryForm();
		form1.setSelected($('.selected'));

		$('.forms').append(form1);
	})
	.fail(function(status) {
		alert("Error: " + status);
		console.log(status);
	});







})
