'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const transaction = await queryInterface.sequelize.transaction();
      try {
        await queryInterface.addColumn('users', 'deleted_at', {
          allowNull: true,
          type: Sequelize.DATE,
        },{
          transaction
        });

        await queryInterface.addColumn('tasks', 'deleted_at', {
          allowNull: true,
          type: Sequelize.DATE,
        },{
          transaction
        });

        await queryInterface.addColumn('task_attachments', 'deleted_at', {
          allowNull: true,
          type: Sequelize.DATE,
        },{
          transaction
        });



        await queryInterface.addIndex('users', ['deleted_at'],{
          transaction
        });
        await queryInterface.addIndex('tasks', ['deleted_at'],{
          transaction
        });
        await queryInterface.addIndex('task_attachments', ['deleted_at'],{
          transaction
        });

        await transaction.commit();


      }catch(error){
        await transaction.rollback();
        throw error;
      }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
      try {
        await queryInterface.removeColumn('users', 'deleted_at');
        await queryInterface.removeColumn('tasks', 'deleted_at');
        await queryInterface.removeColumn('task_attachments', 'deleted_at');

        await transaction.commit();
      }catch(error){
        await transaction.rollback();
        throw error;
      }
  }
};
