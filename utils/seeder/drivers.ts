import { faker } from '@faker-js/faker';
import Driver from '../../models/driver';
import sequelize from '../../config/sequelize';

async function createRandomDrivers() {
  await Driver.sync({ force: true });
  await Driver.truncate();

  const numDriversToCreate = 150;

  for (let i = 0; i < numDriversToCreate; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const phone = faker.phone.number('+## ### ### ####');

    const driverData = { firstName, lastName, email, phone };
    await Driver.create(driverData);
  }

  console.log(`Total drivers: ${await Driver.count()}`);
}

export default createRandomDrivers;

// Ensure sequelize connection and export
sequelize.sync().then(() => {
  createRandomDrivers()
    .then(() => {
      console.log('Done creating random drivers');
    })
    .catch((error) => {
      console.error('Error creating random drivers:', error);
    });
});
