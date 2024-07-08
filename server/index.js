const express = require('express');
const bodyParser = require('body-parser');
const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation
} = require('./db');

const app = express();
app.use(bodyParser.json());

app.get('/api/customers', async (req, res) => {
  const customers = await fetchCustomers();
  res.json(customers);
});

app.get('/api/restaurants', async (req, res) => {
  const restaurants = await fetchRestaurants();
  res.json(restaurants);
});

app.get('/api/reservations', async (req, res) => {
  const result = await client.query('SELECT * FROM reservations');
  res.json(result.rows);
});

app.post('/api/customers/:id/reservations', async (req, res) => {
  const { id } = req.params;
  const { restaurant_id, date, party_count } = req.body;
  const reservation = await createReservation(date, party_count, restaurant_id, id);
  res.status(201).json(reservation);
});

app.delete('/api/customers/:customer_id/reservations/:id', async (req, res) => {
  const { id } = req.params;
  await destroyReservation(id);
  res.status(204).send();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'An error occurred' });
});

const init = async () => {
    try {
      console.log('Connecting to the database...');
      await client.connect();
      console.log('Connected to the database.');
  
      console.log('Creating tables...');
      await createTables();
      console.log('Tables created.');
  
      console.log('Creating test data...');
      const customer = await createCustomer('John Doe');
      console.log('Created Customer:', customer);
  
      const restaurant = await createRestaurant('Acme Diner');
      console.log('Created Restaurant:', restaurant);
  
      const customers = await fetchCustomers();
      console.log('Customers:', customers);
  
      const restaurants = await fetchRestaurants();
      console.log('Restaurants:', restaurants);
  
      const reservation = await createReservation('2024-12-31', 4, restaurant.id, customer.id);
      console.log('Created Reservation:', reservation);
  
      app.listen(3000, () => {
        console.log('Server is running on port 3000');
      });
    } catch (error) {
      console.error('Initialization error:', error);
    }
  };
  
  init();
  
