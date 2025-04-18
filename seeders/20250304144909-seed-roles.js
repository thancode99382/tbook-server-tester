'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles', [
      { name: 'ADMIN', createdAt: new Date() , updatedAt: new Date()},
      { name: 'USER', createdAt: new Date(), updatedAt: new Date()}
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Roles', {
      name: ['ADMIN', 'USER']
    }, {})
  }
};
