export type Token = [
    string, // type
    string|Token[], // content
    number, // begin
    number, // end
    string|null, // prefix
    string|null, // suffix
] 

export type TokenOptions = {
    type: string,
    content: string|Token[],
    begin: number,
    end: number
    prefix?: string|null,
    suffix?: string|null,
}

export function createToken(opt: TokenOptions):Token{
    const {type, content,begin, end, prefix, suffix} = opt
    return [
        type, 
        content, 
        begin, 
        end, 
        prefix||null, 
        suffix||null, 
    ]
}

export function updateToken(token:Token, opt: Partial<TokenOptions>){
    const {type, content,begin, end, prefix, suffix} = opt
    token[0] = type || token[0]
    token[1] = content || token[1]
    token[2] = begin || token[2]
    token[3] = end || token[3]
    token[4] = prefix || token[4]
    token[5] = suffix || token[5]
}