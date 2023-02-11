export interface IscanUtil {
    content: string;
    begin: number;
    end: number;
}
/**
 * 扫描类，对字符串进行扫描
 */
export declare class Scanner {
    src: string;
    fastPos: number;
    slowPos: number;
    isNewLine: boolean;
    retract: number;
    get content(): string;
    get tail(): string;
    get fch(): number;
    constructor(src: string);
    scan(length: number): void;
    /**
     * @fun 使指针进行扫描， check方法返回为true
     * @param check 判别方法。返回true进行类容截取，false 继续继续扫描
     * @returns IscanUtil
     */
    scanUtil(check: (ctx: Scanner) => boolean): void;
    isFinish(): boolean;
}
