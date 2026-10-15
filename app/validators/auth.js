import vine from '@vinejs/vine';
export const registerValidator = vine.compile(vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email().normalizeEmail().maxLength(255),
    password: vine.string().minLength(8).maxLength(180),
}));
export const loginValidator = vine.compile(vine.object({
    // Must match registerValidator's normalization (dots/+tags stripped,
    // lowercased) -- otherwise a user who registers as
    // "John.Doe+x@gmail.com" gets stored as "johndoe@gmail.com" but can
    // never log back in typing the address they actually used to sign up.
    email: vine.string().trim().email().normalizeEmail().maxLength(255),
    password: vine.string().maxLength(180),
}));
//# sourceMappingURL=auth.js.map