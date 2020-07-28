// @ts-ignore
import { convertFromHTML as _convertFromHTML, convertToHTML as _convertToHTML } from 'draft-convert'
import { ContentState, DraftEntityMutability, DraftEntityType, Entity } from 'draft-js'
import { map, memoize } from 'lodash-es'
import React from 'react'
import { Suggestion } from './types'

export const getSuggestions = memoize(
    (suggestions?: string[]): Suggestion[] =>
        map(suggestions, (tag) => ({ name: `{{${tag.trim()}}}` })) as Suggestion[]
)

const opts = {
    textToEntity: (
        text: string,
        createEntity: (
            type: DraftEntityType,
            mutability: DraftEntityMutability,
            data?: Object
        ) => string
    ) => {
        const result: Entity[] = []
        text.replace(/{{(.*?)}}/g, (match, name: string, offset: number) => {
            const entityKey = createEntity('{{mention', 'IMMUTABLE', { name })
            result.push({
                entity: entityKey,
                offset,
                length: match.length,
                result: match
            })
            return ''
        })
        return result
    },
    styleToHTML: (style: string) => {
        if (style === 'STRIKETHROUGH') {
            return {
                start: '<s>',
                end: '</s>'
            }
        }
    },
    htmlToStyle: (nodeName: string, node: HTMLElement, currentStyle: Set<string>) => {
        if (nodeName === 's') {
            return currentStyle.add('STRIKETHROUGH')
        }
        return currentStyle
    }
}

export const convertFromHTML = (input?: string): ContentState => _convertFromHTML(opts)(input ?? '')
export const convertToHTML = (input: ContentState): string => _convertToHTML(opts)(input)
