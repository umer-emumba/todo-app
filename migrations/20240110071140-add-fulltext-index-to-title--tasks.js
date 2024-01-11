'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex('tasks', {
      fields: ['title'],
      type: 'FULLTEXT',
      name: 'idx_title_fulltext',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('tasks', 'idx_title_fulltext');
  }
};
