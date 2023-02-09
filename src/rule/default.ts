import { Scanner } from "../lib/scanner";
import { MatchResult, RuleBase } from "../base/rule-base";
import { Token } from "@/lib/token";

export class DefaultRule extends RuleBase{ 

    public name:string = "text";

    public type:'block'|'line'= 'block'

    public match(ctx: Scanner):MatchResult{
        return null
    }

    public render(token: Token){
        return null
    }
} 


export const defaultRule  = new DefaultRule()