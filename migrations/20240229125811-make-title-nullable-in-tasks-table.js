'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('tasks', 'title', {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true, 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('tasks', 'title', {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
    });
  }
};
