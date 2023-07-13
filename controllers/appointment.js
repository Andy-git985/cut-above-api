const appointmentRouter = require('express').Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');

appointmentRouter.get('/', async (req, res) => {
  const appointment = [{ id: 1, date: '10/08/2023', title: 'Airport' }];
  res.status(200).json(appointment);
});

appointmentRouter.post('/', async (req, res) => {
  console.log('post req received');
  console.log('body: ', req.body);
  const { date, start, end, service, employee } = req.body;
  const clientToBook = await User.findOne({ _id: req.user });
  const employeeToBook = await User.findOne({ _id: employee });
  console.log('employee', employeeToBook);
  const newAppt = new Appointment({
    date,
    start,
    end,
    service,
    client: clientToBook,
    employee: employeeToBook,
  });
  await newAppt.save();
  res.status(201).json({
    success: true,
    message: 'Appointment successfully reserved',
    data: newAppt,
  });
});

module.exports = appointmentRouter;
