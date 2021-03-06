import { sql as lang } from '../sql';
import { tokenize } from '../../illuminate';
import { tokenToJson } from './__helpers';

const strings = `
""
"fo\\"obar"
"foo
bar"
''
'fo\\'obar'
'foo
bar'
`;

const comments = `
/**/
/* foo
bar */
--
-- foo
//
// foo
#
# foo
`;

const variables = `
@foo
@foo_bar_42
@"fo"o-b
ar"
@'fo\'o-b
ar'
@\`fo\`o-b
ar\`
`;

describe('sql lang test', () => {
    test('strings', () => {
        expect(tokenToJson(tokenize(strings, lang))).toMatchSnapshot();
    });

    test('comments', () => {
        expect(tokenToJson(tokenize(comments, lang))).toMatchSnapshot();
    });

    test('variables', () => {
        expect(tokenToJson(tokenize(variables, lang))).toMatchSnapshot();
    });
});
