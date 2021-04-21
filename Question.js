"use strict";

class Question{
	constructor(question, answer1, answer1Value, answer2, answer2Value, answer3, answer3Value, answer4, answer4Value, questionType){
		this.question = question;

		this.answer1 = answer1;
		this.answer1Value = answer1Value;

		this.answer2 = answer2;
		this.answer2Value = answer2Value;

		this.answer3 = answer3;
		this.answer3Value = answer3Value;

		this.answer4 = answer4;
		this.answer4Value = answer4Value;

		this.questionType = questionType;
	}

	getQuestion(){
		return this.question;
	}
	getAnswer1(){
		return this.answer1;
	}
	getAnswer2(){
		return this.answer2;
	}
	getAnswer3(){
		return this.answer3;
	}
	getAnswer4(){
		return this.answer4;
	}

	getQuestionType(){
		return this.questionType;
	}

	returnAnswer(selectedAnswer){
		switch(selectedAnswer){
			case "1":
				return this.answer1Value;
				break;
			case "2":
				return this.answer2Value;
				break;
			case "3":
				return this.answer3Value;
				break;
			case "4":
				return this.answer4Value;
				break;
			default:
				return -1;
				break;
		}
	}


}