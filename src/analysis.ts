import { Scanner } from "./lib/scanner"
import {  RuleBase, MatchResult } from "./base/rule-base"
import { Token, createToken, updateToken } from "./lib/token"

export class Analysis{
    // 原字符串类容
    public src = ''

    // 规则计划
    public rules: RuleBase[] = []

    // tokens
    public get tokens():Token[]{
        return this.tokenize(this.src, this.rules)
    }

    private tokenize(src: string, rules: RuleBase[]){
        const tokens:Token[] = [],
              scanner = new Scanner(src)
        // console.time()
        while(!scanner.isFinish()){
            let target: MatchResult|null,
                skip:number = 0
            let nowToken = createToken({
                type: 'text', content: scanner.content, 
                begin: scanner.fastPos, end: scanner.slowPos
            })

            
            scanner.scanUtil((ctx)=>{
                
                updateToken(nowToken,{content: scanner.content, end: scanner.fastPos})

                // 进行规则匹配
                return rules.find((rule)=>{
                    // console.time('a')
                    // target = rule.match(ctx)  
                    // console.timeEnd('a');

                    target = rule.match(ctx)  
                                      
                    if(target!==null){

                        // 进行规则筛选
                        const nowRule = rules.filter(item=>{
                            // 去除exclude中的子规则
                            if(rule.exclude.includes(item.name)) return false
                            // 筛选子规则的 within
                            if(!item.within.includes(rule.name)) return false
                            return true
                        })
                        

                        // 处理内容
                        const ct = this.tokenize(target.content,nowRule)
                        const content = ct.length===1&&ct[0].type==='text'?target.content:ct
                        skip = target.entire.length
                        
                        // 处理当前匹配规则
                        if(rule.type === 'line'){
                            updateToken(nowToken, {content: ct})
                        }else if(rule.type === 'block'){
                            const {entire, prefix, suffix} = target
                            const type = rule.name, begin = ctx.fastPos, end = begin + entire.length
                            if(nowToken.begin===nowToken.end){
                                updateToken(nowToken,{type, content, begin, end, prefix, suffix})
                            }else{
                                tokens.push(nowToken)
                                nowToken = createToken({type, content,begin, end, prefix, suffix})
                            }
                        }
                        return true
                    }else{
                        return false
                    }
                }) !== undefined
            })

            if(skip!==0) scanner.scan(skip)

            if(nowToken.end!==nowToken.begin) tokens.push(nowToken)
        }
        // console.timeEnd()

        return tokens
    }

    // 挂载规则
    public use(rule: RuleBase){
        const oldIndex = this.rules.findIndex(item=>{
            return item.name === rule.name
        })
        if(oldIndex===-1){
            this.rules.push(rule)
        }else{
            console.warn(' Rule: 你设置了一个重名的规则，这可能会导致旧规则被重写')
            this.rules[oldIndex] = rule
        }
    }
}

