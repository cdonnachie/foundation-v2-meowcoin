/*
 *
 * Example (Main)
 *
 */

// Main Configuration
////////////////////////////////////////////////////////////////////////////////

// Miscellaneous Configuration
const config = {};
config.language = 'english';
config.identifier = '';

// Logger Configuration
config.logger = {};
config.logger.logColors = true;
config.logger.logLevel = 'log';

// Clustering Configuration
config.clustering = {};
config.clustering.enabled = true;
config.clustering.forks = 'auto';

// Database Configuration (SQL)
config.client = {};
config.client.tls = false;

// Master Database
config.client.master = {};
config.client.master.host = '127.0.0.1';
config.client.master.port = 5432;
config.client.master.username = 'blinkhash';
config.client.master.password = 'password';
config.client.master.database = 'foundation';

// Worker Database
config.client.worker = {};
config.client.worker.host = '127.0.0.1';
config.client.worker.port = 5432;
config.client.worker.username = 'blinkhash';
config.client.worker.password = 'password';
config.client.worker.database = 'foundation';

// TLS Configuration
config.tls = {};
config.tls.ca = '';
config.tls.key = '';
config.tls.cert = '';

// Export Configuration
module.exports = config;
