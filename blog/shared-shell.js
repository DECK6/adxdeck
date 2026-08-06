'use strict';

const DEFAULT_SITE_ORIGIN = 'https://dexa.art';

function markerPairCounts(html, start, end) {
    const startMarker = `<!-- ${start} -->`;
    const endMarker = `<!-- ${end} -->`;
    const startCount = html.split(startMarker).length - 1;
    const endCount = html.split(endMarker).length - 1;
    return {
        start: startCount,
        end: endCount,
        ordered: startCount === 1
            && endCount === 1
            && html.indexOf(startMarker) < html.indexOf(endMarker)
    };
}

function assertMarkerPair(html, start, end, label = 'generated block') {
    const counts = markerPairCounts(html, start, end);
    if (counts.start !== 1 || counts.end !== 1) {
        throw new Error(`Expected exactly one ${label} marker pair: ${start}/${end}; found ${counts.start}/${counts.end}`);
    }
    if (!counts.ordered) {
        throw new Error(`${label} markers are out of order: ${start}/${end}`);
    }
}

function extractGeneratedBlock(html, start, end) {
    assertMarkerPair(html, start, end, 'shared shell');
    const re = new RegExp(`<!-- ${start} -->([\\s\\S]*?)<!-- ${end} -->`, 'm');
    const match = html.match(re);
    if (!match) throw new Error(`Missing shared shell markers: ${start}/${end}`);
    return match[1].trim();
}

function replaceGeneratedBlock(html, start, end, content) {
    assertMarkerPair(html, start, end);
    const re = new RegExp(`(<!-- ${start} -->)[\\s\\S]*?(<!-- ${end} -->)`, 'm');
    return html.replace(re, (_match, open, close) => `${open}\n${content}\n                ${close}`);
}

function routeTarget(value, sourceRoute = '/', siteOrigin = DEFAULT_SITE_ORIGIN) {
    const origin = new URL(siteOrigin);
    const base = new URL(sourceRoute, origin);
    const url = new URL(value, base);
    return url.origin === origin.origin
        ? `${url.pathname}${url.search}${url.hash}`
        : url.href;
}

