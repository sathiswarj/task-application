import { Type, Static } from '@sinclair/typebox';

export const SignupSchema = Type.Object({
    username: Type.String({ minLength: 3 }),
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 6 }),
    role: Type.Optional(Type.Union([Type.Literal('admin'), Type.Literal('member')])),
    workspaceName: Type.Optional(Type.String())
});

export const LoginSchema = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String()
});

export type SignupType = Static<typeof SignupSchema>;
export type LoginType = Static<typeof LoginSchema>;
