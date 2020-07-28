import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import createLinkPlugin from 'draft-js-anchor-plugin'
import 'draft-js-anchor-plugin/lib/plugin.css'

import {
    BoldButton,
    ItalicButton,
    OrderedListButton,
    UnderlineButton,
    UnorderedListButton
} from 'draft-js-buttons'
import createInlineToolbarPlugin, { ToolbarChildrenProps } from 'draft-js-inline-toolbar-plugin'
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'
// @ts-ignore
import createMentionPlugin from 'draft-js-mention-plugin'
import 'draft-js-mention-plugin/lib/plugin.css'
import Editor from 'draft-js-plugins-editor'
import 'draft-js/dist/Draft.css'
import createEmojiPlugin from 'draft-js-emoji-plugin'
import 'draft-js-emoji-plugin/lib/plugin.css'
import { isEqual, map, memoize } from 'lodash-es'

import React from 'react'

import StrikeThroughButton from './buttons/StrikeThroughButton'

// @ts-ignore
import buttonStyles from './styles/buttonStyles.module.css'
// @ts-ignore
import editorStyles from './styles/editorStyles.module.css'
// @ts-ignore
import emojiStyles from './styles/emojiStyles.module.css'
// @ts-ignore
import toolbarStyles from './styles/toolbarStyles.module.css'
import { WysiwygState } from './types'
import { createWysiwygState } from './utils'

// @ts-ignore
import { convertToHTML } from 'draft-convert'

interface Suggestion {
    name: string
}
export interface WysiwygEditorProps {
    value?: WysiwygState
    onChange?: (newValue: WysiwygState) => void
    onHtmlChange?: (html: string) => void
    suggestions?: Record<string, string>
}

const EmojiButton: React.FC<ToolbarChildrenProps> = () => {
    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => event.preventDefault()
    return (
        <div className={emojiStyles.emoji} onMouseDown={onMouseDown}>
            <emojiPlugin.EmojiSelect />
        </div>
    )
}

interface MentionComponentProps {
    className: string
    decoratedText: string
    entityKey: string
    mention: Suggestion
    theme: Record<string, string>
}
const MentionComponent: React.FC<MentionComponentProps> = (props) => {
    const { children, className } = props
    return (
        <span className={className} spellCheck={false}>
            {children}
        </span>
    )
}

const inlineToolbarPlugin = createInlineToolbarPlugin({
    theme: { buttonStyles, toolbarStyles }
})
const linkPlugin = createLinkPlugin({
    linkTarget: '_blank'
})
const mentionPlugin = createMentionPlugin({
    mentionTrigger: '{{',
    entityMutability: 'IMMUTABLE',
    mentionPrefix: '',
    mentionComponent: MentionComponent
})
const emojiPlugin = createEmojiPlugin({
    useNativeArt: true
})

const plugins = [inlineToolbarPlugin, linkPlugin, mentionPlugin, emojiPlugin]

const getSuggestions = memoize(
    (suggestionsMap?: Record<string, string>): Suggestion[] =>
        map(suggestionsMap, (name, key) => ({ name: `{{${key.trim()}}}` })) as Suggestion[]
)

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
    value,
    onChange,
    onHtmlChange,
    suggestions: suggestionsMap
}) => {
    const [state, setState] = React.useState<EditorState>(
        EditorState.createWithContent(convertFromRaw(value ?? createWysiwygState()))
    )
    const editorRef = React.useRef<Editor>() as React.RefObject<Editor>
    const suggestionsRef = React.useRef(getSuggestions(suggestionsMap))
    const [suggestions, setSuggestions] = React.useState(suggestionsRef.current)

    const onSearchChange = React.useCallback(
        (props: { value: string }) => {
            if (!props.value) {
                setSuggestions(suggestionsRef.current)
            } else {
                const value = props.value.toLowerCase()
                const filteredSuggestions = suggestions.filter((suggestion) =>
                    suggestion.name.toLowerCase().includes(value)
                )
                setSuggestions(filteredSuggestions)
            }
        },
        [suggestionsRef.current]
    )

    const handleChange = React.useCallback(
        (newState: EditorState) => {
            const contentState = newState.getCurrentContent()
            const raw = convertToRaw(contentState)
            if (!isEqual(raw, value)) {
                onChange?.(raw)
                const html = convertToHTML(contentState)
                onHtmlChange?.(html)
            }
            setState(newState)
        },
        [value]
    )

    const handleFocus = () => {
        editorRef.current?.focus()
    }

    return (
        <div onClick={handleFocus} className={editorStyles.editor}>
            <Editor ref={editorRef} editorState={state} onChange={handleChange} plugins={plugins} />
            <inlineToolbarPlugin.InlineToolbar>
                {(externalProps: any) => (
                    <>
                        <BoldButton {...externalProps} />
                        <ItalicButton {...externalProps} />
                        <UnderlineButton {...externalProps} />
                        <StrikeThroughButton {...externalProps} />
                        <UnorderedListButton {...externalProps} />
                        <OrderedListButton {...externalProps} />
                        <linkPlugin.LinkButton {...externalProps} />
                        <EmojiButton {...externalProps} />
                    </>
                )}
            </inlineToolbarPlugin.InlineToolbar>
            <emojiPlugin.EmojiSuggestions />
            {suggestionsRef.current.length > 0 && (
                <mentionPlugin.MentionSuggestions
                    onSearchChange={onSearchChange}
                    suggestions={suggestions}
                />
            )}
        </div>
    )
}

export default WysiwygEditor
