import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registration } = data;

    await Mail.sendMail({
      to: `${registration.student.name} <${registration.student.email}>`,
      subject: 'Registro de Matricula - Gympoint',
      template: 'registration',
      context: {
        student: registration.student.name,
        planTitle: registration.plan.title,
        start_date: format(
          parseISO(registration.start_date),
          "'dia' dd 'de' MMMM'",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(registration.end_date),
          "'dia' dd 'de' MMMM'",
          {
            locale: pt,
          }
        ),
        price: registration.plan.price,
        totalPrice: registration.price,
      },
    });
  }
}

export default new RegistrationMail();
