import { faker } from '@faker-js/faker';
import Client from '../../models/client';
import sequelize from '../../config/sequelize';

async function createRandomClients() {
  await Client.sync({ force: true });
  await Client.truncate();

  const numClientsToCreate = 100;

  for (let i = 0; i < numClientsToCreate; i++) {
    const company = faker.company.name();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const phone = faker.phone.number('+## ### ### ####');
    const email = faker.internet.email();

    const clientData = { company, firstName, lastName, phone, email };
    await Client.create(clientData as Client);
  }

  console.log(`Total clients: ${await Client.count()}`);
}

export default createRandomClients;

// Ensure sequelize connection and export
sequelize.sync().then(() => {
  createRandomClients()
    .then(() => {
      console.log('Done creating random clients');
    })
    .catch((error) => {
      console.error('Error creating random clients:', error);
    });
});
