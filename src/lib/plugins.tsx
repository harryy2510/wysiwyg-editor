// @ts-ignore
import createLinkPlugin from 'draft-js-anchor-plugin'
import 'draft-js-anchor-plugin/lib/plugin.css'
import {
    BoldButton,
    ItalicButton,
    OrderedListButton,
    UnderlineButton,
    UnorderedListButton
} from 'draft-js-buttons'

// @ts-ignore
import createEmojiPlugin from 'draft-js-emoji-plugin'
import 'draft-js-emoji-plugin/lib/plugin.css'
// @ts-ignore
import createInlineToolbarPlugin, { ToolbarChildrenProps } from 'draft-js-inline-toolbar-plugin'
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'
// @ts-ignore
import createMentionPlugin from 'draft-js-mention-plugin'
import 'draft-js-mention-plugin/lib/plugin.css'
import React from 'react'
import StrikeThroughButton from './buttons/StrikeThroughButton'

// @ts-ignore
import buttonStyles from './styles/buttonStyles.module.css'
// @ts-ignore
import emojiStyles from './styles/emojiStyles.module.css'
// @ts-ignore
import toolbarStyles from './styles/toolbarStyles.module.css'
import { Suggestion } from './types'

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

const EmojiButton: React.FC<ToolbarChildrenProps> = () => {
    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => event.preventDefault()
    return (
        <div className={emojiStyles.emoji} onMouseDown={onMouseDown}>
            <emojiPlugin.EmojiSelect />
        </div>
    )
}

const plugins = [inlineToolbarPlugin, linkPlugin, mentionPlugin, emojiPlugin]

export const InlineToolbar = () => {
    return (
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
    )
}

export const EmojiSuggestions = emojiPlugin.EmojiSuggestions
export const MentionSuggestions = mentionPlugin.MentionSuggestions

export default plugins
