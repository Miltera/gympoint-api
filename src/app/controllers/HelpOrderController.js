import * as Yup from 'yup';

import Student from '../models/Student';
import HelpOrder from '../schemas/HelpOrder';

class HelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'This student does not exists' });
    }

    const help_order = await HelpOrder.create({
      student_id: student.id,
      question: req.body.question,
    });

    return res.json(help_order);
  }

  async index(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'This student does not exists' });
    }

    const help_orders = await HelpOrder.find({
      student_id: student.id,
    });

    return res.json(help_orders);
  }
}

export default new HelpOrderController();
