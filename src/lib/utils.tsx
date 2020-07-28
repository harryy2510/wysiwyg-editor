// @ts-ignore
import { convertToHTML as _ } from 'draft-convert'
import { convertFromRaw, RawDraftContentState } from 'draft-js'
import { WysiwygState } from './types'

export const createWysiwygState = (): WysiwygState => ({
    blocks: [],
    entityMap: {}
})

export const convertToHTML = (input: RawDraftContentState): string => _(convertFromRaw(input))
