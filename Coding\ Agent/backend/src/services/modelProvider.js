/**
 * Model Provider Service - Provider abstraction and routing
 */
const { Pool } = require('pg');

const modelRegistry = {};

const registerProvider = async (name, config) => {
  modelRegistry[name] = {
    ...config,
    registeredAt: new Date(),
    status: 'active',
  };
  return { success: true, name };
};

const getProviderStatus = () => {
  return Object.keys(modelRegistry).map(name => ({
    name,
    status: modelRegistry[name].status,
    registeredAt: modelRegistry[name].registeredAt,
  }));
};

module.exports = { registerProvider, getProviderStatus };