var input;

function loginInput(input)
{
	var 
		jsonAnswer,	
		request = new XMLHttpRequest(), 
		answer = document.createElement("p"),
		input = input;

	function requestSend()
	{
		request.open('GET','server.json',true);
		// request.open('GET','server.php',true);
		request.send(input.value);
	}

	function parseLogin()
	{
		var count=0;
		jsonAnswer.forEach(function(element, i, jsonAnswer) {
			if (element.login == input.value)
				count++;
		}); 
		if (count!=0)
			return true;
		return false;
	}

	function writeAnswer()
	{
		if (parseLogin())
		{
			answer.innerText = "Busy";
		}
			
		else
		{
			answer.innerText = "Free";
		}	

		input.parentNode.appendChild(answer);
}

	// создание запроса
	request.onreadystatechange = function(){
		if (this.readyState==4 && this.status==200)
		{
			// console.log(this.responseText);			
			jsonAnswer = JSON.parse(this.responseText);
			// console.log(jsonAnswer);
			writeAnswer();
		}
	
	};

	input.addEventListener("input",requestSend);
	input.answer = answer;
		
	return input;
}

function main()
{
	input = document.querySelector(".txt");
	console.log(input);

	input = loginInput(input);
	console.log(input);

	

	



}