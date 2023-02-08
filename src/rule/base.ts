import { Scanner } from "@/lib/scanner";

export type ParseResult = {
    entire: string, // 匹配到的字符
    content: string, // 类容
    prefix: string|null, // 前缀
    suffix: string|null,  // 后缀
}


export abstract class RuleBase{

    // 当前规则的 name 
    public abstract name:string;

    // 当前匹配规则的类型 
    public abstract type: 'block' | 'line'

    // 当前规则的开始 匹配法制
    public abstract match(ctx:Scanner):ParseResult|null;

}