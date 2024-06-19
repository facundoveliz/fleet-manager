import { faker } from '@faker-js/faker';
import { Op } from 'sequelize';
import Order from '../../models/order';
import Client from '../../models/client';
import Vehicle from '../../models/vehicle';
import Driver from '../../models/driver';
import sequelize from '../../config/sequelize';

async function createRandomOrders() {
  await Order.sync({ force: true });
  await Order.truncate();

  const numOrdersToCreate = 200;

  for (let i = 0; i < numOrdersToCreate; i++) {
    const origin = faker.address.city();
    const destination = faker.address.city();
    const distance = faker.datatype.number({ min: 1, max: 100 });
    const status = faker.helpers.arrayElement(['pending', 'transit', 'delivered']) as 'pending' | 'transit' | 'delivered';
    const deliveredAt = faker.date.recent();
    const description = faker.lorem.paragraph();
    const weight = faker.datatype.number({ min: 0.1, max: 1999.9 });

    const sender = await Client.findOne({ where: { clientId: { [Op.gte]: 1 } } });
    const receiver = await Client.findOne({ where: { clientId: { [Op.gte]: 1 } } });
    const vehicle = await Vehicle.findOne({ where: { vehicleId: { [Op.gte]: 1 } } });
    const driver = await Driver.findOne({ where: { driverId: { [Op.gte]: 1 } } });

    if (sender && receiver && vehicle && driver) {
      const orderData = {
        origin,
        destination,
        distance,
        status,
        deliveredAt,
        description,
        weight,
        senderId: sender.clientId,
        receiverId: receiver.clientId,
        vehicleId: vehicle.vehicleId,
        driverId: driver.driverId,
      };

      await Order.create(orderData as Order);
    } else {
      console.log('Could not find necessary records for creating an order.');
    }
  }

  console.log(`Total orders: ${await Order.count()}`);
}

export default createRandomOrders;

// Ensure sequelize connection and export
sequelize.sync().then(() => {
  createRandomOrders()
    .then(() => {
      console.log('Done creating random orders');
    })
    .catch((error) => {
      console.error('Error creating random orders:', error);
    });
});
