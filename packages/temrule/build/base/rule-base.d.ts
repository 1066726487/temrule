import { Token } from "../lib/token";
import { Scanner } from "../lib/scanner";
export type MatchResult = {
    entire: string;
    content: string;
    prefix: string | null;
    suffix: string | null;
} | null;
export type renderToken = Omit<Token, 'content'> & {
    content: string;
    tier: number;
};
export declare abstract class RuleBase {
    abstract name: string;
    abstract type: string;
    exclude: string[];
    within: string[];
    abstract match(ctx: Scanner): MatchResult;
    abstract render(Token: renderToken): string;
}
