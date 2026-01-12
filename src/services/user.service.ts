import { User } from "../models/User.model";
import { hashPassword, validatePassword } from "../utils/password";
import { AppError } from "../middleware/error.middleware";

export class UserService {
  static async getUser(id: string) {
    const user = await User.findById(id).select("-passwordHash");
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  static async getAllUsers(currentUserRole: string) {
    let filter = {};
    if (currentUserRole === "ADMIN") {
      filter = { role: "ORGANIZER" };
    }
    
    return await User.find(filter).select("-passwordHash");
  }

  static async updateUser(
    id: string, 
    updateData: any, 
    currentUserId: string, 
    currentUserRole: string
  ) {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Permission check
    if (currentUserRole === "ORGANIZER" && id !== currentUserId) {
      throw new AppError("Unauthorized", 403);
    }
    if (currentUserRole === "ADMIN" && user.role !== "ORGANIZER") {
      throw new AppError("Unauthorized", 403);
    }

    // Remove password from update data
    const { password, passwordHash, ...cleanUpdateData } = updateData as any;

    Object.assign(user, cleanUpdateData);
    await user.save();

    const userObj = user.toObject() as any;
    const { passwordHash: _, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
  }

  static async updatePassword(
    id: string,
    newPassword: string,
    currentUserId: string,
    currentUserRole: string
  ) {
    if (!validatePassword(newPassword)) {
      throw new AppError("Weak password", 400);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Permission check
    if (currentUserRole !== "SUPER_ADMIN" && id !== currentUserId) {
      throw new AppError("Unauthorized", 403);
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    return { message: "Password updated successfully" };
  }

  static async deleteUser(id: string, currentUserRole: string) {
    if (currentUserRole !== "SUPER_ADMIN") {
      throw new AppError("Unauthorized", 403);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === "SUPER_ADMIN") {
      throw new AppError("Cannot delete super admin", 403);
    }

    await User.findByIdAndDelete(id);
    return { message: "User deleted successfully" };
  }
}