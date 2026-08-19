import {User} from '../../user/Entity/user.entity';
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export { };