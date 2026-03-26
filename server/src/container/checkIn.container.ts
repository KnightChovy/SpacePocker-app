import CheckInController from "../controllers/checkIn.controller";
import CheckInService from "../services/checkIn.service";

const checkInService = new CheckInService();
export const checkInController = new CheckInController(checkInService);
