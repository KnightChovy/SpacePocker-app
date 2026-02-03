import { UserRepository } from "../repository/user.repository";
import { KeyTokenRepository } from "../repository/token.repository";
import KeyTokenService from "../services/keyToken.service";
import AccessService from "../services/access.service";
import AccessController from "../controllers/access.controller";

const userRepo = new UserRepository();
const keyRepo = new KeyTokenRepository();
const keyTokenService = new KeyTokenService(keyRepo);

const accessService = new AccessService(userRepo, keyRepo, keyTokenService);

export const accessController = new AccessController(accessService);
