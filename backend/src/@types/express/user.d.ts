import { UserEntity } from '../../user/Entity/user.entity';
declare global {
    namespace Express {
        interface Request {
            user?: UserEntity;
        }
    }
}
export { };
