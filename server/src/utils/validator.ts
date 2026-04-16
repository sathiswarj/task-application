import { TSchema } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export const validate = (schema: TSchema, data: any) => {
    const check = TypeCompiler.Compile(schema);
    const isValid = check.Check(data);
    if (!isValid) {
        const errors = [...check.Errors(data)];
        return {
            isValid: false,
            errors: errors.map(err => ({
                path: err.path,
                message: err.message
            }))
        };
    }
    return { isValid: true };
};
