import { Scanner } from "../src";

let scanner: Scanner

describe('Scanner类 测试', () => {
    it('[实例] 创建实例', ()=>{
        

        scanner = new Scanner('test')

        // 获取src
        expect(scanner.src).toBe('test');
    })
    it('[检查] 基础属性', () => {
        scanner = new Scanner('test')

        // 指针
        expect(scanner.fastPos).toBe(0)
        expect(scanner.slowPos).toBe(0)

        // content
        expect(scanner.content).toBe('')
        scanner.fastPos = 1
        expect(scanner.content).toBe('t')

        // tail
        expect(scanner.tail).toBe('est')

        expect(scanner.fulfill).toBe('')
        scanner.slowPos =1
        expect(scanner.fulfill).toBe('t')
             
        // fch
        expect(scanner.fch).toBe(0x65)
    })
    it('[测试] .scanUtil()', () => {
        scanner = new Scanner('test\n   new line')

        scanner.scanUtil((ctx)=>{
            if(ctx.tail.indexOf('\n') === 0){
                expect(scanner.fch).toBe(0x0A)
                expect(scanner.fastPos).toBe(4)
                expect(scanner.slowPos).toBe(0)
                expect(scanner.content).toBe('test')
                expect(scanner.tail).toBe('\n   new line')
                expect(scanner.isNewLine).toBe(false)
                return true
            }

            if(ctx.tail.indexOf('new') === 0){
                expect(scanner.fch).toBe(0x0A)
                expect(scanner.isNewLine).toBe(true)
                expect(scanner.fulfill).toBe('test')
                return true
            }
            return false
        })
    })
    it('[测试] .scan()', ()=>{
        scanner = new Scanner('test\nNEWLINE\n   new line')
        scanner.scan(4)
        expect(scanner.fulfill).toBe('test')
        expect(scanner.content).toBe('')
        expect(scanner.tail).toBe('\nNEWLINE\n   new line')
        expect(scanner.fastPos).toBe(4)
        expect(scanner.slowPos).toBe(4)
        expect(scanner.isNewLine).toBe(false)
        scanner.scan(1)
        expect(scanner.isNewLine).toBe(true)
        scanner.scan(3)
        expect(scanner.isNewLine).toBe(false)
        scanner.scan(6)
        expect(scanner.isNewLine).toBe(true)

        scanner = new Scanner('test')
        scanner.fastPos = 2
        scanner.scan(1)
        expect(scanner.fastPos).toBe(3)
        expect(scanner.slowPos).toBe(3)
    })
    it('[测试] .isFinish()', ()=>{
        scanner = new Scanner('test')
        scanner.fastPos = 2
        expect(scanner.isFinish()).toBe(false)
        scanner.fastPos = 3
        expect(scanner.isFinish()).toBe(false)
    })
})