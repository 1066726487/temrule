import { Scanner } from "@/lib/scanner"
import { ParseResult, RuleBase } from "@/rule/base"
import { heading } from "@/rule/heading"
import { Token, createToken, updateToken } from "@/lib/token"

export const sysRules:RuleBase[] = [heading]

export class Analysis{
    public rules: RuleBase[]

    constructor(){
        this.rules = sysRules
    }

    public toTokens(src: string):Token[]{
        const tokens:Token[] = [],
              scanner = new Scanner(src)
        // console.time()
        while(!scanner.isFinish()){
            let target: ParseResult|null,
                skip:number = 0

            tokens.push(createToken({
                type: 'text', content: scanner.content, 
                begin: scanner.beginPos, end: scanner.endPos
            }))

            scanner.scanUtil((ctx)=>{
                const newToken = tokens[tokens.length-1]
                updateToken(newToken,{content: scanner.content, end: scanner.endPos})

                // 进行规则匹配
                return this.rules.find((rule)=>{
                    
                    target = rule.match(ctx)

                    if(target!==null){
                        // 处理匹配的内容
                        const ct = this.toTokens(target.content)
                        const content = ct.length===1&&ct[0][0]==='text'?target.content:ct 
                        
                        // 处理当前匹配规则
                        if(rule.type === 'line'){
                            updateToken(tokens[tokens.length-1], {content: ct})
                        }else if(rule.type === 'block'){
                            // 处理成为token
                            const {entire, prefix, suffix} = target
                            const type = rule.name, begin = ctx.endPos, end = begin + entire.length
                            if(newToken[1]===''&&newToken[2]===newToken[3]){
                                updateToken(newToken,{type, content, begin, end, prefix, suffix})
                            }else{
                                tokens.push(createToken({type, content,begin, end, prefix, suffix}))
                            }
                        }
                        skip = target.entire.length

                        return true
                    }else{
                        return false
                    }
                }) !== undefined
            })

            if(skip!==0) scanner.scan(skip)
        }
        // console.timeEnd()

        return tokens
    }

}

