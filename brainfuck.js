// A Brainfuck interpreter made in Node JS for Discord
// Why? Why not?

//--Discord.js include
const Discord = require('discord.js'); // discord.js

//--Prepare Bot
const bot = new Discord.Client();

//--Constants
const token = 'YOUR-BOT-TOKEN'; // Put your bot token here
const trigger = 'bf!'; // How commands start
const killDelay = 1000; // Steps before killing an infinite/long loop
const debug = false; // Debug mode

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
		var b = 0; // Input length
		var inputText = [""];
		var read = 0; // Current position in input text
		var inputCon = ""; // Concatenated input string
		var kill = 0; // Steps, to check if loop needs to be killed
		var depth = [-1]; // Loop start points for each depth, -1 for non-existent
		var currDepth = 0; // Code depth, for loops (0 as no loop)
		var searchForEndLoop = -1; // Looking for end loop for x depth (because loop returned 0)
		
		var start = new Date();
		
		for (var i = 0; i < currCode.length; i++) {
			
			// THE MAGIC STARTS HERE \\
			
			c = currCode[i];
			switch(c) {
				case '"':
					if(!input) {
						if(!inputOver) {
							input = true;
						} else {
							error = "Input was already defined";
							break;
						}
					} else {
						inputCon = "";
						for(var l = 0; l < inputText.length; l++) {
							inputCon += inputText[l];
						}
						input = false;
						inputOver = true;
					}
					break;
				case ">":
					if(searchForEndLoop != -1) break;
					x++;
					if(debug) console.log('['+i+'] right, x: ' + x);
					break;
				case "<":
					if(searchForEndLoop != -1) break;
					if(x-1 >= 0) {
						x--;
					} else {
						error = "Array pointer is out of bounds";
						break;
					}
					if(debug) console.log('['+i+'] left, x: ' + x);
					break;
				case "+":
					if(searchForEndLoop != -1) break;
					if(typeof cells[x] === 'undefined') {
						cells[x] = 1;
					} else {
						cells[x]++;
					}
					if(debug) console.log('['+i+'] plus, cell: ' + cells[x]);
					break;
				case "-":
					if(searchForEndLoop != -1) break;
					if(typeof cells[x] === 'undefined') {
						cells[x] = -1;
					}
					cells[x]--;
					if(debug) console.log('['+i+'] minus, cell: ' + cells[x]);
					break;
				case "[":
					if(searchForEndLoop != -1) {
						currDepth++;
						if(debug) console.log('['+i+'] skipping loop, depth: ' + currDepth);
						break;
					}
					if(typeof cells[x] === 'undefined' || cells[x] == 0) {
						currDepth++;
						searchForEndLoop = currDepth;
						if(debug) console.log('['+i+'] starting loop skipping, depth: ' + currDepth);
						break;
					}
					kill = 0;
					currDepth++;
					depth[currDepth] = i;
					if(debug) console.log('['+i+'] loop start, depth: ' + currDepth);
					//y = i;
					break;
				case "]":
					if(currDepth == 0) {
						error = "Unexpected ']': No loop was defined";
						break;
					}
					if(searchForEndLoop != -1) {
						if(currDepth == searchForEndLoop) {
							// Found the paired bracket, close and continue
							searchForEndLoop = -1;
							if(debug) console.log('['+i+'] loop skipped from ' + depth[currDepth] + ' till ' + i);
							depth[currDepth] = -1;
							currDepth--;
							break;
						}
						if(debug) console.log('['+i+'] closing loop, depth ' + currDepth);
						currDepth--;
						break;
					}
					if(typeof cells[x] !== 'undefined') {
						if(cells[x] != 0) {
							if(debug) console.log('['+i+'] jump to ' + depth[currDepth]);
							i = depth[currDepth];
							kill++;
							if(kill >= killDelay) {
								error = "Loop timed out (probably infinite loop?)";
								break;
							}
							break;
						}
					}
					if(debug) console.log('['+i+'] ending loop, depth: ' + currDepth);
					depth[currDepth] = -1;
					currDepth--;
					//y = -1;
					//z = -1;
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
					if(debug) console.log('['+i+'] read: ' + cells[x]);
					read++;
					break;
				case ".":
					reply += String.fromCharCode(cells[x]);
					if(debug) console.log('['+i+'] print: ' + String.fromCharCode(cells[x]));
					break;
				default:
					if(input) {
						inputText[b] = c;
						b++;
					}
			}
			
			if(error != "") {
				if(debug) console.log('['+i+'] error (' + error + ')');
				break;
			}
			
			// THE MAGIC ENDS HERE
			
		}
		
		var end = new Date() - start;
		
		var outSize = reply.length-1;
		
		if(error != "") {
			reply = "Error at " + i + ": " + error;
			outSize = 0;
		} else if(reply == '') {
			reply = 'no output';
			outSize = 0;
		}
		
		
		if(inputCon != "") { // \n-------------------\nOutput: ' + outSize + ' byte(s)
			message.channel.sendMessage('input: **'+inputCon+'**\n'+'```\n'+reply+'\n-------------------\nCode Length: ' + (((currCode.length)-(inputCon.length))-2) + ' byte(s)\nInput: ' + inputCon.length + ' byte(s)\nOutput: ' + outSize + ' byte(s)\nExecution time: ' + end + 'ms```');
		} else
			message.channel.sendMessage('```\n'+reply+'\n-------------------\nCode Length: ' + currCode.length + ' byte(s)\nOutput: ' + outSize + ' byte(s)\nExecution time: ' + end + 'ms```');
		
		if(debug) console.log("---------------------");
	} else if(currMessage[0] == trigger+'help') {
		message.channel.sendMessage('To run a Brainfuck code, type **' + trigger + 'run**!');
	}
});

bot.login(token);