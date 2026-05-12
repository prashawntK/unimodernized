import { Injectable } from '@nestjs/common';
import { BrandProfile, ParsedContent, Redesign } from '@prisma/client';

export interface TemplateInput {
    brand: BrandProfile;
    parsed: ParsedContent;
    redesign: Pick<Redesign, 'pageType' | 'layout' | 'colors' | 'typography' | 'fixes'>;
}

@Injectable()
export class TemplateService {
    render(input: TemplateInput): string {
        const css = this.buildCssVariables(input.brand, input.redesign);
        const nav = this.navHtml(input.parsed.navigation, input.brand.logoUrl);

        switch (input.redesign.layout) {
            case 'hero-centered':
                return this.heroCenteredLayout(input, css, nav);
            case 'hero-with-sidebar':
                return this.heroWithSidebarLayout(input, css, nav);
            case 'card-grid':
                return this.cardGridLayout(input, css, nav);
            case 'full-width-prose':
                return this.fullWidthProseLayout(input, css, nav);
            case 'two-column':
                return this.twoColumnLayout(input, css, nav);
            default:
                return this.cardGridLayout(input, css, nav);
        }
    }

    // ─── CSS ────────────────────────────────────────────────────────────────────

    private buildCssVariables(brand: BrandProfile, redesign: Pick<Redesign, 'colors' | 'typography'>): string {
        const colors = redesign.colors as any;
        const typography = redesign.typography as any;
        const primary = colors?.primary ?? brand.primaryColor ?? '#1a1a2e';
        const background = colors?.background ?? brand.backgroundColor ?? '#ffffff';
        const text = colors?.text ?? brand.textColor ?? '#1a1a1a';
        const secondary = brand.secondaryColor ?? '#e8e8e8';
        const fontHeading = typography?.heading ?? brand.fontHeading ?? 'Georgia, serif';
        const fontBody = typography?.body ?? brand.fontBody ?? 'system-ui, sans-serif';

        return `
            :root {
                --color-primary: ${primary};
                --color-secondary: ${secondary};
                --color-background: ${background};
                --color-text: ${text};
                --color-surface: #f5f5f5;
                --color-border: #e2e8f0;
                --font-heading: ${fontHeading};
                --font-body: ${fontBody};
                --radius: 8px;
                --shadow: 0 2px 8px rgba(0,0,0,0.08);
                --max-width: 1200px;
            }
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: var(--font-body); color: var(--color-text); background: var(--color-background); line-height: 1.6; }
            h1,h2,h3,h4 { font-family: var(--font-heading); line-height: 1.25; }
            a { color: var(--color-primary); text-decoration: none; }
            a:hover { text-decoration: underline; }
            a:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 2px; }
            img { max-width: 100%; height: auto; display: block; }
        `;
    }

    // ─── NAV ────────────────────────────────────────────────────────────────────

    private navHtml(navigation: any, logoUrl: string | null): string {
        const nav = navigation as any;
        const links: any[] = Array.isArray(nav?.primaryNav) ? nav.primaryNav : [];
        const compact = links.length > 6;

        const navItems = links
            .slice(0, compact ? 6 : links.length)
            .map(l => `<li><a href="${this.esc(l.href ?? '#')}">${this.esc(l.text ?? '')}</a></li>`)
            .join('');

        const overflowItem = compact
            ? `<li class="nav__more"><button aria-haspopup="true">More ▾</button></li>`
            : '';

        return `
        <a class="skip-link" href="#main-content">Skip to main content</a>
        <header class="site-header" role="banner">
            <div class="site-header__inner">
                ${logoUrl ? `<a href="/" aria-label="Home"><img src="${this.esc(logoUrl)}" alt="University logo" class="site-header__logo" loading="lazy"></a>` : ''}
                <nav class="site-nav ${compact ? 'site-nav--compact' : ''}" aria-label="Primary navigation">
                    <ul role="list">${navItems}${overflowItem}</ul>
                </nav>
            </div>
        </header>`;
    }

