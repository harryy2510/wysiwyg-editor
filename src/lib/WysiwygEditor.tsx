import { convertToRaw, EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import 'draft-js/dist/Draft.css'

import React from 'react'
import plugins, { EmojiSuggestions, InlineToolbar, MentionSuggestions } from './plugins'
// @ts-ignore
import editorStyles from './styles/editorStyles.module.css'
import { Suggestion } from './types'
import { convertFromHTML, getSuggestions, convertToHTML } from './utils'

export interface WysiwygEditorProps {
    value?: string
    onChange?: (newValue: string) => void
    suggestions?: string[]
}

interface WysiwygEditorState {
    editorState: EditorState
    suggestions: Suggestion[]
    allSuggestions: Suggestion[]
}

class WysiwygEditor extends React.Component<WysiwygEditorProps, WysiwygEditorState> {
    editorRef: React.RefObject<Editor> = React.createRef<Editor>()

    constructor(props: WysiwygEditorProps) {
        super(props)
        const allSuggestions = getSuggestions(this.props.suggestions)
        this.state = {
            editorState: EditorState.createWithContent(convertFromHTML(this.props.value)),
            suggestions: allSuggestions,
            allSuggestions
        }
    }

    onSearchChange = (props: { value: string }) => {
        this.setState((existing) => {
            if (!props.value) {
                return { suggestions: existing.allSuggestions }
            }
            const value = props.value.toLowerCase()
            const filteredSuggestions = existing.allSuggestions.filter((suggestion) =>
                suggestion.name.toLowerCase().includes(value)
            )
            return { suggestions: filteredSuggestions }
        })
    }

    onChange = (editorState: EditorState) => {
        const contentState = editorState.getCurrentContent()
        const html = convertToHTML(contentState)
        if (html !== this.props.value) {
            this.props.onChange?.(html)
        }
        this.setState({ editorState })
    }

    onFocus = () => {
        this.editorRef.current?.focus()
    }

    getApi = (): Editor | null => this.editorRef.current

    render() {
        const {
            onChange,
            onFocus,
            onSearchChange,
            editorRef,
            state: { editorState, suggestions, allSuggestions }
        } = this
        return (
            <div onClick={onFocus} className={editorStyles.editor}>
                <Editor
                    ref={editorRef}
                    editorState={editorState}
                    onChange={onChange}
                    plugins={plugins}
                />
                <InlineToolbar />
                <EmojiSuggestions />
                {allSuggestions.length > 0 && (
                    <MentionSuggestions onSearchChange={onSearchChange} suggestions={suggestions} />
                )}
            </div>
        )
    }
}

export default WysiwygEditor
