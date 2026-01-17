import { User,UserRole,type IUser } from "@/models";
import { AppError } from "@/utils/errors";
import { logger } from "@/utils/logger";


export class AdminService {

    async getAllUsers():Promise<{users: IUser[], total: number}> {
        try {
            
            const users = await  User.find().select("-password -verificationToken -verificationTokenExpiry");

            const total = await User.countDocuments();

            return {
                users,
                total
            }

        } catch (error) {
            logger.error("Error fetching all users:", error);
            throw new AppError("Error fetching users");
        }
    }


    async updateUserRole(userId: string, newRole: UserRole):Promise<IUser> {

        try {

            const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

            if (!user) {
                throw new AppError("User not found");
            }

            return user;


        } catch (error) {
            logger.error("Error updating user role:", error);
            throw new AppError("Error updating user role");
        }

    }


    async addUserCredits(userId: string, creditsToAdd: number):Promise<IUser> {

        try {

            const user = await User.findByIdAndUpdate(userId, { $inc: { credits: creditsToAdd } }, { new: true });

            if (!user) {
                throw new AppError("User not found");
            }

            return user;


            
        } catch (error) {
            logger.error("Error adding user credits:", error);
            throw new AppError("Error adding user credits");
        }
    }


    async deleteUser(userId: string):Promise<void> {
        try {

            const user = await User.findByIdAndDelete(userId);

            if (!user) {
                throw new AppError("User not found");
            }

        } catch (error) {
            logger.error("Error deleting user:", error);
            throw new AppError("Error deleting user");
        }
    }

    async banUser(userId: string,isBanned:boolean):Promise<{user:IUser,isBanned: boolean}> {
        try {

            const user = await User.findByIdAndUpdate(userId, { isActive: isBanned ? 0 : 1}, { new: true });

            if (!user) {
                throw new AppError("User not found");
            }

            return { user,isBanned: !user.isActive };

        } catch (error) {
            logger.error("Error banning user:", error);
            throw new AppError("Error banning user");
        }
    }



}


export const adminService = new AdminService();