export type registerDto = {

    username: string,
    email: string
    password: string
}

export type resRegisterDto = {
        token: string,
    type: string,
    userId: number,
    username: string
}