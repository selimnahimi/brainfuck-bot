## A basic discord<span></span>.js bot to run Brainfuck code

*Why? Why not?*

### Links:
* [discord.js on GitHub (required to run)](https://github.com/hydrabolt/discord.js/)
* [Brainfuck on Wikipedia](https://en.wikipedia.org/wiki/Brainfuck)
* [Brainfuck Algorithms](https://esolangs.org/wiki/Brainfuck_algorithms)

### Usage:
* **bf!help** - useless help
* **bf!run "input"code** - execute code

(**Note** that the code works too without any input.)

Examples:
* bf!run ++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.
	* Output: **Hello World!**
* bf!run "Hello World!">,[>,]<[<]>.[>.]
	* Output: **Hello World!**
* bf!run "a"you can+++write anything[-]anywhere>in,the.code
	* Output: **a**

#### You must set your bot token inside the script before running it!

To run the bot, execute it: **node brainfuck.js**