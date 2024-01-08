'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("users",{
      id:{
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        type:Sequelize.INTEGER
      },
      email:{
        type:Sequelize.STRING(255),
        allowNull:false,
        unique:true,
      },
      password:{
        type:Sequelize.STRING(255),
      },
      social_media_token:{
        type:Sequelize.STRING(255),
        unique:true,
      },
      social_media_platform:{
        type:Sequelize.ENUM("GOOGLE","FACEBOOK","APPLE")
      },
      email_verified_at:{
        type:Sequelize.DATE
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
    await queryInterface.dropTable("users")
  }
};
