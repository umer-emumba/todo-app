'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
      try {
        // Adding Index: Count of Total/Completed/Remaining Tasks
        await queryInterface.addIndex('tasks', 
        ['user_id', 'is_completed'],
        { name: 'idx_user_completed',transaction });
    
        // Adding Index: Average Tasks Completed Per Day
        await queryInterface.addIndex('tasks', 
        ['user_id', Sequelize.literal('(DATE(completed_at))')],
        { name: 'idx_user_completed_at' ,transaction});
    
        await queryInterface.addIndex('tasks', 
        [ Sequelize.literal('(DATE(completed_at))')],
        { name: 'idx_completed_at' ,transaction});
    
          // Adding Index: Count of Overdue Tasks
        await queryInterface.addIndex('tasks', 
        ['user_id', Sequelize.literal('(DATE(due_at))')],
        { name: 'idx_user_due_at',transaction });
    
        await queryInterface.addIndex('tasks', 
        [ Sequelize.literal('(DATE(due_at))')],
        { name: 'idx_due_at',transaction });
    
        // Adding Index: Maximum Tasks Completed in a Single Day
        await queryInterface.addIndex('tasks', 
        ['user_id',  Sequelize.literal('(DATE(created_at))')],
        { name: 'idx_user_created_at',transaction });
    
        // Adding Index: Tasks Created by Day of the Week
        await queryInterface.addIndex('tasks',
        [ Sequelize.literal('(DATE(created_at))')],
        { name: 'idx_created_at',transaction });

        // Commit the transaction
        await transaction.commit();
      }catch(error){
        // Rollback the transaction if any part of it fails
        console.log({error})
        await transaction.rollback();
        throw error;
      }

},

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();


      try {
          queryInterface.removeIndex('tasks', 'idx_user_completed',{transaction});
          queryInterface.removeIndex('tasks', 'idx_user_completed_at',{transaction});
          queryInterface.removeIndex('tasks', 'idx_completed_at',{transaction});
          queryInterface.removeIndex('tasks', 'idx_user_due_at',{transaction});
          queryInterface.removeIndex('tasks', 'idx_due_at',{transaction});
          queryInterface.removeIndex('tasks', 'idx_user_created_at',{transaction});
          queryInterface.removeIndex('tasks', 'idx_created_at',{transaction});
          // Commit the transaction
         await transaction.commit();
        }catch(error){
          // Rollback the transaction if any part of it fails
          await transaction.rollback();
          throw error;
        }

}
};
