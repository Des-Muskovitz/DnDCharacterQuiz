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

var totalQuestions = 12;

//generate random number
function randInt(min, max){return Math.floor(Math.random() * (max - min) + min);}

function debugQuestions(){
	for(var i = 0;i<selectedQuestions.length;i++){
		console.log(selectedQuestions[i].getQuestion());
	}
}

//shows results page with pre-designated results
function debugResults(){
	var results = ["Half-orc", "Fighter", "True Neutral"];
	$('.test').prop({hidden:true});
	$('.start').prop({hidden:true});
	$('.results').prop({hidden:false});
	$('#race_link').prop("href","https://www.dndbeyond.com/races/"+results[0]);
	$('#race_link').text(results[0]);
	$('#class_link').prop("href", "https://www.dndbeyond.com/classes/"+results[1]);
	$('#class_link').text(results[1]);
	$('#Alignment').text("Your Alignment is " + results[2]);
}

//shows results page with quiz selected results
function displayResults(){
	var results = gainResults();
	$('.test').prop({hidden:true});
	$('.results').prop({hidden:false});
	$('#race_link').prop("href","https://www.dndbeyond.com/races/"+results[0]);
	$('#race_link').text(results[0]);
	$('#class_link').prop("href", "https://www.dndbeyond.com/classes/"+results[1]);
	$('#class_link').text(results[1]);
	$('#Alignment').text("Your Alignment is " + results[2]);
}

