import { RuleBase } from "./base/rule-base";
import { Token } from "./lib/token";
export type RulesType = Map<string, RuleBase>;
export declare class Analysis {
    src: string;
    options: import("./options").IOptions;
    private rules;
    get tokens(): Token[];
    use(rule: RuleBase): void;
    render(): string;
    private renderToken;
    private tokenize;
}
