import Sequelize from 'sequelize'

const sequelize = new Sequelize(
  process.env.RINGCENTRAL_CHATBOT_DATABASE_CONNECTION_URI,
  {
    operatorsAliases: false,
    define: {
      timestamps: true
    },
    logging: false
  }
)

export default sequelize