//calculates all the answers into Race, Class, and Alignment
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
			for(var j=0;j<races.length;j++){
				if(raceNames[j] == Answer.getName1()){
					races[j] += Answer.getValue1();
					break; 
				}
			}
			for(var j=0;j<races.length;j++){
				if(raceNames[j] == Answer.getName2()){
					races[j] += Answer.getValue2();
					break; 
				}
			}
		}
		else if(AnswerType == "Class"){
			for(var j=0;j<classes.length;j++){
				if(classNames[j] == Answer.getName1()){
					classes[j] += Answer.getValue1();
					break; 
				}
			}
			for(var j=0;j<classes.length;j++){
				if(classNames[j] == Answer.getName2()){
					classes[j] += Answer.getValue2();
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

//sets and displays the current question
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
		$('#SubmitQuestions').prop("disabled", true);
		$('#bar').val(currentQuestion);
		$('#Text_Progress').text(currentQuestion+"/"+totalQuestions);
	}
}

//selects 4 questions from each catagory to be used in the quiz
function selectQuestions(QuestionList, QuestionAmount){
	var SelectedQuestionList = [];
	while(SelectedQuestionList.length != QuestionAmount){
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

//stores the answers and answer types in seperate arrays
function storeAnswer(Answer, AnswerType){
	selectedAnswers.push(Answer);
	selectedAnswerTypes.push(AnswerType);
}


function getAnswer(index){return [selectedAnswerTypes[index],selectedAnswers[index]];}

function Initialize(RaceQuestionAmount, ClassQuestionAmount, AlignmentQuestionAmount){
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
		"Who has time to eat?????",
		new AnswerType("Rogue",2,"Warlock",1),
		"Meh i get my roommate to do it",
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
	classQuestions.push(new Question(
		"How do you deal with your problems?",
		"I just stress",
		new AnswerType("Cleric",2,"Druid",1),
		"I procrastinate for hours",
		new AnswerType("Barbarian",2,"Fighter",1),
		"I solve them constructively and quickly",
		new AnswerType("Wizard",2,"Monk",1),
		"I have no problems, I am a god",
		new AnswerType("Sorcerer",2,"Bard",1),
		"Class"
		));
	classQuestions.push(new Question(
		"How do you feel about leadership?",
		"Hey man, I'm always in charge",
		new AnswerType("Barbarian",2,"Bard",1),
		"Fuck you I don't do what you tell me",
		new AnswerType("Warlock",2,"Ranger",1),
		"I'm happy to serve",
		new AnswerType("Cleric",2,"Paladin",1),
		"The elementary school teacher never made me the line leader",
		new AnswerType("Druid",2,"Rogue",1),
		"Class"
		));
	classQuestions.push(new Question(
		"It's a first date, what are you wearing?",
		"Something very formal",
		new AnswerType("Wizard",2,"Bard",1),
		"Denim, and a button up",
		new AnswerType("Barbarian",2,"Monk",1),
		"Idk, what ever is clean",
		new AnswerType("Ranger",2,"Fighter",1),
		"Just Socks",
		new AnswerType("Warlock",2,"Rogue",1),
		"Class"
		));
	classQuestions.push(new Question(
		"Which fantasy milkshake name sounds most appealing?",
		"Blood of your enemies",
		new AnswerType("Fighter",2,"Rogue",1),
		"Living Dragon Fruit",
		new AnswerType("Monk",2,"Ranger",1),
		"Diamond Shavings",
		new AnswerType("Sorcerer",2,"Bard",1),
		"Blueberry pancakes",
		new AnswerType("Druid",2,"Barbarian",1),
		"Class"
		));
	classQuestions.push(new Question(
		"What is your favorite healthy dessert",
		"Fruit",
		new AnswerType("Monk",2,"Rogue",1),
		"Chocolate covered crackers",
		new AnswerType("Paladin",2,"Cleric",1),
		"Yogurt dipped foods",
		new AnswerType("Ranger",2,"Druid",1),
		"A single glass of red wine, and a small square of dark chocolate",
		new AnswerType("Sorcerer",2,"Bard",1),
		"Class"
		));
	classQuestions.push(new Question(
		"What is your favorite flower",
		"Dandelion",
		new AnswerType("Fighter",2,"Druid",1),
		"Daisy",
		new AnswerType("Cleric",2,"Ranger",1),
		"Rose",
		new AnswerType("Barbarian",2,"Rogue",1),
		"All-Purpose",
		new AnswerType("Bard",2,"Warlock",1),
		"Class"
		));
	classQuestions.push(new Question(
		"At what age did you stop eating glue?",
		"Mother taught me better than that",
		new AnswerType("Ranger",2,"Sorcerer",1),
		"Before Pre-School",
		new AnswerType("Rogue",2,"Druid",1),
		"Excuse you it's called paste",
		new AnswerType("Wizard",2,"Cleric",1),
		"Wait, Y'all Stopped",
		new AnswerType("Fighter",2,"Barbarian",1),
		"Class"
		));
	classQuestions.push(new Question(
		"What classic strip mall location do you most identify with?",
		"Kumon",
		new AnswerType("Wizard",2,"Warlock",1),
		"Discount Martial Arts Dojo",
		new AnswerType("Monk",2,"Fighter",1),
		"The name brand coffee shop",
		new AnswerType("Cleric",2,"Paladin",1),
		"Generic Sushi resturant",
		new AnswerType("Rogue",2,"Ranger",1),
		"Class"
		))

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
		"What is your relationship with your parents like?",
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
	raceQuestions.push(new Question(
		"How do you spend your free time?",
		"Playing Video Games",
		new AnswerType("Tiefling",2,"Human",1),
		"Reading",
		new AnswerType("Halfling",2,"Elf",1),
		"Daydreaming",
		new AnswerType("Gnome",2,"Half-elf",1),
		"Exercising",
		new AnswerType("Dragonborn",2,"Half-orc",1),
		"Race"
		));
	raceQuestions.push(new Question(
		"What sitcom archetype do you fit into?",
		"The Straight-man",
		new AnswerType("Dragonborn",2,"Half-orc",1),
		"The Precocious",
		new AnswerType("Halfling",2,"Gnome",1),
		"The Sage",
		new AnswerType("Half-elf",2,"Dwarf",1),
		"The Charmer",
		new AnswerType("Tiefling",2,"Human",1),
		"Race"
		));
	raceQuestions.push(new Question(
		"You and your closest friends are all hanging out, what y'all doing?",
		"Card/Board games",
		new AnswerType("Gnome",2,"Halfling",1),
		"Drinking Games",
		new AnswerType("Half-orc",2,"Dwarf",1),
		"Movie night",
		new AnswerType("Half-elf",2,"Human",1),
		"IDK i suck at planning these things",
		new AnswerType("Dragonborn",2,"Tiefling",1),
		"Race"
		));
	raceQuestions.push(new Question(
		"Favorite McDonalds Chicken Nugget Shape (Yes they have defined shape, google it)",
		"Bell",
		new AnswerType("Gnome",2,"Dwarf",1),
		"Ball",
		new AnswerType("Elf",2,"Half-elf",1),
		"Boot",
		new AnswerType("Human",2,"Halfling",1),
		"Bone",
		new AnswerType("Half-orc",2,"Dragonborn",1),
		"Race"
		));
	raceQuestions.push(new Question(
		"What is your go to pasta shape",
		"Penne",
		new AnswerType("Human",2,"Halfling",1),
		"Orecchiette",
		new AnswerType("Elf",2,"Dwarf",1),
		"Gnocchi",
		new AnswerType("Dragonborn",2,"Tiefling",1),
		"Ravioli",
		new AnswerType("Half-orc",2,"Half-elf",1),
		"Race"
		));
	raceQuestions.push(new Question(
		"What do you say when stepping on a lego piece?",
		"Scream Fuck",
		new AnswerType("Half-orc",2,"Tiefling",1),
		"Scream a curse adjacent word",
		new AnswerType("Gnome",2,"Elf",1),
		"Grimace, but remain quiet",
		new AnswerType("Dragonborn",2,"Dwarf",1),
		"\"Not Again\"",
		new AnswerType("Half-elf",2,"Dragonborn",1),
		"Race"
		));
	raceQuestions.push(new Question(
		"How do you do your hair in the morning",
		"Comb/Hairbrush",
		new AnswerType("Halfling",2,"Gnome",1),
		"Conditioner",
		new AnswerType("Elf",2,"Half-elf",1),
		"I run my fingers through it?",
		new AnswerType("Half-orc",2,"Dwarf",1),
		"Pommade",
		new AnswerType("Tiefling",2,"Dragonborn",1),
		"Race"
		));
	raceQuestions.push(new Question(
		"Favorite Minecraft Monster",
		"Creeper",
		new AnswerType("Tiefling",2,"Half-orc",1),
		"Skeleton",
		new AnswerType("Halfling",2,"Gnome",1),
		"Zombie",
		new AnswerType("Human",2,"Half-elf",1),
		"I've never played Minecraft",
		new AnswerType("Elf",2,"Dragonborn",1),
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
	alignmentQuestions.push(new Question(
		"Pick a political Commentator",
		"Ben Shapiro",
		new AnswerType("L",2,"M",-2),
		"Trevor Noah",
		new AnswerType("L",2,"M",1),
		"Joe Rogan",
		new AnswerType("L",-2,"M",-2),
		"John Oliver",
		new AnswerType("L",-2,"M",2),
		"Alignment"
		));
	alignmentQuestions.push(new Question(
		"How do you clean your dishes",
		"My roomates do em",
		new AnswerType("L",-2,"M",-2),
		"Scrub brush with an internal soap dispencer",
		new AnswerType("L",2,"M",0),
		"No soap, only aggressivly hot water",
		new AnswerType("L",-2,"M",0),
		"Dishwasher",
		new AnswerType("L",2,"M",1),
		"Alignment"
		));
	alignmentQuestions.push(new Question(
		"How would you die in the middle ages?",
		"Gout, I would eat myself to death",
		new AnswerType("L",0,"M",-1),
		"The plauge",
		new AnswerType("L",2,"M",1),
		"I will live forever, get one of those cool beak masks",
		new AnswerType("L",-1,"M",1),
		"Burned/Drowned for being a witch",
		new AnswerType("L",-2,"M",2),
		"Alignment"
		));
	alignmentQuestions.push(new Question(
		"Pick a potato dish",
		"Raw Potato",
		new AnswerType("L",-2,"M",-2),
		"Mashed Potatoes",
		new AnswerType("L",-2,"M",0),
		"Baked Potatoes",
		new AnswerType("L",2,"M",1),
		"Smilely Fries",
		new AnswerType("L",-1,"M",2),
		"Alignment"
		));
	alignmentQuestions.push(new Question(
		"What kind of sauce do you get on pizza?",
		"Marinara Sauce",
		new AnswerType("L",2,"M",0),
		"Alredo Sauce",
		new AnswerType("L",-1,"M",1),
		"Pesto",
		new AnswerType("L",1,"M",2),
		"Nothing",
		new AnswerType("L",0,"M",-2),
		"Alignment"
		));
	alignmentQuestions.push(new Question(
		"How would you write a greeting to your best friend?",
		"Greetings Coward",
		new AnswerType("L",-1,"M",0),
		"Sup",
		new AnswerType("L",0,"M",1),
		"Hey Bestie",
		new AnswerType("L",-2,"M",-1),
		"Hello",
		new AnswerType("L",2,"M",0),
		"Alignment"
		));
	alignmentQuestions.push(new Question(
		"Which Super Smash Bros Character do you like the most?",
		"Kirby",
		new AnswerType("L",-2,"M",2),
		"Mario",
		new AnswerType("L",1,"M",0),
		"Wii Fit Trainer",
		new AnswerType("L",1,"M",2),
		"I don't know these characters",
		new AnswerType("L",0,"M",0),
		"Alignment"
		));

	selectedRaceQuestions = selectQuestions(raceQuestions, RaceQuestionAmount);
	selectedClassQuestions = selectQuestions(classQuestions, ClassQuestionAmount);
	selectedAlignmentQuestions = selectQuestions(alignmentQuestions, AlignmentQuestionAmount);

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

function addQuestions(RaceQuestionAmount, ClassQuestionAmount, AlignmentQuestionAmount){
	selectedQuestions=[];

	selectedRaceQuestions = selectQuestions(raceQuestions, RaceQuestionAmount);
	selectedClassQuestions = selectQuestions(classQuestions, ClassQuestionAmount);
	selectedAlignmentQuestions = selectQuestions(alignmentQuestions, AlignmentQuestionAmount);

	for(var i = 0;i<selectedRaceQuestions.length;i++){
		selectedQuestions.push(raceQuestions[selectedRaceQuestions[i]])
	}
	for(var i = 0;i<selectedClassQuestions.length;i++){
		selectedQuestions.push(classQuestions[selectedClassQuestions[i]]);
	}
	for(var i=0;i<selectedAlignmentQuestions.length;i++){
		selectedQuestions.push(alignmentQuestions[selectedAlignmentQuestions[i]]);
	}

	totalQuestions = selectedQuestions.length-1;
	$('#bar').prop("max",totalQuestions);
	questionsSelected = true;
}

$(document).ready(function(){
	Initialize(4,4,4);

	$('#StartButton').prop({disabled:false});
	$('#StartButton').prop({value:"Start Quiz!"});

	$('.choice').on("change", function(){
		if($('#SubmitQuestions').prop("disabled") == true){
			$('#SubmitQuestions').prop("disabled", false);
		}
	});

	$('.choice').on("change", function(){
		console.log(".choice changed");
	});

	$('#StartButton').click(function(){
		if(questionsSelected){
			currentQuestion = 0;
			$('.start').prop({hidden:true});
			$('#test').prop({hidden:false});
			setQuestion();
		}
	});

	$('#Explination_Button').click(function(){
		if($('#explination').prop("hidden")==true){
			$('#explination').prop("hidden", false);
			$('#Explination_Button').prop("value", "Hide Explanation");
		}
		else if($('#explination').prop("hidden")==false){
			$('#explination').prop("hidden", true);
			$('#Explination_Button').prop("value", "Explanation");
		}
	});

	$('#Advanced_Settings_Button').click(function(){
		if($('#advancedSettings').prop("hidden")==true){
			$('#advancedSettings').prop("hidden", false);
			$('#Advanced_Settings_Button').prop("value", "Hide Advanced Settings");
		}
		else if($('#advancedSettings').prop("hidden")==false){
			$('#advancedSettings').prop("hidden", true);
			$('#Advanced_Settings_Button').prop("value", "Advanced Settings");
		}
	});

	$('#questionForm').on('submit', function(event){
		event.preventDefault();
		if($('#test').prop("hidden")==false){
			storeAnswer(selectedQuestions[currentQuestion].returnAnswer($('input:checked').attr('id')), selectedQuestions[currentQuestion].getQuestionType());
			currentQuestion++;
			setQuestion();
		}
	});

	$('#advancedSettingsForm').on('submit', function(event){
		event.preventDefault();
		addQuestions($('#raceQuestions').prop("value"),$('#classQuestions').prop("value"),$('#alignmentQuestions').prop("value"));
		$('#Advanced_Settings_Button').click();
	});

	$(document).on('keydown', function(event){
		if(event.which == 49 || event.which == 97){
			$('#1').prop("checked", true);
			$('.choice').change();
		}
		else if(event.which == 50 || event.which == 98){
			$('#2').prop("checked", true);
			$('.choice').change();
		}
		else if(event.which == 51 || event.which == 99){
			$('#3').prop("checked", true);
			$('.choice').change();
		}
		else if(event.which == 52 || event.which == 100){
			$('#4').prop("checked", true);
			$('.choice').change();
		}
		else if(event.which == 13 && $('#SubmitQuestions').prop("disabled") == false){
			$('#SubmitQuestions').click();
		}
	});

});
