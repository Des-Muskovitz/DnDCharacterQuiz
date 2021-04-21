class AnswerType{
	constructor(name1, value1, name2, value2){
		this.name1 = name1;
		this.value1 = value1;
		this.name2 = name2;
		this.value2 = value2;
	}

	getName1(){
		return this.name1;
	}
	getValue1(){
		return this.value1;
	}
	getName2(){
		return this.name2;
	}
	getValue2(){
		return this.value2;
	}

	setName1(name1){
		this.name1 = name1;
	}
	setValue1(value1){
		this.value1 = value1;
	}
	setName2(name2){
		this.name2 = name2;
	}
	setValue2(value2){
		this.value2 = value2;
	}
}