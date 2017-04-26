

function List()
{
	// private members
	var data, url, template 
		form  = $('<form/>'),
		table = $('<table/>' , {
			class : 'table t-hover'
		}),
		createBtn = $('<button/>' , {
			class	: 'btn btn-primary',
			text	: '+'
		}).click(function(e) {
			e.preventDefault();
			onCreate(url);
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
				if (item[key] === true || item[key] === false || item[key] === "true" || item[key] === "false")
				// add icon
					$(tableRow).append( $('<td/>')
						.append( $('<i/>', { 
							class: 'fa ' +((item[key] === true || item[key] === "true")? ' fa-check' : 'fa-times')
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
	function request(callback=null)
	{
		$.ajax( {
			url			: url,
			method		: 'GET',
			dataType	: 'json',
		})
		.done(function(response) {
			console.log(response);		
			template = response[0];

			data = [];

			for (var index = 1; index < response.length; index++) {
				data[index-1] = response[index];
			}

			// console.log('creating');
			// console.log(data);
			// console.log(template);
			

			// data gotted, fill the table
			refreshTable();

			if (callback!=null)
				callback(template);

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

		$.each(keys, function(inde8x , key){	
			if (key!='id')		
				if (item[key] == true || item[key] == false || item[key] == "true" || item[key] == "false"){
					var val = ($('.'+key).is(':checked'));
					console.log(key + 'val is ' + val + '. condition:  '+(val === true || val === "true"));
					item[key] =  (val === true || val === "true")? true : false;
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
					if (response[key] === true || response[key] === false || response[key] === "true" || response[key] === "false")		
						$(div).append($('<input/>',{
							type 	:	'checkbox',
							checked	:	( response[key] === true || response[key] === "true")? response[key] : false ,
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


	this.getCreateTable = function(id , callback=null) {
		var body = {
				url : url,
			};

			// empty form variable
			$(form).empty();
			form = $('<form/>');
			request( tempAdd);
			
			function tempAdd(template) {

				console.log('template');
				console.log(template);
				// create form based on template variable
				var keys = Object.keys(template);
				console.log(keys);

				$.each(keys, function(index , key){	
					if (key!='id'){
						var div = $('<div/>' , { class 	:	key});
						$(form).append($(div).append($('<span/>',{
								text	:	key+": ",
								class 	:	'col-md-1'
							})));
						if (template[key] === true || template[key] === false)		
							$(div).append($('<input/>',{
								type 	:	'checkbox',
								// checked	:	response[key],
								class 	:	key			
							}))
						else
							$(div).append($('<input/>',{
								// value	:	response[key],
								class 	:	key
							}));
					}
					});

				// add control buttons
				$(form).append($('<button/>' , {
					text	:	'Save',
					class	:	'btn btn-success'
				}).click(function(e) {
					e.preventDefault();
					template.id = data.length+1;
					body.item = template;

					// add item in database
					$.ajax({
						url : 'change.php',
						method: 'GET',
						dataType: 'json',
						data: body
					})
					.done(function(response) {

						console.log('save');
						console.log(response);
						console.log('saveChanges()');
						
						saveChanges(form , template);
					})
					.fail(function(error) {
						console.log(error);
					})

				}))
				.append($('<button/>' , {
					text	:	'Cancel',
					class	:	'btn btn-danger'
				}).click(function(e) {
					e.preventDefault();
					onIndex();
				}))
				
				$('.list').append($(form));

				

			}
		
		
	}


	//  return this;
}

