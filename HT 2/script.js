var input;
var request;
var answer;

function main()
{
	input = document.querySelector(".txt");
	// console.log(input);

	// создание запроса
	//на массу
	if(window.XMLHttpRequest)
	{
	request = new XMLHttpRequest();
	}
	// explorer
	// else if(window.ActiveXObject)
	// {
	// 	request = new ActiveXObject("Microsoft.XMMLHTTP");
	// }
	
	// request.open('GET','server.json?search=' + this.value,true);
	request.open('GET','server.php',true);
	// request.setRequestHeader('Content-Type','application/json');
	request.send();

	request.onreadystatechange = function(){
		console.log(this);
		if (this.readyState==4 && this.status==200)
		{
			answer = JSON.parse(this.responseText);
			console.log("answer: "+answer);
		}
	
	};

}