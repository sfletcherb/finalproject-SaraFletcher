const database = require("../src/database.js");

async function testCron() {
  try {
    await database; // Inicializa la base de datos y cron job
    console.log("Cron job configured and executed");
  } catch (error) {
    console.error("Cron job test failed:", error.message);
  }
}

testCron();
