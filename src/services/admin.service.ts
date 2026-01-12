import { User } from "../models/User.model";
import { hashPassword, validatePassword } from "../utils/password";
import { AppError } from "../middleware/error.middleware";

export class AdminService {
  static async createAdmin(adminData: {
    fullName: string;
    email: string;
    password: string;
  }) {
    const { fullName, email, password } = adminData;

    if (!validatePassword(password)) {
      throw new AppError("Weak password", 400);
    }

    const exists = await User.findOne({ email });
    if (exists) {
      throw new AppError("Email already exists", 409);
    }

    const passwordHash = await hashPassword(password);

    await User.create({
      fullName,
      email,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: true
    });

    return { message: "Admin created successfully" };
  }

  static async approveOrganizer(id: string) {
    const user = await User.findById(id);
    if (!user || user.role !== "ORGANIZER") {
      throw new AppError("Organizer not found", 404);
    }

    user.status = "ACTIVE";
    await user.save();

    return { message: "Organizer approved" };
  }
}