// módulos
import { Router } from 'express';

// controllers
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckInController from './app/controllers/CheckInController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerHelpController from './app/controllers/AnswerHelpController';

// middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.post('/students/:id/checkins', CheckInController.store);
routes.get('/students/:id/checkins', CheckInController.index);

routes.post('/students/:id/help-orders', HelpOrderController.store);
routes.get('/students/:id/help-orders', HelpOrderController.index);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);
routes.put('/students/:id', StudentController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/registrations', RegistrationController.index);
routes.post('/registrations/', RegistrationController.store);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.delete);

routes.get('/students/help-orders', AnswerHelpController.index);
routes.post('/help-orders/:id/answer', AnswerHelpController.store);

export default routes;
