function getSuggestionCharIndex(text: string, suggestionDenotationChars: string[]) {
    return suggestionDenotationChars.reduce<{
        suggestionChar: string | null
        suggestionCharIndex: number
    }>(
        (prev, suggestionChar) => {
            const suggestionCharIndex = text.lastIndexOf(suggestionChar)

            if (suggestionCharIndex > prev.suggestionCharIndex) {
                return {
                    suggestionChar,
                    suggestionCharIndex
                }
            }
            return {
                suggestionChar: prev.suggestionChar,
                suggestionCharIndex: prev.suggestionCharIndex
            }
        },
        { suggestionChar: null, suggestionCharIndex: -1 }
    )
}

function hasValidChars(text: string, allowedChars: RegExp) {
    return allowedChars.test(text)
}

function hasValidSuggestionCharIndex(
    suggestionCharIndex: number,
    text: string,
    isolateChar: boolean
) {
    if (suggestionCharIndex > -1) {
        if (
            isolateChar &&
            !(suggestionCharIndex === 0 || !!text[suggestionCharIndex - 1].match(/\s/g))
        ) {
            return false
        }
        return true
    }
    return false
}

export { getSuggestionCharIndex, hasValidChars, hasValidSuggestionCharIndex }
