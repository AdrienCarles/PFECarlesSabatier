import cron from 'node-cron';
import config from './config.js';
import cleanExpiredTokens from './jobs/tokenCleaner.js';

const initCronJobs = () => {
  // Token cleanup job
  if (config.tokenCleanup.enabled) {
    cron.schedule(config.tokenCleanup.schedule, cleanExpiredTokens);
    console.log('Cron de nettoyage des tokens initialisé');
  }

  // d'autres tâches cron ici
};

export default initCronJobs;