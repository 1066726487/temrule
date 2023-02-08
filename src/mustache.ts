import { Analysis } from "./analysis";
import { Token } from "./lib/token";


export class MDswitch{
    public src: string;
    public tokens: Token[]
    public analysis: Analysis;

    constructor(value: string) {
        this.value = value;
        this.analysis = new Analysis();
    }

    public render(){    
        console.log(this.tokens)
    }

    public get value():string{
        return this.src
    }

    public set value(value:string){
        console.time()
        this.tokens = this.analysis.toTokens(this.src)
        this.src = value;
        console.timeEnd()
    }

}