const scheduleRouter = require('express').Router();
const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const date = require('../utils/date');

scheduleRouter.get('/', async (req, res) => {
  const schedule = await Schedule.find({}).populate(
    'appointments',
    'start end client employee service status'
  );
  res.json(schedule);
});

scheduleRouter.post('/', async (req, res) => {
  const { dates, open, close } = req.body;
  const dateRangeToSchedule = date.generateRange(dates, open, close);
  const newSchedules = dateRangeToSchedule
    .map((schedule) => new Schedule(schedule))
    .map((newSchedule) => newSchedule.save());
  await Promise.all(newSchedules);
  res.status(201).json({
    message: 'New schedule added',
    data: newSchedules,
  });
});

scheduleRouter.put('/:id', async (req, res) => {
  const { appointment } = req.body;
  const bookedAppt = await Appointment.findOne({ _id: appointment });
  const schedule = await Schedule.findOne({ _id: req.params.id });
  schedule.appointments.push(bookedAppt);
  await schedule.save();

  res
    .status(200)
    .json({ success: true, message: 'Schedule updated', data: schedule });
});

module.exports = scheduleRouter;
