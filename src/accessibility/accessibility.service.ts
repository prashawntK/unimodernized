import { Injectable } from "@nestjs/common";
import { JSDOM } from "jsdom";
import axe from 'axe-core';

@Injectable()
export class AccessibilityService{
    async audit(html:string, url:string){
        const dom = new JSDOM(html, {url} );
        const results = await axe.run(dom.window.document);

        return results.violations.map(v=>({
            ruleId: v.id,
            impact: v.impact,
            description: v.description,
            helpUrl: v.helpUrl,
            nodes: v.nodes.map(n=>({
                selector:n.target.join(', '),
                html: n.html,
            }))
        }));
    }
}