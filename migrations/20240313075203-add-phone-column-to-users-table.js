'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'phone', {
      allowNull: true,
      type: Sequelize.STRING(25),
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'phone');
  }
};
