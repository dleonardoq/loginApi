import z from 'zod'

const userLoginSchema = z.object({
  email: z.string().email(),
  user_password: z.string().min(8)
})

export const validateUserLogin = ({ input }) => (
  userLoginSchema.safeParse(input)
)
