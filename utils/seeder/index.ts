import sequelize from '../../config/sequelize';
import drivers from './drivers';
import clients from './clients';
import vehicles from './vehicles';
import orders from './orders';

sequelize.sync().then(async () => {
  try {
    await drivers();
    await clients();
    await vehicles();
    await orders();
    console.log('Done');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
});
