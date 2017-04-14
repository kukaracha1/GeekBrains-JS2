var input;

function loginInput(input)
{
	var 
		jsonAnswer,	
		request = new XMLHttpRequest(), 
		answer = document.createElement("p"),
		input = input;

	// отправка запроса
	function requestSend()
	{
		// request.open('GET','server.json',true);
		request.open('GET','server.php?login='+this.value,true);
		request.send(input.value);
	}

	// вывод ответа от сервера
	function writeResponse(responseText)
	{
		answer.innerHTML = responseText;
		input.parentNode.appendChild(answer);
	}

	// создание запроса
	request.onreadystatechange = function(){
		if (this.readyState==4 && this.status==200)
		{
			writeResponse(this.responseText);
		}
	
	};

	// слушатель на ввод
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