import { Injectable } from "@nestjs/common";
import { JSDOM } from "jsdom";
import axe = require('axe-core');

@Injectable()
export class AccessibilityService{
    async audit(html:string, url:string){
        const dom = new JSDOM(html, { url, runScripts: 'dangerously' });
        const { window } = dom;

        // inject axe-core source into the JSDOM window so it runs in that context
        const scriptEl = window.document.createElement('script');
        scriptEl.textContent = axe.source;
        window.document.head.appendChild(scriptEl);

        // run axe from within the JSDOM window context
        const results = await (window as any).axe.run(window.document);

        return results.violations.map((v: any) =>({
            ruleId: v.id,
            impact: v.impact,
            description: v.description,
            helpUrl: v.helpUrl,
            nodes: v.nodes.map((n: any) =>({
                selector: n.target.join(', '),
                html: n.html,
            }))
        }));
    }
}