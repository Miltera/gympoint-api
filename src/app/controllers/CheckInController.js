import { Op } from 'sequelize';
import { startOfDay, endOfDay, subDays, addDays } from 'date-fns';

import Student from '../models/Student';
import Registration from '../models/Registration';
import CheckIn from '../schemas/CheckIn';

class CheckInController {
  async index(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'This student does not exists' });
    }

    const checkins = await CheckIn.find({
      student_id: student.id,
    })
      .sort({ createdAt: 'desc' })
      .limit(5);

    return res.json(checkins);
  }

  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'This student does not exists' });
    }

    const today = startOfDay(new Date());

    const registration = await Registration.findOne({
      where: {
        student_id: student.id,
        start_date: {
          [Op.lte]: today,
        },
        end_date: {
          [Op.gte]: today,
        },
      },
    });

    if (!registration) {
      return res
        .status(401)
        .json({ error: 'The student does not have an active registration' });
    }

    const lastDayCheckin = subDays(today, 7);

    const checkins = await CheckIn.find({
      student_id: student.id,
    })
      .gte('createdAt', startOfDay(lastDayCheckin))
      .lte('createdAt', endOfDay(today))
      .countDocuments();

    if (checkins >= 5) {
      return res.status(400).json({
        error: `Limit exceeded, You can only do 5 check-ins every 7 days. Next checkin avaliable in ${addDays(
          lastDayCheckin,
          8
        )}`,
      });
    }

    const checkIn = await CheckIn.create({
      student_id: student.id,
    });

    return res.json(checkIn);
  }
}

export default new CheckInController();
