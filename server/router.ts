import express, {Request, Response} from "express"; 
import controller from './controller';

const router = express.Router();

/**
 * Receives a database URI and, provided that it is valid, responds with an object in the form:
 * { schema: string, resolver: string}
 */
router.post('/submitURI', controller.saveURI, controller.getTableData, controller.getAllColumns, controller.makeSchemas, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.output); 
})

/**
 * Receives username and password strings in request body and establishes user in database.
 */
router.post(
  '/register',
  controller.register,
  controller.setUserCookie,
  (req: Request, res: Response) => {
    console.log('Responding to /register');
    return res.sendStatus(201);
  }
);

/**
 * Receives username and password strings in request body and attempts login using info. 
 */
router.post(
  '/login',
  controller.login,
  controller.setUserCookie,
  (req: Request, res: Response) => {
    console.log('Responding to /login');
    return res.status(200).json(res.locals.user.username);
  }
);

/**
 * Returns the username for a logged in user
 */
router.get('/getUsername', controller.isLoggedIn, (req: Request, res: Response) => {
  console.log('Responding to /getUsername');
  return res.status(200).json(res.locals.username);
});

/**
 * Logs out a user - clears their SSID and username cookies
 */
router.get('/logout', (req: Request, res: Response) => {
  console.log('Responding to /logout');
  return res.clearCookie('SSID').clearCookie('username').sendStatus(204);
});

/**
 * Returns stored URIs for a user. 
 */
router.get('/uris', controller.getUris, (req: Request, res: Response) => {
  console.log('Responding to /uris');
  return res.status(200).json(res.locals.uris);
})

export default router;
