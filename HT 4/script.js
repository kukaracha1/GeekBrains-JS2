var terms;	// list of terms with url to description

function Hint(term)
{	
	var url;
	terms.forEach(function(elem){
		if (elem.term==term.innerText)
			url = elem.data;
	})
	
	$.ajax(
		{
			url: 'json/'+url,
			type:'GET',
			dataType:'json'
		}
	)
	.done( function(response){
			// alert(response);

	var div = $('<div/>', 
	{
		class: 'hint' 
		// ,html : 
		// 	((response.title)? $('<h/>' , {text : response.title}) : "") + 
		// 	((response.description)? $('<p/>' , {text : response.description}) : "") + 
		// 	((response.url)? $('<p/>' , {text : response.url}) : "") +
		// 	((response.picture)? $('<img/>' , {src : response.picture}) : "")
	
	})
	.append( ((response.title)? $('<h3/>' , {text : response.title}) : ""))
	.append( ((response.description)? $('<p/>' , {text : response.description}) : "") )
	.append( ((response.url)? $('<a/>' , {text: 'See more...' , href : response.url}) : "") )
	.append( ((response.picture)? $('<img/>' , {src : response.picture , alt:'Picture could not be loaded'}) : "") )
	.css('top',"15px")
	.css('left',"-100px");

	console.log(div);
	
			$(term).append(div);
	})
	.fail(function(){
		alert('fail');
	})
}

function showHint()
{
	$(this).css('color','red');
	// this.style.color = 'red';
	Hint(this);
	
}

function hideHint()
{
	$(this).css('color','yellow');
	// this.style.color = 'yellow';	
	$('.hint').remove();
}
	

function parseSpan(terms)
{
	// console.log(terms[0].term);
	terms.forEach(function(elem) {
		// console.log(
			$('.text').contents().filter(function(){
				return this.nodeType == 1
			}).
			each(function(){
				this.innerHTML = (this.innerHTML).replace(elem.term , '<span>'+(elem.term)+'</span>');
			;})
			
			
		// );
	}, this);

	$('span').hover(showHint,hideHint);
	$('span').css('color','yellow').css('text-decoration','dotted');

}

window.onload = function(){

	// take data from server
	$.ajax(
		{
			url: 'json/terms.json',
			type: 'GET',
			dataType: 'json',
			// success: function(response){
			// 	terms = response;
			// 	console.log(terms);			
			// },
			fail: function(msg){
				alert(msg);
			}
		}
	).done(function(response){
				terms = response;
				//console.log(terms);
				parseSpan(terms);
				
			})


}