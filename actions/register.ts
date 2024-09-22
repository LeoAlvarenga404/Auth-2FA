"use server";
import * as z from 'zod'
import { RegisterSchema } from '@/schemas';
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';

export async function register(values: z.infer<typeof RegisterSchema>)  {
  const validatedFields = RegisterSchema.safeParse(values)
  
  if(!validatedFields.success) {
    return { error: "Invalid fields!" };
}
  const { name, email, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: "Email already in use!"}
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })


  return { success: "Your account has been created!"}
} 