"use strict";

var VerbDrill = {
    series: 1,
    mode: "meaning",
    currentEntry: [],
    score: 0,
    isCheckingAnswer: false,
    entryList: [],
    passedEntries: [],

    setDefaultValues: function() {
        this.series = 1;
        this.mode = "meaning";
        this.currentEntry = [];
        this.score = 0;
        this.isCheckingAnswer = false;
        this.entryList = [];
        this.passedEntries = [];

        resultsVerbButton.classList.add("d-none");
        nextVerbButton.classList.remove("d-none");
        restartButtonVerbs.classList.remove("d-none");
        verbsScore.innerHTML = "0/20";
    },

    setEntryList: function() {
        this.series = verbGroupSelect.value;
        document.getElementById("verb-series").innerHTML = "Série " + this.series;
        let entryGroup = all_verb_groups[this.series - 1];
        this.entryList = shuffle([...entryGroup])
    },

    setDrillMode: function() {
        this.mode = Array.from(verbDrillModeRadios).find(radio => radio.checked).value;
    },

    setCurrentEntry: function() {
        this.currentEntry = this.entryList.pop();
        this.passedEntries.push(this.currentEntry);
        document.getElementById("drilled-verb").innerHTML = this.currentEntry.verb;
    },

    setFourOptions: function() {
        let options = [this.currentEntry]
        let verbListWithoutCurrent = [...this.entryList, ...this.passedEntries].filter(entry => {
            return entry.verb != this.currentEntry.verb
        });

        options.push(shuffle(verbListWithoutCurrent).pop());
        options.push(shuffle(verbListWithoutCurrent).pop());
        options.push(shuffle(verbListWithoutCurrent).pop());

        options = shuffle(options);

        verbDrillOptions.forEach(option => {
            option.innerHTML = options.pop()[this.mode];
            option.classList.add("drill-option");
            option.classList.remove("drill-option-correct", "drill-option-wrong");
        })
    },

    correctAnswer: function() {
        return this.currentEntry[this.mode]
    },

    addScore: function() {
        this.score++;
        verbsScore.innerHTML = this.score + "/20";
    },

    processResults: function() {
        document.getElementById("final-score-verbs").innerHTML = this.score;
        if(this.score < 10) {
            finalMessageVerbs.innerHTML = verb_result_message[0];
        } else if (this.score < 16) {
            finalMessageVerbs.innerHTML = verb_result_message[1];
        } else if (this.score != 20) {
            finalMessageVerbs.innerHTML = verb_result_message[2];
        } else {
            finalMessageVerbs.innerHTML = verb_result_message[3];
        }
    }
}

var sound_correct = new Audio("./sounds/correct.wav");
var sound_wrong = new Audio("./sounds/wrong.mp3");

function shuffle(arr) {
    let currentIndex = arr.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [arr[currentIndex], arr[randomIndex]] = [
        arr[randomIndex], arr[currentIndex]];
    }
    return arr;
}

function flipCard(front, back) {
    front.classList.toggle("d-none");
    back.classList.toggle("d-none");
}

function getRandomEntry(arr) {
    return arr[Math.floor(Math.random()*arr.length)]
}

function startVerbsDrill() {
    VerbDrill.setDefaultValues();
    VerbDrill.setEntryList();
    VerbDrill.setDrillMode();

    showNextVerb();
    flipCard(verbDrillFront, verbDrillBack);
}

function showNextVerb() {
    VerbDrill.setCurrentEntry();
    VerbDrill.setFourOptions();
    
    nextVerbButton.disabled = true;
    VerbDrill.isCheckingAnswer = false;
}

function restartVerbsDrill() {
    flipCard(verbDrillFront, verbDrillBack);
}

function updateVerbList() {
    let verbs = "";
    let groupIndex = verbGroupSelect.value;
    let verbGroup = all_verb_groups[groupIndex-1];
    for (let entry of verbGroup) {
        verbs += entry.verb + ", ";
    }
    verbs = verbs.slice(0, -2);
    verbListP.innerHTML = verbs;
}

function checkVerb(event) {
    if(!VerbDrill.isCheckingAnswer) {
        VerbDrill.isCheckingAnswer = true;
        nextVerbButton.disabled = false;
        let clicked = event.innerHTML;

        // adds CSS class to each option
        verbDrillOptions.forEach(option => {
            option.classList.remove("drill-option");
            if(option.innerHTML == VerbDrill.correctAnswer()) {
                option.classList.add("drill-option-correct");
            } else {
                option.classList.add("drill-option-wrong");
            }
        })

        // checks if clicked option is the correct one
        if (clicked == VerbDrill.correctAnswer()) {
            sound_correct.play();
            VerbDrill.addScore();
        } else {
            sound_wrong.play();
        }

        //checks if there are any verbs left
        if(VerbDrill.entryList.length == 0){
            resultsVerbButton.classList.remove("d-none");
            nextVerbButton.classList.add("d-none");
            restartButtonVerbs.classList.add("d-none");
        }
    }
}

function showVerbResults() {
    VerbDrill.processResults();
    flipCard(verbDrillBack, verbDrillResults);
}

function verbDrillHome() {
    flipCard(verbDrillResults, verbDrillFront);
}

const verbDrillModeRadios = document.getElementsByName("verb-drill-options");

const verbDrillFront = document.getElementById("verb-drill-front");
const verbDrillBack = document.getElementById("verb-drill-back");
const verbDrillResults = document.getElementById("verb-drill-results");

const verbGroupSelect = document.getElementById("verbGroupSelect");
verbGroupSelect.addEventListener("change", updateVerbList);

const verbListP = document.getElementById("verbList");

const startButtonVerbs = document.getElementById("startButtonVerbs");
startButtonVerbs.addEventListener("click", startVerbsDrill);

const restartButtonVerbs = document.getElementById("restartButtonVerbs");
restartButtonVerbs.addEventListener("click", restartVerbsDrill);

const nextVerbButton = document.getElementById("nextVerbButton");
nextVerbButton.addEventListener("click", showNextVerb);

const resultsVerbButton = document.getElementById("results-verb-button");
resultsVerbButton.addEventListener("click", showVerbResults);

const finalMessageVerbs = document.getElementById("final-message-verbs");

const verbsScore = document.getElementById("verbs-score");

const verbDrillHomeButton = document.getElementById("homeVerbButton");
verbDrillHomeButton.addEventListener("click", verbDrillHome);

const verbDrillOptions = [
    document.getElementById("verb-option-1"),
    document.getElementById("verb-option-2"),
    document.getElementById("verb-option-3"),
    document.getElementById("verb-option-4")
];

updateVerbList();