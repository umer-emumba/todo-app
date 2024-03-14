'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('tasks', 'task_type', {
        type: Sequelize.ENUM("TEXT","HTML"),
        defaultValue:"TEXT"
      },{
        transaction
      });

      await queryInterface.addColumn('tasks', 'template_url', {
        type: Sequelize.STRING(255),
      },{
        transaction
      });

      await transaction.commit();

    }catch(err){
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('tasks', 'task_type');
      await queryInterface.removeColumn('tasks', 'template_url');

      await transaction.commit();
    }catch(error){
      await transaction.rollback();
      throw error;
    }
  }
};
