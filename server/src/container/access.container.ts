import { UserRepository } from "../repository/user.repository";
import { KeyTokenRepository } from "../repository/token.repository";
import KeyTokenService from "../services/keyToken.service";
import AccessService from "../services/access.service";
import AccessController from "../controllers/access.controller";
import MailService from "../services/mail.service";

const userRepo = new UserRepository();
const keyRepo = new KeyTokenRepository();
const keyTokenService = new KeyTokenService(keyRepo);
const mailService = new MailService();

const accessService = new AccessService(
	userRepo,
	keyRepo,
	keyTokenService,
	mailService,
);

export const accessController = new AccessController(accessService);
