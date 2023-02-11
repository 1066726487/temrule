import { Scanner } from "./lib/scanner";
import { createToken, updateToken } from "./lib/token";
import { options } from "./options";
export class Analysis {
    constructor() {
        // 原字符串类容
        this.src = '';
        // 
        this.options = options;
        // 规则计划
        this.rules = new Map();
    }
    // tokens
    get tokens() {
        const rules = Array.from(this.rules.values());
        return this.tokenize(this.src, rules);
    }
    // 挂载规则
    use(rule) {
        if (this.options.checkRulesName && this.rules.has(rule.name)) {
            console.warn(' Rule: 你设置了一个重名的规则，这可能会导致规则被重写');
        }
        this.rules.set(rule.name, rule);
    }
    // 执行渲染函数
    render() {
        return this.renderToken(this.tokens, 1);
    }
    renderToken(tokens, tier) {
        let renderStr = '';
        tokens.forEach((token) => {
            if (Array.isArray(token.content)) {
                token.content = this.renderToken(token.content, tier + 1);
            }
            const content = token.content;
            if (this.rules.has(token.type)) {
                const rule = this.rules.get(token.type);
                renderStr += rule.render(Object.assign(Object.assign({}, token), { content, tier }));
            }
            else {
                renderStr += content;
            }
        });
        return renderStr;
    }
    tokenize(src, rules) {
        const tokens = [], scanner = new Scanner(src);
        // console.time()
        while (!scanner.isFinish()) {
            let target, skip = 0;
            let nowToken = createToken({
                type: 'text', content: scanner.content,
                begin: scanner.fastPos, end: scanner.slowPos
            });
            scanner.scanUtil((ctx) => {
                updateToken(nowToken, { content: scanner.content, end: scanner.fastPos });
                // 进行规则匹配
                return rules.find((rule) => {
                    // console.time('a')
                    // target = rule.match(ctx)  
                    // console.timeEnd('a');
                    target = rule.match(ctx);
                    if (target !== null) {
                        // 进行规则筛选
                        const nowRule = rules.filter(item => {
                            // 去除exclude中的子规则
                            if (rule.exclude.includes(item.name))
                                return false;
                            // 筛选子规则的 within
                            if (!item.within.includes(rule.name))
                                return false;
                            return true;
                        });
                        // 处理内容
                        const ct = this.tokenize(target.content, nowRule);
                        const content = ct.length === 1 && ct[0].type === 'text' ? target.content : ct;
                        skip = target.entire.length;
                        // 处理当前匹配规则
                        if (rule.type === 'line') {
                            updateToken(nowToken, { content: ct });
                        }
                        else if (rule.type === 'block') {
                            const { entire, prefix, suffix } = target;
                            const type = rule.name, begin = ctx.fastPos, end = begin + entire.length;
                            if (nowToken.begin === nowToken.end) {
                                updateToken(nowToken, { type, content, begin, end, prefix, suffix });
                            }
                            else {
                                tokens.push(nowToken);
                                nowToken = createToken({ type, content, begin, end, prefix, suffix });
                            }
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                }) !== undefined;
            });
            if (skip !== 0)
                scanner.scan(skip);
            if (nowToken.end !== nowToken.begin)
                tokens.push(nowToken);
        }
        // console.timeEnd()
        return tokens;
    }
}
//# sourceMappingURL=analysis.js.map