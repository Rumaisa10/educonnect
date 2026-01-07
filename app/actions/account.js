"use server";
import { User } from "@/model/user-model";
import { validatePassword } from "@/queries/users";
import bcrypt from "bcryptjs";

export async function updateUserInfo(email, updatedData) {
  try {
    const filter = { email: email };
    await User.findOneAndUpdate(filter, updatedData);
  } catch (error) {
    throw new Error(error);
  }
}
export async function changePassword(email, oldPassword, newPassword) {
  const isMatch = await validatePassword(email, oldPassword);

  if (!isMatch) {
    throw new Error("please enter valid current password");
  }

  const filter = { email: email };
  const hashedPassword = await bcrypt.hash(newPassword, 5);

  const dataToUpdate = {
    password: hashedPassword,
  };
  try {
    await User.findOneAndUpdate(filter, dataToUpdate);
  } catch (error) {
    throw new Error(error);
  }
}
