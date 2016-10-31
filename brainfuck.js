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
		var currCode;
		var con = "";
		var reply = "";
		// Concatenate the command for easier running
		for(var i = 1; i < currMessage.length; i++) {
			con += currMessage[i];
		}
		// Make the currCode into an array of each character
		currCode = con.split("");
		// Check each character in the code
		var cells = [0]; // Cells the interpreter works in
		var c; // Current character
		var x = 0; // Current position in the array
		var y = -1; // (Character) start position of the current loop
		var z = -1; // Cell number of the loop value to read from
		var error = ""; // If any error occurs, send it here
		for (var i = 0; i < currCode.length; i++) {
			
			// THE MAGIC STARTS HERE \\
			
			c = currCode[i];
			switch(c) {
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
					z = x;
					break;
				case "]":
					console.log("end");
					if(z == -1) {
						error = "Unexpected ']': No loop was defined";
						break;
					}
					if(cells[z] != 0) {
						i = y;
					} else {
						y = -1;
						z = -1;
					}
					break;
				case ".":
					console.log("print");
					reply += String.fromCharCode(cells[x]);
					break;
			}
			
			// THE MAGIC ENDS HERE
			
		}
		console.log("-------------------\nPROGRAM END, RESULT:\n-------------------")
		
		if(error != "") {
			reply = "Error at " + i + ": " + error;
		} else if(reply == '') reply = 'no output';
		
		console.log(reply);
		message.channel.sendMessage('```'+reply+'```');
	} else if(currMessage[0] == trigger+'help') {
		message.channel.sendMessage('To run a Brainfuck code, type **' + trigger + 'run**!');
	}
});

bot.login(token);