process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message);
  console.error(error.stack);
});

process.on("unhandledRejection", (error, promise) => {
  console.error("Unhandled Promise Rejection:", error.message);
  console.error("Promise:", promise);
});

process.stdin.resume();
