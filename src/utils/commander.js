const { Command } = require("commander");

const program = new Command();

//program let set up the arguments
program
  .option("-p <port>", "Port where initialize the server", 8080)
  .option("--mode <mode>", "mode of work", "production");
program.parse();

// testing
//console.log("options", program.opts());

module.exports = program;
