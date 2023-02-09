export interface IscanUtil {
    content: string;
    begin: number;
    end: number;
}

/**
 * 扫描类，对字符串进行扫描
 */
export class Scanner{
    // 原字符串类容
    public src: string;
    // 快指针
    public fastPos: number = 0;
    // 慢指针
    public slowPos: number = 0;
    // 是否是新的一行， 该行指针扫过的位置没有除空格以外的字符
    public isNewLine: boolean = true
    // 该行前方缩进
    public retract: number = 0

    // 扫描区的内容
    public get content(){
        return this.src.substring(this.slowPos,this.fastPos)
    }
    // 剩余内容
    public get tail(){
        return this.src.substring(this.fastPos)
    }
    // 开指针所指的字符的 Ascll 码
    public get fch(){
        return this.src.charCodeAt(this.fastPos)
    }


    constructor(src: string){
        this.src = src
    }

    // 试指针跳过指定长度
    public scan(length: number){
        this.fastPos += length
        this.slowPos  = this.fastPos
    }
 
    /**
     * @fun 使指针进行扫描， check方法返回为true
     * @param check 判别方法。返回true进行类容截取，false 继续继续扫描
     * @returns IscanUtil
     */
    public scanUtil(check: (ctx: Scanner)=>boolean){
        // 扫描 结束指针后移
        while(!this.isFinish()&&!check(this)){
            // 动指针后移
            this.fastPos ++
        
            // 检查换行
            const ch = this.fch
            const retractAacll = [ 0x20, /** 空格 */ 0x09, /** 水平制表符 */]
            const enterAacll = [ 0x0A, /** 换行 */ 0x0B, /** 垂直换行符 **/]

            if(this.isNewLine===true){
                const before = this.src.charCodeAt(this.fastPos - 1)
                this.isNewLine = [...retractAacll,...enterAacll].indexOf(before) !== -1
                // 计算缩进
                switch(true){
                    case ch === retractAacll[0]:
                        this.retract += 1
                        break;
                    case ch === retractAacll[1]:
                        this.retract += 4
                        break
                    default:;
                }
            }else if(enterAacll.indexOf(ch)!==-1){
                this.isNewLine = true
                this.retract = 0
            }
        }
        // 循环结束 慢指针回归
        this.slowPos = this.fastPos
    }

    // 是否扫描完成了所有内容
    public isFinish(){
        return this.fastPos > this.src.length
    }
}