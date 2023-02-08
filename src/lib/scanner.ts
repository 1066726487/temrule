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
    // 动指针
    public beginPos: number = 0;
    // 定指针
    public endPos: number = 0;
    // 是否是新的一行， 该行指针扫过的位置没有除空格以外的字符
    public isNewLine: boolean = true
    // 该行前方缩进
    public retract: number = 0

    // 扫描区的内容
    public get content():string{
        return this.src.substring(this.beginPos,this.endPos)
    }
    // 剩余内容
    public get tail():string{
        return this.src.substring(this.endPos)
    }
    // 动指针所指的字符的 Ascll 码制
    public get ech():number{
        return this.src.charCodeAt(this.beginPos)
    }


    constructor(src: string){
        this.src = src
    }

    // 试指针跳过指定长度
    public scan(length: number){
        this.endPos += length
        this.beginPos  = this.endPos
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
            this.endPos ++
        
            // 检查换行
            const ch = this.ech
            const retractAacll = [ 0x20, /** 空格 */ 0x09, /** 水平制表符 */]
            const enterAacll = [ 0x0A, /** 换行 */ 0x0B, /** 垂直换行符 **/]
            if(this.isNewLine===true){
                this.isNewLine = retractAacll.indexOf(ch) !== -1
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
        // 循环结束 定指针回归
        this.beginPos = this.endPos
    }

    // 是否扫描完成了所有内容
    public isFinish(){
        return this.endPos > this.src.length
    }
}