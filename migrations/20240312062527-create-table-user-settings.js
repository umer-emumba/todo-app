'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("user_settings",{
      id:{
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        type:Sequelize.INTEGER
      },
      user_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique:true,
        references:{
          model:"users",
          key:"id"
        },
        onUpdate:"CASCADE",
        onDelete:"CASCADE"
      },
      pending_task_title:{
        type:Sequelize.STRING(50),
        defaultValue:"Pending Tasks",
        allowNull:false
      },
      completed_task_title:{
        type:Sequelize.STRING(50),
        defaultValue:"Completed Tasks",
        allowNull:false
      },
      created_at:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at:{
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")
      }

    });

     // Populate the new table with data for existing users
      await queryInterface.sequelize.query(
          `INSERT INTO user_settings (user_id) SELECT id FROM users`
      );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("user_settings")
  }
};
