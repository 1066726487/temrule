
export type Token= {
    type: string,
    content: string|Token[],
    begin: number,
    end: number,
    prefix?: string,
    suffix?: string,
}

export function createToken(opt: Token):Token{
    return opt
}

export function updateToken(token:Token, opt: Partial<Token>){
    Object.assign(token, opt)
}