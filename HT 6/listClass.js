

function List()
{
	// private members
	var data, url, 
		form  = $('<form/>'),
		table = $('<table/>' , {
			class : 'table t-hover'
		}),
		createBtn = $('<button/>' , {
			class	: 'btn btn-primary',
			text	: '+'
		}).click(function(e) {
			e.preventDefault();
			onCreate();
		}),
		wrapper = $('<div/>' , {
			class	: 'col-md-offset-1',
		})
		.append($(table))
		.append($(createBtn));
	
	// open page to create data
	function onCreate()
	{
		document.location.href = 'create.html?url='+url;		
	}

	// open change page with specific data
	function onChange(id)
	{
		document.location.href = 'change.html?id='+id+"&url="+url;
	}

	function onView(id)
	{
		document.location.href = 'view.html?id='+id+"&url="+url;
	}

	function onIndex()
	{
		document.location.href = 'index.html';		
	}

	// clear and fill the table
	function refreshTable()
	{
		$(table).empty();
		$.each(data , function(index , item) {
			
			// create a row
			var tableRow = $('<tr/>', { class: 'table-bordered'});

			// fill the row according to keys of item
			var keys = Object.keys(item);
			delete keys['id'];
			$.each(keys, function(index , key){			
				if (item[key] === true || item[key] === false)
				// add icon
					$(tableRow).append( $('<td/>')
						.append( $('<i/>', { 
							class: 'fa ' +((item[key] === true)? ' fa-check' : 'fa-times')
							// ,
							// value: ((item[key] === true)? true : false)
						})
					))
				else
				// add text
					$(tableRow).append( $('<td/>' , {text	: item[key]	}) );
			});
			// add control buttons
			$(tableRow).append( $('<button/>' , {
					class	: 'btn btn-success',
					text	: 'Change'
				}).click(function(e) {
					e.preventDefault();
					onChange(item.id);
				})
			)

			// add row to table
			$(table).append($(tableRow));
		})	
	}

	// get the list of data
	function request()
	{
		$.ajax( {
			url			: url,
			method		: 'GET',
			dataType	: 'json',
		})
		.done(function(response) {
			console.log(response);		
			data = response;

			// data gotted, fill the table
			refreshTable();
			return data;
		})
		.fail(function(error) {
			console.log(error);
		});
	}

	function saveChanges(form , item)
	{
		console.log(item);
		var newItem;		
		// rewrite data
		
			var keys = Object.keys(item);

			$.each(keys, function(index , key){	
				if (key!='id')		
					if (item[key] === true || item[key] === false){
						var val = ($('.'+key).prop('checked'));
						item[key] =  (val === true || val === 'true')? true : false;
					}
					else
						item[key] = $('.'+key + ' > input').val();
					// console.log(item[key]);
		});

		

		console.log(item);

		// update data on server
		$.ajax({
			url	:	'change.php',
			method: 'GET',
			dataType: 'json',
			data: {
				item : (item),
				url : url
			}
		})
		.done(function(response) {
			alert(response.status);
			onIndex();
		})
		.fail(function(error) {
			console.log(error);
		})

		// onView();
	}



	// public methods
	this.setUrl = function(urlString){
		url = urlString;
		// return url;
	}


	this.getData = function() {
		request();
		return wrapper;
	}

	this.getChangeTable = function(id , callback=null) {
		var data = {
				url : url,
				id : id
			};
		$.ajax({
			url : 'getItem.php',
			method: 'GET',
			dataType: 'json',
			data: data
		})
		.done(function(response) {
			$(form).empty();
			form = $('<form/>');

			var keys = Object.keys(response);
			console.log(keys);

			$.each(keys, function(index , key){	
				if (key!='id'){
					var div = $('<div/>' , { class 	:	key});
					$(form).append($(div).append($('<span/>',{
							text	:	key+": ",
							class 	:	'col-md-1'
						})));
					if (response[key] === true || response[key] === false)		
						$(div).append($('<input/>',{
							type 	:	'checkbox',
							checked	:	response[key],
							class 	:	key			
						}))
					else
						$(div).append($('<input/>',{
							value	:	response[key],
							class 	:	key
						}));
				}
				});


			$(form).append($('<button/>' , {
				text	:	'Save',
				class	:	'btn btn-success'
			}).click(function(e) {
				e.preventDefault();
				saveChanges(form , response);
			}))
			.append($('<button/>' , {
				text	:	'Cancel',
				class	:	'btn btn-danger'
			}).click(function(e) {
				e.preventDefault();
				onIndex();
			}))
			

			// console.log(form);
			if (callback!=null)
				callback(form);

		})
		.fail(function(error) {
			console.log(error);
		})
		
		
	}

	//  return this;
}

