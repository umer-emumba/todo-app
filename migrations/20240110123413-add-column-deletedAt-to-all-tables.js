'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     const transaction = await queryInterface.sequelize.transaction();
      try {
        await queryInterface.addColumn('users', 'deletedAt', {
          allowNull: true,
          type: Sequelize.DATE,
        },{
          transaction
        });

        await queryInterface.addColumn('tasks', 'deletedAt', {
          allowNull: true,
          type: Sequelize.DATE,
        },{
          transaction
        });

        await queryInterface.addColumn('task_attachments', 'deletedAt', {
          allowNull: true,
          type: Sequelize.DATE,
        },{
          transaction
        });



        await queryInterface.addIndex('users', ['deletedAt'],{
          transaction
        });
        await queryInterface.addIndex('tasks', ['deletedAt'],{
          transaction
        });
        await queryInterface.addIndex('task_attachments', ['deletedAt'],{
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
        await queryInterface.removeColumn('users', 'deletedAt');
        await queryInterface.removeColumn('tasks', 'deletedAt');
        await queryInterface.removeColumn('task_attachments', 'deletedAt');

        await transaction.commit();
      }catch(error){
        await transaction.rollback();
        throw error;
      }
  }
};
