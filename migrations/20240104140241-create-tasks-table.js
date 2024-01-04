'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("tasks",{
      id:{
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        type:Sequelize.INTEGER
      },
      user_id:{
        type:Sequelize.INTEGER,
        references:{
          model:"users",
          key:"id"
        },
        onUpdate:"CASCADE",
        onDelete:"CASCADE"
      },
      title:{
        type:Sequelize.STRING(255),
        allowNull:false,
      },
      description:{
        type:Sequelize.TEXT,
      },
      due_at:{
        type:Sequelize.DATE,
      },
      completed_at:{
        type:Sequelize.DATE,
      },
      is_completed:{
        type:Sequelize.TINYINT,
        defaultValue:0
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
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable("tasks")
  }
};
