const routes = require('./routes');

/**
 * Register all server routes.
 * @param {Object} server - Hapi server instance.
 */
function registerRoutes(server) {
    routes.forEach(route => server.route(route));
}

module.exports = { registerRoutes };