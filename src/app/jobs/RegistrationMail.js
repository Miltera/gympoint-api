import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { student, plan, registration } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Registro de Matricula - Gympoint',
      template: 'registration',
      context: {
        student: student.name,
        planTitle: plan.title,
        start_date: format(
          parseISO(registration.start_date),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(registration.end_date),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        price: plan.price,
        totalPrice: registration.price,
      },
    });
  }
}

export default new RegistrationMail();
