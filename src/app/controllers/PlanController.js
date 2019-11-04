import * as Yup from 'yup';
import { Op } from 'sequelize';

import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .required()
        .integer()
        .moreThan(0),
      price: Yup.number()
        .required()
        .moreThan(0),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const checkExistPlanTitle = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (checkExistPlanTitle) {
      return res
        .status(400)
        .json({ error: 'Plan with the entered title already exists' });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .required()
        .integer()
        .moreThan(0),
      price: Yup.number()
        .required()
        .moreThan(0),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) return res.status(400).json({ error: 'Plan does not exists' });

    const checkExistPlanTitle = await Plan.findOne({
      where: {
        title: req.body.title,
        id: {
          [Op.ne]: plan.id,
        },
      },
    });

    if (checkExistPlanTitle) {
      return res
        .status(400)
        .json({ error: 'Plan with the entered title already exists' });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) return res.status(400).json({ error: 'Plan does not exists' });

    plan.destroy();

    return res.status(200).json({ sucess: 'The Plan has been deleted' });
  }
}

export default new PlanController();
