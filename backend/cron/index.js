const cron = require('node-cron');
const config = require('./config');
const cleanExpiredTokens = require('./jobs/tokenCleaner');

const initCronJobs = () => {
  // Token cleanup job
  if (config.tokenCleanup.enabled) {
    cron.schedule(config.tokenCleanup.schedule, cleanExpiredTokens);
    console.log('Cron de nettoyage des tokens initialisé');
  }

  // d'autres tâches cron ici
};

module.exports = initCronJobs;