    private navCss(): string {
        return `
            .skip-link { position: absolute; top: -100%; left: 0; background: var(--color-primary); color: #fff; padding: .5rem 1rem; z-index: 9999; }
            .skip-link:focus { top: 0; }
            .site-header { background: var(--color-primary); color: #fff; padding: 1rem 2rem; }
            .site-header__inner { display: flex; align-items: center; gap: 2rem; max-width: var(--max-width); margin: 0 auto; flex-wrap: wrap; }
            .site-header__logo { height: 48px; width: auto; }
            .site-nav ul { display: flex; gap: 1.25rem; list-style: none; flex-wrap: wrap; align-items: center; }
            .site-nav a { color: #fff; font-weight: 500; font-size: .9rem; padding: .25rem 0; border-bottom: 2px solid transparent; transition: border-color .15s; }
            .site-nav a:hover { border-bottom-color: #fff; text-decoration: none; }
            .site-nav--compact a { font-size: .85rem; }
            .nav__more button { background: none; border: 1px solid rgba(255,255,255,.5); color: #fff; padding: .25rem .75rem; border-radius: 4px; cursor: pointer; font-size: .85rem; }
            footer { background: var(--color-primary); color: #fff; text-align: center; padding: 2rem; margin-top: 4rem; font-size: .875rem; opacity: .9; }
            @media (max-width: 640px) { .site-header { padding: .75rem 1rem; } .site-nav ul { gap: .75rem; } }
        `;
    }

    // ─── LAYOUT: hero-centered ───────────────────────────────────────────────────

    private heroCenteredLayout(input: TemplateInput, css: string, nav: string): string {
        const { parsed } = input;
        const metadata = parsed.metadata as any;
        const headings = parsed.headings as any;
        const title = headings?.h1?.[0] ?? metadata?.title ?? 'Welcome';
        const description = metadata?.metaDescription ?? parsed.mainText?.slice(0, 200) ?? '';
        const cards = this.buildCards(parsed);

        return this.page(metadata?.title ?? title, description, `
            ${css}
            ${this.navCss()}
            .hero { background: var(--color-primary); color: #fff; padding: 6rem 2rem; text-align: center; }
            .hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 1.25rem; }
            .hero p { font-size: 1.15rem; max-width: 600px; margin: 0 auto 2rem; opacity: .9; }
            .hero__cta { display: inline-block; padding: .875rem 2.5rem; background: #fff; color: var(--color-primary); border-radius: var(--radius); font-weight: 700; }
            .hero__cta:hover { background: var(--color-secondary); text-decoration: none; }
            .highlights { padding: 4rem 2rem; max-width: var(--max-width); margin: 0 auto; }
            .highlights h2 { font-size: 1.75rem; margin-bottom: 2rem; color: var(--color-primary); }
            .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
            .card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 1.5rem; box-shadow: var(--shadow); }
            .card h3 { margin-bottom: .5rem; font-size: 1.05rem; color: var(--color-primary); }
            .card p { font-size: .9rem; color: #555; }
        `, nav, `
            <section class="hero" aria-labelledby="hero-heading">
                <h1 id="hero-heading">${this.esc(title)}</h1>
                <p>${this.esc(description)}</p>
                <a href="#highlights" class="hero__cta">Explore</a>
            </section>
            <section id="highlights" class="highlights" aria-label="Highlights">
                <h2>Highlights</h2>
                <div class="card-grid">${cards}</div>
            </section>
        `);
    }

    // ─── LAYOUT: hero-with-sidebar ───────────────────────────────────────────────

    private heroWithSidebarLayout(input: TemplateInput, css: string, nav: string): string {
        const { parsed } = input;
        const metadata = parsed.metadata as any;
        const headings = parsed.headings as any;
        const paragraphs = parsed.paragraphs as any[];
        const title = metadata?.title ?? headings?.h1?.[0] ?? 'Department';
        const description = metadata?.metaDescription ?? '';
        const h2s: string[] = Array.isArray(headings?.h2) ? headings.h2 : [];
        const paras: string[] = Array.isArray(paragraphs) ? paragraphs : [];

        const sections = h2s.slice(0, 5).map((h: string, i: number) => `
            <section aria-labelledby="sec-${i}">
                <h2 id="sec-${i}">${this.esc(h)}</h2>
                ${paras[i] ? `<p>${this.esc(paras[i])}</p>` : ''}
            </section>`).join('') || `<p>${this.esc(parsed.mainText?.slice(0, 800) ?? '')}</p>`;

        return this.page(title, description, `
            ${css}
            ${this.navCss()}
            .page-hero { background: var(--color-primary); color: #fff; padding: 3rem 2rem; }
            .page-hero__inner { max-width: var(--max-width); margin: 0 auto; }
            .page-hero h1 { font-size: clamp(1.75rem, 4vw, 2.75rem); margin-bottom: .5rem; }
            .page-hero p { opacity: .85; max-width: 680px; }
            .layout-sidebar { display: grid; grid-template-columns: 1fr 260px; gap: 3rem; max-width: var(--max-width); margin: 3rem auto; padding: 0 2rem; }
            .main-content section { margin-bottom: 2.5rem; }
            .main-content h2 { font-size: 1.35rem; color: var(--color-primary); border-bottom: 2px solid var(--color-border); padding-bottom: .4rem; margin-bottom: .875rem; }
            .sidebar { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 1.5rem; height: fit-content; position: sticky; top: 1rem; }
            .sidebar h3 { font-size: 1rem; color: var(--color-primary); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: .05em; font-size: .8rem; }
            .sidebar ul { list-style: none; }
            .sidebar li + li { margin-top: .625rem; border-top: 1px solid var(--color-border); padding-top: .625rem; }
            @media (max-width: 768px) { .layout-sidebar { grid-template-columns: 1fr; } .sidebar { position: static; } }
        `, nav, `
            <div class="page-hero">
                <div class="page-hero__inner">
                    <h1>${this.esc(title)}</h1>
                    ${description ? `<p>${this.esc(description)}</p>` : ''}
                </div>
            </div>
            <div class="layout-sidebar">
                <main class="main-content">${sections}</main>
                <aside class="sidebar" aria-label="Quick links">
                    <h3>Quick Links</h3>
                    ${this.quickLinks(parsed.navigation)}
                </aside>
            </div>
        `);
    }

