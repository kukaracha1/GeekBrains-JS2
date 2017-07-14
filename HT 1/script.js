var text,check,result;
var resValue;

// класс инпута с чекбоксом (рабочий класс)
function CheckInput(text)
{
	//private 
	var input = text;
	var check = document.createElement("input");
		check.type = "checkbox";
		check.checked = "true";

	check.addEventListener('click',UpdateView);
	text.parentElement.appendChild(check);
	
	text.addEventListener('keyup',UpdateView);
	text.addEventListener('click',UpdateView);


	// public 
	this.value = function() {
		if (!check.checked)
			return null;
		return input.value;
	}
	this.flag = function() {
		return check.checked;
	}
	this.check = function(){
		return check;
	}

	// возвращаем получившийся инпут
	return this;
}


// инициализация страницы
function Initialize()
{
	// инициализация элементов
	text = document.getElementsByClassName("txt");
	// check = document.getElementById("check");
	result = document.getElementsByClassName("result");
	
	console.log(text);
	// инициализация класса
	// resValue =  new CheckInput(check , text);
	resValue =  new CheckInput(text[0]);

	// инициализация событий
	// text.addEventListener('keyup',UpdateView);
	// text.addEventListener('click',UpdateView);

}

// обновление окна просмотра
function UpdateView()
{
	result[0].innerHTML = resValue.value();
	text[0].disabled = !resValue.flag();
}

// основная функция (точка входа)
function main()
{
	Initialize();
	UpdateView();
}