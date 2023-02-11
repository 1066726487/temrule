export type Token = {
    type: string;
    content: string | Token[];
    begin: number;
    end: number;
    prefix?: string | null;
    suffix?: string | null;
};
export declare function createToken(opt: Token): Token;
export declare function updateToken(token: Token, opt: Partial<Token>): void;