    // ─── LAYOUT: card-grid ───────────────────────────────────────────────────────

    private cardGridLayout(input: TemplateInput, css: string, nav: string): string {
        const { parsed } = input;
        const metadata = parsed.metadata as any;
        const headings = parsed.headings as any;
        const title = metadata?.title ?? headings?.h1?.[0] ?? 'Page';
        const description = metadata?.metaDescription ?? '';
        const cards = this.buildCards(parsed);

        return this.page(title, description, `
            ${css}
            ${this.navCss()}
            .page-band { background: var(--color-primary); color: #fff; padding: 2.5rem 2rem; }
            .page-band__inner { max-width: var(--max-width); margin: 0 auto; }
            .page-band h1 { font-size: clamp(1.5rem, 3vw, 2.25rem); }
            .page-band p { opacity: .85; margin-top: .5rem; max-width: 640px; }
            .grid-section { max-width: var(--max-width); margin: 3rem auto; padding: 0 2rem; }
            .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
            .card { background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius); padding: 1.5rem; box-shadow: var(--shadow); transition: box-shadow .2s; }
            .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.12); }
            .card h3 { font-size: 1.05rem; color: var(--color-primary); margin-bottom: .5rem; }
            .card p { font-size: .875rem; color: #555; line-height: 1.55; }
            .card__tag { display: inline-block; font-size: .75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 4px; padding: .125rem .5rem; margin-bottom: .75rem; color: #666; }
        `, nav, `
            <div class="page-band">
                <div class="page-band__inner">
                    <h1>${this.esc(title)}</h1>
                    ${description ? `<p>${this.esc(description)}</p>` : ''}
                </div>
            </div>
            <div class="grid-section">
                <div class="card-grid" role="list">${cards}</div>
            </div>
        `);
    }

    // ─── LAYOUT: full-width-prose ────────────────────────────────────────────────

    private fullWidthProseLayout(input: TemplateInput, css: string, nav: string): string {
        const { parsed } = input;
        const metadata = parsed.metadata as any;
        const headings = parsed.headings as any;
        const paragraphs = parsed.paragraphs as any[];
        const title = metadata?.title ?? headings?.h1?.[0] ?? 'Page';
        const description = metadata?.metaDescription ?? '';
        const paras: string[] = Array.isArray(paragraphs) ? paragraphs : [];
        const h2s: string[] = Array.isArray(headings?.h2) ? headings.h2 : [];

        const body = h2s.length > 0
            ? h2s.map((h: string, i: number) => `
                <h2>${this.esc(h)}</h2>
                ${paras[i] ? `<p>${this.esc(paras[i])}</p>` : ''}`).join('')
            : paras.map((p: string) => `<p>${this.esc(p)}</p>`).join('') || `<p>${this.esc(parsed.mainText?.slice(0, 1200) ?? '')}</p>`;

        return this.page(title, description, `
            ${css}
            ${this.navCss()}
            .article-hero { background: var(--color-surface); border-bottom: 1px solid var(--color-border); padding: 3rem 2rem; }
            .article-hero__inner { max-width: 760px; margin: 0 auto; }
            .article-hero h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: .75rem; color: var(--color-primary); }
            .article-hero p { color: #555; font-size: 1.05rem; }
            .prose-body { max-width: 760px; margin: 3rem auto; padding: 0 2rem; }
            .prose-body h2 { font-size: 1.4rem; color: var(--color-primary); margin: 2rem 0 .75rem; }
            .prose-body p { margin-bottom: 1.25rem; line-height: 1.8; }
            .prose-body p:last-child { margin-bottom: 0; }
        `, nav, `
            <div class="article-hero">
                <div class="article-hero__inner">
                    <h1>${this.esc(title)}</h1>
                    ${description ? `<p>${this.esc(description)}</p>` : ''}
                </div>
            </div>
            <article class="prose-body">${body}</article>
        `);
    }

