import { faker } from '@faker-js/faker';
import Vehicle from '../../models/vehicle';
import sequelize from '../../config/sequelize';

async function createRandomVehicles() {
  await Vehicle.sync({ force: true });
  await Vehicle.truncate();

  const numVehiclesToCreate = 50;

  for (let i = 0; i < numVehiclesToCreate; i++) {
    const licencePlate = faker.helpers.fromRegExp(/[A-Z]{3}-[0-9]{3}/);
    const manufacturer = faker.vehicle.manufacturer();
    let model = faker.vehicle.model();
    const location = faker.address.city();
    const status = faker.helpers.arrayElement(['operational', 'inactive']) as 'operational' | 'inactive';
    const capacity = faker.datatype.number({ min: 1, max: 999 });
    model = `${manufacturer} ${model}`;

    const vehicleData = { licencePlate, model, location, status, capacity };
    await Vehicle.create(vehicleData as Vehicle);
  }

  console.log(`Total vehicles: ${await Vehicle.count()}`);
}

export default createRandomVehicles;

// Ensure sequelize connection and export
sequelize.sync().then(() => {
  createRandomVehicles()
    .then(() => {
      console.log('Done creating random vehicles');
    })
    .catch((error) => {
      console.error('Error creating random vehicles:', error);
    });
});
