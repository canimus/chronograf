import {getSuggestionsHelper} from 'src/flux/helpers/autoComplete'

const ALL_SUGGESTIONS = [
  {name: 'filter', params: {foo: 'function', bux: 'string'}},
  {name: 'first', params: {baz: 'invalid'}},
  {name: 'baz', params: {bar: 'array'}},
]

describe('Flux.helpers.autoComplete', () => {
  describe('function completion', () => {
    it('can complete a function when partially typed', () => {
      const lineText = ' |> fi'
      const cursorPosition = lineText.length
      const actual = getSuggestionsHelper(
        lineText,
        cursorPosition,
        ALL_SUGGESTIONS
      )
      const expected = {
        start: 4,
        end: 6,
        suggestions: [
          {displayText: 'filter', text: 'filter'},
          {displayText: 'first', text: 'first'},
        ],
      }

      expect(actual).toEqual(expected)
    })

    it('shows all completions when no function is typed', () => {
      const lineText = ' |> '
      const cursorPosition = lineText.length
      const actual = getSuggestionsHelper(
        lineText,
        cursorPosition,
        ALL_SUGGESTIONS
      )
      const expected = {
        start: 4,
        end: 4,
        suggestions: [
          {displayText: 'filter', text: 'filter'},
          {displayText: 'first', text: 'first'},
          {displayText: 'baz', text: 'baz'},
        ],
      }

      expect(actual).toEqual(expected)
    })

    it('completes with a pipe if first non-whitespace on line', () => {
      const lineText = '\t'
      const cursorPosition = lineText.length
      const actual = getSuggestionsHelper(
        lineText,
        cursorPosition,
        ALL_SUGGESTIONS
      )
      const expected = {
        start: 1,
        end: 1,
        suggestions: [
          {displayText: 'filter', text: '|> filter'},
          {displayText: 'first', text: '|> first'},
          {displayText: 'baz', text: '|> baz'},
        ],
      }

      expect(actual).toEqual(expected)
    })

    it('does not complete from queries with a pipe', () => {
      const lineText = ''
      const cursorPosition = lineText.length
      const actual = getSuggestionsHelper(lineText, cursorPosition, [
        {name: 'from', params: {foo: 'function', bux: 'string'}},
      ])

      const expected = {
        start: 0,
        end: 0,
        suggestions: [{displayText: 'from', text: 'from'}],
      }

      expect(actual).toEqual(expected)
    })

    it('shows all completions after a closing a function with no parameters', () => {
      const lineText = ' |> filter() '
      const cursorPosition = lineText.length
      const actual = getSuggestionsHelper(
        lineText,
        cursorPosition,
        ALL_SUGGESTIONS
      )
      const expected = {
        start: 13,
        end: 13,
        suggestions: [
          {displayText: 'filter', text: '|> filter'},
          {displayText: 'first', text: '|> first'},
          {displayText: 'baz', text: '|> baz'},
        ],
      }

      expect(actual).toEqual(expected)
    })

    describe('parameter completion', () => {
      it('shows all parameters for a function', () => {
        const lineText = ' |> filter('
        const cursorPosition = lineText.length
        const actual = getSuggestionsHelper(
          lineText,
          cursorPosition,
          ALL_SUGGESTIONS
        )

        const expected = {
          start: 11,
          end: 11,
          suggestions: [
            {displayText: 'foo <function>', text: 'foo: '},
            {displayText: 'bux <string>', text: 'bux: '},
          ],
        }

        expect(actual).toEqual(expected)
      })

      it('shows parameters after the second position', () => {
        const lineText = ' |> filter(foo: "bar", '
        const cursorPosition = lineText.length
        const actual = getSuggestionsHelper(
          lineText,
          cursorPosition,
          ALL_SUGGESTIONS
        )

        const expected = {
          start: 23,
          end: 23,
          suggestions: [
            {displayText: 'foo <function>', text: 'foo: '},
            {displayText: 'bux <string>', text: 'bux: '},
          ],
        }

        expect(actual).toEqual(expected)
      })
    })
  })
})
