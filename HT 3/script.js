
function Request()
{
	var xhr = new XMLHttpRequest();
	var success = function(){};
	var fail = function(){};

	this.success = function(e){
		success = e;
	}
	this.fail = function(e){
		fail = e;
	}
	this.open = function(method, url){
		xhr.open(method, url , true);		
	}
	this.send = function(data=""){
		xhr.send(data);
	}
	xhr.onreadystatechange = function(){
		if (xhr.readyState==4)
		{
			if (xhr.status==200)
				success(xhr.responseText);
			else
				fail(xhr.statusText);
		}
	}
}

function ShopList()
{
	//private
	var list = $('<table/>');
	var add = $('<button/>' , {text : '+'});
	var div = $('<div/>').append(list).append(add);

	function setValues(elem)
	{
		elem.name = prompt("Enter the name of new object:","Bread");
		elem.amount = prompt("Enter the quantity of new object:","1");
		return elem;
	}

	function checkClick(elem , check)
	{
		if (check)
			$(elem).closest('tr').css("text-decoration" , "line-through");
		else
			$(elem).closest('tr').css("text-decoration" , "none");
	}
	function delClick(elem)
	{
		$(elem).closest('tr').remove();
	}

	function addLine(element)
	{
		list.append(
		$('<tr/>').append(
				$('<td/>').append($('<input/>' , {type : "checkbox" , checked : element.checked})
				.click(
					function(){
						checkClick(this, this.checked);
					}
				))
			).append(
				$('<td/>' , {text : element.amount})
			).append(
				$('<td/>' , {text : element.name})					
			).append(
				$('<td/>').append($('<button/>' , {text : "x"})
				.click(
					function(){
						delClick(this);
					}
				))
			)
		);
		return add;
	}

// 		button event
	add.click ( function(){
		var newElem = {name:"" , amount:0};
		setValues(newElem);
		addLine(newElem);

	});

	// public
	this.add = function(element){
		addLine(element);
	}
	this.getDiv = function(){
		return div;
	}

}

function main()
{
	var list,result;

	request = new Request();
// connect to server's file
	request.open('GET','list.json');

// determine success & fail function for request
	request.success(function(responseText){
		// convert data from server
		list = JSON.parse(responseText);

		// create a new table
		result = new ShopList();

		// fill the table
		list.forEach(function(element) {
			result.add(element);		 	
		}, this);

		// add the table to the body
		$('body').append(result.getDiv());
	});

	request.fail(function(statusText){
		alert("Error: " + statusText);
		console.log(statusText);
	});

// send the request
	request.send();

}

//main();