'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("user_notifications",{
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
      notification_type:{
        type:Sequelize.ENUM("SMS","EMAIL")
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
      },
      deleted_at:{
        type:Sequelize.DATE,
        allowNull:true,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable("user_notifications")
  }
};
