import z from 'zod'

const userSchema = z.object({
  document_type: z.enum(['CC', 'TI', 'CE']),
  document_number: z.number().int().min(1000000),
  first_name: z.string(),
  last_name: z.string(),
  age: z.number().int(),
  birthdate: z.string().date(),
  email: z.string().email(),
  user_password: z.string()
})

export const validateUser = ({ input }) => {
  return userSchema.safeParse(input)
}
