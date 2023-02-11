import { Token, createToken, updateToken } from "../src";

let token:Token

describe('token工具 测试', () => {
    it('[测试] createToken()', ()=>{
        token = createToken({
            type: 'token',
            content: 'sdfasdf',
            begin: 0,
            end: 1,
        })
        expect(token.type).toBe('token');
        expect(token.content).toBe('sdfasdf');
        expect(token.begin).toBe(0)
        expect(token.end).toBe(1)
        expect(token.prefix).toBeUndefined()
        expect(token.suffix).toBeUndefined()
    })
    it('[测试] updateToken()', ()=>{
        let tokenA = token
        updateToken(tokenA,{
            type: 'head',
            content: '',
        })
        expect(tokenA).toBe(token)
        expect(tokenA.type).toBe('head')
        expect(tokenA.content).toBe('')
        updateToken(tokenA,{
            prefix: '###',
            suffix: '\n',
        })
        expect(token.prefix).toBe('###')
        expect(token.suffix).toBe('\n')
    })
})