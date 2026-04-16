import { Type, Static } from '@sinclair/typebox';

export const CreateProjectSchema = Type.Object({
    name: Type.String({ minLength: 1 }),
    description: Type.Optional(Type.String()),
    owner: Type.String(), // ObjectId as string
    members: Type.Optional(Type.Array(Type.String()))
});

export type CreateProjectType = Static<typeof CreateProjectSchema>;
