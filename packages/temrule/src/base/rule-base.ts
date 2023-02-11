import { Token } from "../lib/token";
import { Scanner } from "../lib/scanner";

export type MatchResult = {
    entire: string, // 匹配到的字符
    content: string, // 类容
    prefix: string|null, // 前缀
    suffix: string|null,  // 后缀
} | null;


export type renderToken = Omit<Token, 'content'>&{
    content: string
    tier: number, //层级 
}

export abstract class RuleBase {

    // 当前规则的 name 
    public abstract name: string;

    // 当前匹配规则的类型
    public abstract type: string;

    // 排除的子规则
    public exclude:string[] = []

    // 只在直接父规则中出现 
    public within:string[] = []

    // 当前规则的开始 匹配法则
    public abstract match(ctx:Scanner):MatchResult

    // 当前规则的渲染法则
    public abstract render(Token: renderToken):string

}