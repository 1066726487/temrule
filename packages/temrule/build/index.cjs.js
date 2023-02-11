'use strict';

/**
 * 扫描类，对字符串进行扫描
 */
class Scanner {
    // 扫描区的内容
    get content() {
        return this.src.substring(this.slowPos, this.fastPos);
    }
    // 剩余内容
    get tail() {
        return this.src.substring(this.fastPos);
    }
    // 开指针所指的字符的 Ascll 码
    get fch() {
        return this.src.charCodeAt(this.fastPos);
    }
    constructor(src) {
        // 快指针
        this.fastPos = 0;
        // 慢指针
        this.slowPos = 0;
        // 是否是新的一行， 该行指针扫过的位置没有除空格以外的字符
        this.isNewLine = true;
        // 该行前方缩进
        this.retract = 0;
        this.src = src;
    }
    // 试指针跳过指定长度
    scan(length) {
        this.fastPos += length;
        this.slowPos = this.fastPos;
    }
    /**
     * @fun 使指针进行扫描， check方法返回为true
     * @param check 判别方法。返回true进行类容截取，false 继续继续扫描
     * @returns IscanUtil
     */
    scanUtil(check) {
        // 扫描 结束指针后移
        while (!this.isFinish() && !check(this)) {
            // 动指针后移
            this.fastPos++;
            // 检查换行
            const ch = this.fch;
            const retractAacll = [0x20, /** 空格 */ 0x09, /** 水平制表符 */];
            const enterAacll = [0x0A, /** 换行 */ 0x0B, /** 垂直换行符 **/];
            if (this.isNewLine === true) {
                const before = this.src.charCodeAt(this.fastPos - 1);
                this.isNewLine = [...retractAacll, ...enterAacll].indexOf(before) !== -1;
                // 计算缩进
                switch (true) {
                    case ch === retractAacll[0]:
                        this.retract += 1;
                        break;
                    case ch === retractAacll[1]:
                        this.retract += 4;
                        break;
                }
            }
            else if (enterAacll.indexOf(ch) !== -1) {
                this.isNewLine = true;
                this.retract = 0;
            }
        }
        // 循环结束 慢指针回归
        this.slowPos = this.fastPos;
    }
    // 是否扫描完成了所有内容
    isFinish() {
        return this.fastPos > this.src.length;
    }
}

function createToken(opt) {
    return opt;
}
function updateToken(token, opt) {
    Object.assign(token, opt);
}

const options = {
    checkRulesName: true,
};

class Analysis {
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

class RuleBase {
    constructor() {
        // 排除的子规则
        this.exclude = [];
        // 只在直接父规则中出现 
        this.within = [];
    }
}

exports.RuleBase = RuleBase;
exports.Scanner = Scanner;
exports.Temrule = Analysis;
exports.createToken = createToken;
exports.updateToken = updateToken;