    // ─── LAYOUT: two-column ──────────────────────────────────────────────────────

    private twoColumnLayout(input: TemplateInput, css: string, nav: string): string {
        const { parsed } = input;
        const metadata = parsed.metadata as any;
        const headings = parsed.headings as any;
        const paragraphs = parsed.paragraphs as any[];
        const title = metadata?.title ?? headings?.h1?.[0] ?? 'Page';
        const description = metadata?.metaDescription ?? '';
        const h2s: string[] = Array.isArray(headings?.h2) ? headings.h2 : [];
        const paras: string[] = Array.isArray(paragraphs) ? paragraphs : [];

        const left = h2s.filter((_: string, i: number) => i % 2 === 0).map((h: string, i: number) => `
            <section aria-labelledby="col-l-${i}">
                <h2 id="col-l-${i}">${this.esc(h)}</h2>
                ${paras[i * 2] ? `<p>${this.esc(paras[i * 2])}</p>` : ''}
            </section>`).join('');

        const right = h2s.filter((_: string, i: number) => i % 2 === 1).map((h: string, i: number) => `
            <section aria-labelledby="col-r-${i}">
                <h2 id="col-r-${i}">${this.esc(h)}</h2>
                ${paras[i * 2 + 1] ? `<p>${this.esc(paras[i * 2 + 1])}</p>` : ''}
            </section>`).join('');

        return this.page(title, description, `
            ${css}
            ${this.navCss()}
            .page-header { background: var(--color-primary); color: #fff; padding: 2.5rem 2rem; }
            .page-header__inner { max-width: var(--max-width); margin: 0 auto; }
            .page-header h1 { font-size: clamp(1.5rem, 3vw, 2.25rem); }
            .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; max-width: var(--max-width); margin: 3rem auto; padding: 0 2rem; }
            .two-col section { margin-bottom: 2rem; }
            .two-col h2 { font-size: 1.25rem; color: var(--color-primary); margin-bottom: .75rem; padding-bottom: .4rem; border-bottom: 2px solid var(--color-border); }
            .two-col p { font-size: .95rem; line-height: 1.7; }
            @media (max-width: 768px) { .two-col { grid-template-columns: 1fr; gap: 0; } }
        `, nav, `
            <div class="page-header">
                <div class="page-header__inner">
                    <h1>${this.esc(title)}</h1>
                    ${description ? `<p style="opacity:.85;margin-top:.5rem">${this.esc(description)}</p>` : ''}
                </div>
            </div>
            <div class="two-col">
                <div>${left || `<p>${this.esc(parsed.mainText?.slice(0, 500) ?? '')}</p>`}</div>
                <div>${right || this.quickLinks(parsed.navigation)}</div>
            </div>
        `);
    }

    // ─── HELPERS ─────────────────────────────────────────────────────────────────

    private page(title: string, description: string, styles: string, nav: string, body: string): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.esc(title)}</title>
    <meta name="description" content="${this.esc(description)}">
    <style>${styles}</style>
</head>
<body>
    ${nav}
    <main id="main-content">${body}</main>
    <footer role="contentinfo"><p>&copy; ${new Date().getFullYear()} University. All rights reserved.</p></footer>
</body>
</html>`;
    }

    private buildCards(parsed: ParsedContent): string {
        const headings = parsed.headings as any;
        const h2s: string[] = Array.isArray(headings?.h2) ? headings.h2 : [];
        const paras: string[] = Array.isArray(parsed.paragraphs) ? parsed.paragraphs as any[] : [];
        if (h2s.length === 0) return `<div class="card" role="listitem"><p>${this.esc(parsed.mainText?.slice(0, 300) ?? '')}</p></div>`;
        return h2s.slice(0, 9).map((h: string, i: number) => `
            <article class="card" role="listitem">
                <h3>${this.esc(h)}</h3>
                ${paras[i] ? `<p>${this.esc(String(paras[i]).slice(0, 140))}…</p>` : ''}
            </article>`).join('');
    }

    private quickLinks(navigation: any): string {
        const nav = navigation as any;
        const links: any[] = Array.isArray(nav?.primaryNav) ? nav.primaryNav : [];
        if (links.length === 0) return '<p>No links available.</p>';
        return `<ul style="list-style:none">${links.slice(0, 8).map(l =>
            `<li style="padding:.4rem 0;border-bottom:1px solid var(--color-border)"><a href="${this.esc(l.href ?? '#')}">${this.esc(l.text ?? '')}</a></li>`
        ).join('')}</ul>`;
    }

    private esc(str: string): string {
        return String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}
