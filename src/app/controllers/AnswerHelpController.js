// import Student from '../models/Student';
import HelpOrder from '../schemas/HelpOrder';

class AnswerHelpController {
  async store(req, res) {
    const help_order = await HelpOrder.findByIdAndUpdate(
      req.params.id,
      { answer: req.body.answer, answer_at: new Date() },
      { new: true }
    );

    return res.json(help_order);
  }

  async index(req, res) {
    const noAnsweredHelps = await HelpOrder.find({
      answer: null,
    });

    return res.json(noAnsweredHelps);
  }
}

export default new AnswerHelpController();
