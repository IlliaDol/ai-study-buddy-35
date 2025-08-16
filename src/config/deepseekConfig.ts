// This script sets the DeepSeek Reasoner as the default AI provider
// and configures the API key in localStorage

// Set the provider to DeepSeek
localStorage.setItem('AI_PROVIDER', 'deepseek');

// Set the API key
localStorage.setItem('AI_API_KEY', 'sk-873aa4e64465474dbc28026efb69f2d5');

// Enable API proxy usage if deployed
window.__USE_PROXY__ = window.location.hostname !== 'localhost';

console.log('DeepSeek Reasoner configuration initialized successfully');
