"use strict";

var questionsSelected = false;

var classQuestions = [];
var raceQuestions = [];
var alignmentQuestions = [];

var selectedRaceQuestions = [];
var selectedClassQuestions = [];
var selectedAlignmentQuestions = [];

var selectedQuestions = [];

var currentQuestion = -1;

var selectedAnswers = [];
var selectedAnswerTypes = [];

function randInt(min, max){return Math.floor(Math.random() * (max - min) + min);}

function displayResults(){
	var results = gainResults();
	$('#test').prop({hidden:true});
	$('#results').prop({hidden:false});
	$('#Race').text("Your Race is " + results[0]);
	$('#Class').text("Your Class is " + results[1]);
	$('#Alignment').text("Your Alignment is " + results[2]);
}

function gainResults(){
	var output = ["","",""];
	var races = [0,0,0,0,0,0,0,0,0];
	var raceNames = ['Dragonborn','Dwarf','Elf','Gnome','Half-elf','Halfling','Half-orc','Human','Tiefling'];
	var classes = [0,0,0,0,0,0,0,0,0,0,0,0];
	var classNames = ['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard']
	var morality = 0;
	var lawfullness = 0;
	/*
	Key
	output: index 0 = race, index 1 = class, index 3 = alignment

	alignment, morality stands for x axis on alignment chart, lawfullness stands for y axis
	*/

	for(var i = 0;i<selectedQuestions.length;i++){
		var AnswerType = getAnswer(i)[0];
		var Answer = getAnswer(i)[1];
		if(AnswerType == "Race"){
			for(var i=0;i<races.length;i++){
				if(raceNames[i] == Answer.getName1()){
					races[i] += Answer.getValue1();
					break; 
				}
			}
			for(var i=0;i<races.length;i++){
				if(raceNames[i] == Answer.getName2()){
					races[i] += Answer.getValue2();
					break; 
				}
			}
		}
		else if(AnswerType == "Class"){
			for(var i=0;i<classes.length;i++){
				if(classNames[i] == Answer.getName1()){
					classes[i] += Answer.getValue1();
					break; 
				}
			}
			for(var i=0;i<classes.length;i++){
				if(classNames[i] == Answer.getName2()){
					classes[i] += Answer.getValue2();
					break; 
				}
			}
		}
		else if(AnswerType == "Alignment"){
			lawfullness += Answer.getValue1();
			morality += Answer.getValue2();
		}
	}
	var largestRaceIndex = 0;
	var largestClassIndex = 0;
	for(var i = 0;i<races.length;i++){
		if(largestRaceIndex < races[i]){
			largestRaceIndex = i;
		}
	}
	for(var i=0;i<classes.length;i++){
		if(largestClassIndex < classes[i]){
			largestClassIndex = i;
		}
	}
	output[0] = raceNames[largestRaceIndex];
	output[1] = classNames[largestClassIndex];
	if(morality == 0 && lawfullness == 0){
		output[2] = "True Neutral";
	}
	else{
		if(lawfullness > 0){
			output[2] += "Lawful";
		}
		else if(lawfullness == 0){
			output[2] += "Neutral";
		}
		else if(lawfullness < 0){
			output[2] += "Chaotic";
		}

		if(morality > 0){
			output[2] += " Good";
		}
		else if(morality == 0){
			output[2] += " Neutral";
		}
		else if(morality < 0){
			output[2] += " Evil";
		}
	}

	return output;
}

function setQuestion(){
	if(currentQuestion>selectedQuestions.length-1){
		$('#bar').val(currentQuestion);
		displayResults();
	}
	else{
		$('#question').text(selectedQuestions[currentQuestion].getQuestion());
		$('#label1').text(selectedQuestions[currentQuestion].getAnswer1());
		$('#label2').text(selectedQuestions[currentQuestion].getAnswer2());
		$('#label3').text(selectedQuestions[currentQuestion].getAnswer3());
		$('#label4').text(selectedQuestions[currentQuestion].getAnswer4());
		$('.choice').prop("checked", false);
		$('#Submit').prop("disabled", true);
		$('#bar').val(currentQuestion);
	}
}

