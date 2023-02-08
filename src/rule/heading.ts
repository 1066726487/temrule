import { Scanner } from "@/lib/scanner";
import { ParseResult, RuleBase } from "./base";

export class Heading extends RuleBase{ 

    public name:string = "heading";

    public type:'block'|'line'= 'block'

    public match(ctx: Scanner):ParseResult|null{
        const c = ctx.tail.match(/^(#{1,6}\s)(.*)(\n)/)
        if(c!==null){
            return {entire: c[0], prefix: c[1],content: c[2], suffix: c[3]}
        }else{
            return null
        }
    }
} 

export const heading = new Heading()