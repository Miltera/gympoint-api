import Mail from '../../lib/Mail';

class AnswerQuestionMail {
  get key() {
    return 'AnswerQuestionMail';
  }

  async handle({ data }) {
    const { student, help_order } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Resposta do Contato pelo app - Gympoint',
      template: 'answer_question',
      context: {
        student: student.name,
        question: help_order.question,
        answer: help_order.answer,
      },
    });
  }
}

export default new AnswerQuestionMail();
