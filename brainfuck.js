// A Brainfuck interpreter made in Node JS for Discord
// Why? Why not?

//--Discord.js include
const Discord = require('discord.js'); // discord.js

//--Prepare Bot
const bot = new Discord.Client();

//--Constants
const token = 'YOUR-BOT-TOKEN-HERE'; // Put your bot token here
const trigger = 'bf!'; // How commands start
const killDelay = 5; // Seconds before killing an infinite/long loop
//const maxCells = 4000; // Amount of cells to work in
//const maxInstructors = 5000; // Amount of commands the compiler can handle

bot.on('ready', () => {
	console.log('Bot Ready, for help type ' + trigger + 'help');
});

bot.on('message', message => {
	var currMessage = message.content.split(" ");
	
	if(currMessage[0] == trigger+'run') {
		var con = "";
		var reply = "";
		// Concatenate the command for easier running
		var str = trigger+'run ';
		var currCode = message.content.substring(str.length);
		// Check each character in the code
		var cells = [0]; // Cells the interpreter works in
		var c; // Current character
		var x = 0; // Current position in the array
		var y = -1; // (Character) start position of the current loop to jump back to
		var z = -1; // Cell number of the loop value to read from
		var error = ""; // If any error occurs, send it here
		var input = false; var inputOver = false; // is an input currently being read?
		var iStart = -1; // Start point of the input (in string)
		var b = 0; // Input length
		var inputText = [""];
		var read = 0; // Current position in input text
		var inputCon = "";
		for (var i = 0; i < currCode.length; i++) {
			
			// THE MAGIC STARTS HERE \\
			
			c = currCode[i];
			switch(c) {
				case '"':
					if(!input) {
						if(!inputOver) {
							console.log("input start");
							input = true;
							iStart = i;
						} else {
							error = "Input was already defined";
							break;
						}
					} else {
						console.log("input end");
						inputCon = "";
						for(var l = 0; l < inputText.length; l++) {
							inputCon += inputText[l];
						}
						console.log("input: " + inputCon);
						input = false;
						inputOver = true;
						iStart = -1;
					}
					break;
				case ">":
					console.log("right");
					x++;
					break;
				case "<":
					console.log("left");
					if(x-1 >= 0) {
						x--;
					} else {
						error = "Array pointer is out of bounds";
						break;
					}
					break;
				case "+":
					console.log("plus");
					if(typeof cells[x] === 'undefined') {
						cells[x] = 1;
					} else {
						cells[x]++;
					}
					break;
				case "-":
					console.log("minus");
					if(typeof cells[x] === 'undefined') {
						cells[x] = -1;
					} else {
						cells[x]--;
					}
					break;
				case "[":
					console.log("begin");
					if(y != -1) {
						error = "Unexpected '[': Last loop was not closed";
						break;
					}
					y = i;
					break;
				case "]":
					var end = false;
					if(x == -1) {
						error = "Unexpected ']': No loop was defined";
						break;
					}
					if(typeof cells[x] !== 'undefined') {
						if(cells[x] != 0) {
							i = y;
							console.log("repeat " + y);
							break;
						}
					}
					y = -1;
					z = -1;
					console.log("end");
					break;
				case ",":
					if(!inputOver) {
						error = "No input was defined";
						break;
					} else if(typeof inputText[read] === 'undefined') {
						//error = "Input too short (input length: " + b-1 + ", wanted to read: " + read + ")";
						break;
					}
					cells[x] = inputText[read].charCodeAt();
					console.log("read " + cells[x]);
					read++;
					break;
				case ".":
					console.log("print");
					reply += String.fromCharCode(cells[x]);
					break;
				default:
					if(input) {
						inputText[b] = c;
						b++;
					}
			}
			
			// THE MAGIC ENDS HERE
			
		}
		console.log("-------------------\nPROGRAM END, RESULT:\n-------------------")
		
		if(error != "") {
			reply = "Error at " + i + ": " + error;
		} else if(reply == '') reply = 'no output';
		
		console.log(reply);
		if(inputCon != "")
			message.channel.sendMessage('input: **'+inputCon+'**\n'+'```'+reply+'```');
		else
			message.channel.sendMessage('```'+reply+'```');
	} else if(currMessage[0] == trigger+'help') {
		message.channel.sendMessage('To run a Brainfuck code, type **' + trigger + 'run**!');
	}
});

bot.login(token);