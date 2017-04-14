var terms;	// list of terms with url to description

function Hint(term)
{	
	var url;
	terms.forEach(function(elem){
		if (elem.term==term)
			url = elem.data;
	})
	
	var div = $('<div/>', {class: 'hint' }).css('top',window.event.clientY).css('left',window.event.clientX);
	console.log(div);
	$.ajax(
		{
			url: 'json/'+url,
			type:'GET',
			dataType:'json'
		}
	)
	.done( function(response){
			// alert(response);
			div[0].innerText = JSON.stringify(response);

			$('body').append(div);
	})
	.fail(function(){
		alert('fail');
	})
}

function showHint()
{
	// this.css('color','red');
	this.style.color = 'red';
	Hint(this.innerText);
	
}

function hideHint()
{
	// this.css('color','inherit');
	this.style.color = 'yellow';	
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
	$('span').css('color','yellow');
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
				
			},)


}