function normalizeShellRoutes(html, sourceRoute = '/', siteOrigin = DEFAULT_SITE_ORIGIN) {
    return html.replace(/\b(href|src)=(["'])([^"']+)\2/gi, (_match, attr, quote, value) => {
        return `${attr}=${quote}${routeTarget(value, sourceRoute, siteOrigin)}${quote}`;
    });
}

function cleanText(html) {
    return String(html || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&copy;/gi, '©')
        .replace(/&amp;/gi, '&')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function attributeValue(attributes, name) {
    const match = String(attributes || '').match(new RegExp(`\\b${name}=(["'])([^"']*)\\1`, 'i'));
    return match ? match[2] : '';
}

function markBlogNavigationActive(navHtml, sourceRoute = '/', siteOrigin = DEFAULT_SITE_ORIGIN) {
    let count = 0;
    const marked = navHtml.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (match, attrs, body) => {
        const href = attributeValue(attrs, 'href');
        if (cleanText(body) !== 'BLOG' || !href || routeTarget(href, sourceRoute, siteOrigin) !== '/blog/') {
            return match;
        }

        count += 1;
        let updated = attrs;
        const classValue = attributeValue(updated, 'class');
        if (classValue) {
            const classes = new Set(classValue.split(/\s+/).filter(Boolean));
            classes.add('active');
            updated = updated.replace(/\bclass=(["'])[^"']*\1/i, `class="${[...classes].join(' ')}"`);
        } else {
            updated += ' class="active"';
        }

        if (attributeValue(updated, 'aria-current')) {
            updated = updated.replace(/\baria-current=(["'])[^"']*\1/i, 'aria-current="page"');
        } else {
            updated += ' aria-current="page"';
        }
        return `<a${updated}>${body}</a>`;
    });

    if (count !== 2) {
        throw new Error(`Expected exactly two BLOG navigation links, found ${count}`);
    }
    return marked;
}

function elementBodyByClass(html, tag, className) {
    const re = new RegExp(`<${tag}\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = html.match(re);
    return match ? match[1] : '';
}

function elementBodyById(html, id) {
    const re = new RegExp(`<([a-z][a-z0-9-]*)\\b[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/\\1>`, 'i');
    const match = html.match(re);
    return match ? match[2] : '';
}

function elementOuterByClass(html, tag, className) {
    const re = new RegExp(`(<${tag}\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/${tag}>)`, 'i');
    const match = html.match(re);
    return match ? match[1] : '';
}

function elementOuterById(html, id) {
    const re = new RegExp(`(<([a-z][a-z0-9-]*)\\b[^>]*id=["']${id}["'][^>]*>[\\s\\S]*?<\\/\\2>)`, 'i');
    const match = html.match(re);
    return match ? match[1] : '';
}

function elementOpeningByClass(html, tag, className) {
    const re = new RegExp(`(<${tag}\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>)`, 'i');
    const match = html.match(re);
    return match ? match[1] : '';
}

function elementOpeningById(html, id) {
    const re = new RegExp(`(<[a-z][a-z0-9-]*\\b[^>]*id=["']${id}["'][^>]*>)`, 'i');
    const match = html.match(re);
    return match ? match[1] : '';
}

function normalizedElementMarkup(html, sourceRoute, siteOrigin) {
    return normalizeShellRoutes(html, sourceRoute, siteOrigin)
        .replace(/\s+/g, ' ')
        .trim();
}

function linksFrom(html, sourceRoute, siteOrigin) {
    return [...String(html || '').matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
        .map(([, attrs, label]) => ({
            label: cleanText(label),
            target: routeTarget(attributeValue(attrs, 'href'), sourceRoute, siteOrigin)
        }));
}

function stylesheetAssets(html, sourceRoute, siteOrigin) {
    return [...String(html || '').matchAll(/<link\b([^>]*)>/gi)]
        .filter(([, attrs]) => /(?:^|\s)stylesheet(?:\s|$)/i.test(attributeValue(attrs, 'rel')))
        .map(([, attrs]) => attributeValue(attrs, 'href'))
        .filter(href => /dexa-theme\.css(?:$|[?#])/i.test(href))
        .map(href => routeTarget(href, sourceRoute, siteOrigin));
}

function sharedShellSignature(html, sourceRoute = '/', siteOrigin = DEFAULT_SITE_ORIGIN) {
    const navWrapper = elementOpeningByClass(html, 'nav', 'dx-nav');
    const navBrand = elementOuterByClass(html, 'a', 'dx-nav-brand');
    const menuButton = elementOuterById(html, 'mobile-menu-btn');
    const primaryNav = elementBodyByClass(html, 'div', 'dx-nav-links');
    const mobileWrapper = elementOpeningById(html, 'mobile-menu');
    const mobileNav = elementBodyById(html, 'mobile-menu');
    const footerOuter = elementOuterByClass(html, 'footer', 'dx-footer');
    const footer = elementBodyByClass(html, 'footer', 'dx-footer');
    const footerHeadings = [...footer.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
        .map(([, heading]) => cleanText(heading));
    const footerLogos = [...footer.matchAll(/<img\b([^>]*)>/gi)]
        .filter(([, attrs]) => attributeValue(attrs, 'alt') === 'DEXA')
        .map(([, attrs]) => routeTarget(attributeValue(attrs, 'src'), sourceRoute, siteOrigin));

    return {
        navWrapper: normalizedElementMarkup(navWrapper, sourceRoute, siteOrigin),
        navBrand: normalizedElementMarkup(navBrand, sourceRoute, siteOrigin),
        menuButton: normalizedElementMarkup(menuButton, sourceRoute, siteOrigin),
        primaryNav: linksFrom(primaryNav, sourceRoute, siteOrigin),
        mobileWrapper: normalizedElementMarkup(mobileWrapper, sourceRoute, siteOrigin),
        mobileNav: linksFrom(mobileNav, sourceRoute, siteOrigin),
        footer: {
            markup: normalizedElementMarkup(footerOuter, sourceRoute, siteOrigin),
            headings: footerHeadings,
            links: linksFrom(footer, sourceRoute, siteOrigin),
            logos: footerLogos,
            text: cleanText(footer)
        },
        themeAssets: stylesheetAssets(html, sourceRoute, siteOrigin)
    };
}

function sameShellSignature(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function activeBlogLinkCount(html, sourceRoute = '/', siteOrigin = DEFAULT_SITE_ORIGIN) {
    return [...String(html || '').matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
        .filter(([, attrs, label]) => {
            const href = attributeValue(attrs, 'href');
            const classes = attributeValue(attrs, 'class').split(/\s+/).filter(Boolean);
            return cleanText(label) === 'BLOG'
                && href
                && routeTarget(href, sourceRoute, siteOrigin) === '/blog/'
                && classes.includes('active')
                && attributeValue(attrs, 'aria-current') === 'page';
        }).length;
}

module.exports = {
    DEFAULT_SITE_ORIGIN,
    markerPairCounts,
    assertMarkerPair,
    extractGeneratedBlock,
    replaceGeneratedBlock,
    routeTarget,
    normalizeShellRoutes,
    markBlogNavigationActive,
    sharedShellSignature,
    sameShellSignature,
    activeBlogLinkCount
};
