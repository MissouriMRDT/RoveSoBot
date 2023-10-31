import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

try {
    sequelize.authenticate();
    console.log('DB Connection established successfully');
} catch (e) {
    console.error('Unable to connect to DB: ', e);
}

const Stats = sequelize.define('stats', {
    guild: {
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    trainsDeparted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    PassengersDeparted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});

const Trains = sequelize.define('train', {
    trainType: {
        type: DataTypes.ENUM('lunch', 'party'),
        allowNull: false,
    },
    guild: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    channel: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    members: {
        type: DataTypes.JSON,
    },
    conductor: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    time: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    place: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

(async () => {
    await sequelize.sync(/*{ force: true }*/);
})();

export { Trains, Stats };
