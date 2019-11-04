import * as Yup from 'yup';
import { startOfDay, parseISO, isBefore, addMonths } from 'date-fns';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const studentExists = await Student.findByPk(student_id);
    if (!studentExists) {
      return res.status(400).json({ error: 'Student not exists' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan not exists' });
    }

    const dayStart = startOfDay(parseISO(start_date));
    const actualDate = new Date();

    if (isBefore(dayStart, startOfDay(actualDate))) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const studentsHasRegistration = await Registration.findOne({
      where: { student_id },
    });

    if (studentsHasRegistration) {
      return res
        .status(400)
        .json({ error: 'This student has a registration already' });
    }

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date: dayStart,
      end_date: addMonths(dayStart, plan.duration),
      price: plan.price * plan.duration,
    });

    const dataRegistration = await Registration.findByPk(registration.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'price'],
        },
      ],
    });

    await Queue.add(RegistrationMail.key, {
      dataRegistration,
    });

    return res.json(dataRegistration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { plan_id, start_date } = req.body;

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan not exists' });
    }

    const registration = await Registration.findByPk(req.params.id);

    const dayStart = startOfDay(parseISO(start_date));

    if (isBefore(dayStart, startOfDay(registration.start_date))) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    await registration.update({
      plan_id,
      start_date: dayStart,
      end_date: addMonths(dayStart, plan.duration),
      price: plan.price * plan.duration,
    });

    return res.json(registration);
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ error: 'Registration not found' });
    }

    await registration.destroy();

    return res.status(200).json({ sucess: 'Registration has been removed' });
  }

  async index(req, res) {
    const { student_id } = req.query;

    const registration = await Registration.findAll({
      where: { student_id },
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'age'],
        },
        {
          model: Plan,
          attributes: ['title', 'duration'],
        },
      ],
    });

    return res.json(registration);
  }
}

export default new RegistrationController();
