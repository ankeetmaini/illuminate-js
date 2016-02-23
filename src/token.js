"use strict";

import { run } from "./hooks";

class Token {
    constructor(type, content, alias) {
        this.type = type;
        this.content = content;
        this.alias = alias;
    }

    static stringify(o, language, parent) {
        if (typeof o === "string") {
            return o;
        }

        if (Array.isArray(o)) {
            return o.map((element) => Token.stringify(element, language, o)).join("");
        }

        let env = {
            type: o.type,
            content: Token.stringify(o.content, language, parent),
            tag: "span",
            classes: ["token", o.type],
            attributes: {},
            language,
            parent
        };

        switch (env.type) {
            case "comment":
                env.attributes.spellcheck = "true";
                break;
            case "keyword":
                env.classes.push(`keyword-${env.content.toLowerCase().trim()}`);
                break;
            case "punctuation":
                if (env.content.match(/\(|\)/g)) {
                    env.classes.push(`brackets-parentheses`);
                } else if (env.content.match(/<|>/g)) {
                    env.classes.push(`brackets-angle`);
                } else if (env.content.match(/\[|\]>/g)) {
                    env.classes.push(`brackets-square`);
                } else if (env.content.match(/\{|\}/g)) {
                    env.classes.push(`brackets-braces`);
                }
        }

        if (o.alias) {
            let aliases = Array.isArray(o.alias) ? o.alias : [o.alias];

            env.classes.push(...aliases);
        }

        run("wrap", env);

        let attributes = Object.keys(env.attributes)
            .reduce(
                (prev, key) => `${prev}${key}="${env.attributes[key] || ""}" `,
                ""
            );

        return `<${env.tag} class="${env.classes.join(" ")}" ${attributes}>${env.content}</${env.tag}>`;
    }
}

export default Token;