function selectQuestions(QuestionList){
	var SelectedQuestionList = [];
	while(SelectedQuestionList.length != 4){
		var randomInt = randInt(0, QuestionList.length);
		var duplicateNumber = false;
		for(var i = 0; i<SelectedQuestionList.length;i++){
			if(randomInt == SelectedQuestionList[i]){
				duplicateNumber = true;
				break;
			}
		}
		if(!duplicateNumber){
			SelectedQuestionList.push(randomInt);
		}
	}
	return SelectedQuestionList;
}

function storeAnswer(Answer, AnswerType){
	selectedAnswers.push(Answer);
	selectedAnswerTypes.push(AnswerType);
}

function getAnswer(index){return [selectedAnswerTypes[index],selectedAnswers[index]];}

function Initialize(){
	classQuestions.push(new Question(
		"What was your dream as a 5 year old?",
		"Astronaut",
		new AnswerType("Warlock",2,"Barbarian",1),
		"President",
		new AnswerType("Paladin",2,"Sorcerer",1),
		"Doctor",
		new AnswerType("Wizard",2,"Druid",1),
		"Firefighter",
		new AnswerType("Fighter",2,"Monk",1),
		"Class"
		));
	classQuestions.push(new Question(
		"How do you typically get dinner?",
		"Wait you guys can cook dinner???",
		new AnswerType("Rogue",2,"Warlock",1),
		"Who has time to cook?",
		new AnswerType("Sorcerer",2,"Ranger",1),
		"Postmates exist dude",
		new AnswerType("Wizard",2,"Fighter",1),
		"I cook every night",
		new AnswerType("Bard",2,"Cleric",1),
		"Class"
		));
	classQuestions.push(new Question(
		"What do you do at the gym?",
		"Weights",
		new AnswerType("Fighter",2,"Monk",1),
		"Stare",
		new AnswerType("Druid",2,"Bard",1),
		"Treadmill",
		new AnswerType("Ranger",2,"Rogue",1),
		"Spend 10 minutes picking music",
		new AnswerType("Paladin",2,"Warlock",1),
		"Class"
		));
	classQuestions.push(new Question(
		"What is your favorite Wii Sports Game?",
		"Bowling",
		new AnswerType("Wizard",2,"Sorcerer",1),
		"Tennis",
		new AnswerType("Paladin",2,"Warlock",1),
		"Golf",
		new AnswerType("Cleric",2,"Bard",1),
		"Baseball",
		new AnswerType("Monk",2,"Barbarian",1),
		"Class"
		));

	raceQuestions.push(new Question(
		"Your best friend just stole some money from your coin purse, what do you do?",
		"Take the money back",
		new AnswerType("Dwarf",2,"Dragonborn",1),
		"Turn your friend into the cops",
		new AnswerType("Elf",2,"Human",1),
		"Give them more money",
		new AnswerType("Halfling",2,"Gnome",1),
		"Ask if your friend is ok",
		new AnswerType("Tiefling",2,"Half-elf",1),
		"Race"
		));
	raceQuestions.push(new Question(
		"Your material possessions are buring up, and you can save one thing, what do you save?",
		"Money",
		new AnswerType("Human",2,"Half-elf",1),
		"A stuffed animal",
		new AnswerType("Gnome",2,"Halfling",1),
		"Family Hierloom",
		new AnswerType("Dwarf",2,"Half-orc",1),
		"A nice coffee cup",
		new AnswerType("Elf",2,"Tiefling",1),
		"Race"
		));
	raceQuestions.push(new Question(
		"Where would you feel most comfortable?",
		"A deep cavern",
		new AnswerType("Dwarf",2,"Gnome",1),
		"Alone",
		new AnswerType("Tiefling",2,"Elf",1),
		"Surrounded by Family",
		new AnswerType("Half-orc",2,"Halfling",1),
		"On a hunt",
		new AnswerType("Human",2,"Half-elf",1),
		"Race"
		));
	raceQuestions.push(new Question(
		"What's your relationship with your parents like?",
		"Parents?",
		new AnswerType("Dragonborn",2,"Half-elf",1),
		"They don't speak to me anymore",
		new AnswerType("Elf",2,"Halfling",1),
		"I see them occasionally",
		new AnswerType("Human",2,"Tiefling",1),
		"I have a very good relationship with my parents",
		new AnswerType("Dwarf",2,"Gnome",1),
		"Race"
		));

	alignmentQuestions.push(new Question(
		"An evil cult is holding your friends and family hostage, you can only save one person, who do you save?",
		"Parents",
		new AnswerType("L",2,"M",2),
		"Best Friends",
		new AnswerType("L",0,"M",1),
		"Kill the cult",
		new AnswerType("L",-1,"M",0),
		"Join the cult",
		new AnswerType("L",-2,"M",-2),
		"Alignment"
		));
	alignmentQuestions.push(new Question(
		"What are your go to pizza toppings",
		"Pineapple",
		new AnswerType("L",1,"M",0),
		"Pepperoni",
		new AnswerType("L",0,"M",0),
		"Grilled Onions",
		new AnswerType("L",-1,"M",1),
		"Broccoli",
		new AnswerType("L",-2,"M",-2),
		"Alignment"
		));
	alignmentQuestions.push(new Question(
		"What do you do before leaving the house?",
		"Check the weather",
		new AnswerType("L",2,"M",2),
		"Grab a light jacket, just in case",
		new AnswerType("L",-1,"M",1),
		"Grab a small umbrella for your bag",
		new AnswerType("L",1,"M",-1),
		"Just Leave",
		new AnswerType("L",-2,"M",0),
		"Alignment"
		));
	alignmentQuestions.push(new Question(
		"What is your favorite shape?",
		"Circle",
		new AnswerType("L",0,"M",0),
		"Triangle",
		new AnswerType("L",-1,"M",2),
		"Square",
		new AnswerType("L",0,"M",-1),
		"Tetradecagon",
		new AnswerType("L",2,"M",-2),
		"Alignment"
		));
	alignmentQuestions.push(new Question(
		"Which saying would you use most often?",
		"If i can't be accurate, I'm sure as hell gonna be extra",
		new AnswerType("L",0,"M",1),
		"You can't bend the rules till you learn the rules",
		new AnswerType("L",-1,"M",2),
		"I put the fun in disfunctional",
		new AnswerType("L",-2,"M",1),
		"We march to the beat of our own avocado",
		new AnswerType("L",0,"M",0),
		"Alignment"
		));

	selectedRaceQuestions = selectQuestions(raceQuestions);
	selectedClassQuestions = selectQuestions(classQuestions);
	selectedAlignmentQuestions = selectQuestions(alignmentQuestions);

	for(var i = 0;i<selectedRaceQuestions.length;i++){
		selectedQuestions.push(raceQuestions[selectedRaceQuestions[i]])
	}
	for(var i = 0;i<selectedClassQuestions.length;i++){
		selectedQuestions.push(classQuestions[selectedClassQuestions[i]]);
	}
	for(var i=0;i<selectedAlignmentQuestions.length;i++){
		selectedQuestions.push(alignmentQuestions[selectedAlignmentQuestions[i]]);
	}

	questionsSelected = true;
}


$(document).ready(function(){
	Initialize();
	$('.choice').on("change", function(){
		if($('#Submit').prop("disabled") == true){
			$('#Submit').prop("disabled", false);
		}
	});
	$('#StartButton').prop({disabled:false});
	$('#StartButton').prop({value:"Loaded!"});


$('#StartButton').click(function(){
	if(questionsSelected){
		currentQuestion = 0;
		$('#start').prop({hidden:true});
		$('#test').prop({hidden:false});
		setQuestion();
	}
});

$('#form').on('submit', function(event){
	event.preventDefault();
	storeAnswer(selectedQuestions[currentQuestion].returnAnswer($('input:checked').attr('id')), selectedQuestions[currentQuestion].getQuestionType());
	currentQuestion++;
	setQuestion();
});
});