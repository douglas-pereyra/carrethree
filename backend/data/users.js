/**
 * @fileoverview Provides sample user data for seeding the database.
 * This file contains an array of initial administrator users.
 */

// An array of sample user objects.
// This data is used by the seeder script (`utils/seeder.js`) to populate
// the database with initial administrator accounts for testing and setup.
const users = [
  {
    name: 'Douglas Admin',
    email: 'douglas@carrethree.br',
    // IMPORTANT: Passwords are in plain text here ONLY for the seeder.
    // The seeder script (`utils/seeder.js`) will hash them before
    // they are saved to the database.
    password: 'adminpass',
    isAdmin: true,
  },
  {
    name: 'Henrique Admin',
    email: 'henrique@carrethree.br',
    password: 'adminpass',
    isAdmin: true,
  },
  {
    name: 'Nicolas Admin',
    email: 'nicolas@carrethree.br',
    password: 'adminpass',
    isAdmin: true,
  },
];

export default users;