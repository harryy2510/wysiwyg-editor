import clsx from 'clsx'
import Quill, { Sources } from 'quill'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
import React, { useCallback, useEffect, useState } from 'react'

import StyleAttributors from './attributors/StyleAttributors'
import ReactQuill, { Range, ReactQuillProps, UnprivilegedEditor } from './ReactQuill'
import Suggestion, { SuggestionOptions } from './suggestion/quill.suggestion'
import './suggestion/quill.suggestion.scss'
import './WysiwygEditor.scss'

StyleAttributors.forEach((Attributor) => Quill.register(Attributor))
Quill.register('modules/suggestion', Suggestion)

const palette = [
    '#ef9a9a',
    '#e57373',
    '#ef5350',
    '#f44336',
    '#e53935',
    '#d32f2f',
    '#b71c1c',
    '#f48fb1',
    '#f06292',
    '#ec407a',
    '#e91e63',
    '#d81b60',
    '#c2185b',
    '#880e4f',
    '#ce93d8',
    '#ba68c8',
    '#ab47bc',
    '#9c27b0',
    '#8e24aa',
    '#7b1fa2',
    '#4a148c',
    '#b39ddb',
    '#9575cd',
    '#7e57c2',
    '#673ab7',
    '#5e35b1',
    '#512da8',
    '#311b92',
    '#9fa8da',
    '#7986cb',
    '#5c6bc0',
    '#3f51b5',
    '#3949ab',
    '#303f9f',
    '#1a237e',
    '#90caf9',
    '#64b5f6',
    '#42a5f5',
    '#2196f3',
    '#1e88e5',
    '#1976d2',
    '#0d47a1',
    '#81d4fa',
    '#4fc3f7',
    '#29b6f6',
    '#03a9f4',
    '#039be5',
    '#0288d1',
    '#01579b',
    '#80deea',
    '#4dd0e1',
    '#26c6da',
    '#00bcd4',
    '#00acc1',
    '#0097a7',
    '#006064',
    '#80cbc4',
    '#4db6ac',
    '#26a69a',
    '#009688',
    '#00897b',
    '#00796b',
    '#004d40',
    '#a5d6a7',
    '#81c784',
    '#66bb6a',
    '#4caf50',
    '#43a047',
    '#388e3c',
    '#1b5e20',
    '#c5e1a5',
    '#aed581',
    '#9ccc65',
    '#8bc34a',
    '#7cb342',
    '#689f38',
    '#33691e',
    '#e6ee9c',
    '#dce775',
    '#d4e157',
    '#cddc39',
    '#c0ca33',
    '#afb42b',
    '#827717',
    '#fff59d',
    '#fff176',
    '#ffee58',
    '#ffeb3b',
    '#fdd835',
    '#fbc02d',
    '#f57f17',
    '#ffe082',
    '#ffd54f',
    '#ffca28',
    '#ffc107',
    '#ffb300',
    '#ffa000',
    '#ff6f00',
    '#ffcc80',
    '#ffb74d',
    '#ffa726',
    '#ff9800',
    '#fb8c00',
    '#f57c00',
    '#e65100',
    '#ffab91',
    '#ff8a65',
    '#ff7043',
    '#ff5722',
    '#f4511e',
    '#e64a19',
    '#bf360c',
    '#bcaaa4',
    '#a1887f',
    '#8d6e63',
    '#795548',
    '#6d4c41',
    '#5d4037',
    '#3e2723',
    '#eeeeee',
    '#e0e0e0',
    '#bdbdbd',
    '#9e9e9e',
    '#757575',
    '#616161',
    '#212121',
    '#b0bec5',
    '#90a4ae',
    '#78909c',
    '#607d8b',
    '#546e7a',
    '#455a64',
    '#263238'
]

export interface WysiwygEditorProps extends ReactQuillProps {
    suggestions?: string[]
}

const fixSuggestionsDropdown = () => {
    const suggestionsPickerItems = Array.prototype.slice.call(
        document.querySelectorAll('.ql-suggestions .ql-picker-item')
    )
    if (suggestionsPickerItems.length) {
        suggestionsPickerItems.forEach((item) => (item.textContent = item.dataset.value))
        const label = document.querySelector('.ql-suggestions .ql-picker-label')
        if (label && !label.innerHTML.includes('Smarty Tags')) {
            label.innerHTML = 'Smarty Tags ' + label.innerHTML
        }
    }
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = React.forwardRef<
    ReactQuill,
    WysiwygEditorProps
>(({ suggestions = [], ...props }, ref) => {
    const [focused, setFocused] = useState(false)
    const handleFocus = (selection: Range, source: Sources, editor: UnprivilegedEditor) => {
        setFocused(true)
        props.onFocus?.(selection, source, editor)
    }
    const handleBlur = (previousSelection: Range, source: Sources, editor: UnprivilegedEditor) => {
        setFocused(false)
        props.onBlur?.(previousSelection, source, editor)
    }
    const handleSmartyTagInsert = useCallback(function (tag: string, index: number) {
        // @ts-ignore
        const quill = (this as any).quill
        if (quill) {
            const pos = quill.getSelection()?.index ?? 0
            quill.insertEmbed(pos, 'suggestion', { value: tag, index }, 'user')
            quill.insertText(pos + 1, ' ', 'user')
            quill.setSelection(pos + 2, 0, 'user')
        }
    }, [])
    useEffect(() => {
        fixSuggestionsDropdown()
        setTimeout(() => {
            fixSuggestionsDropdown()
        }, 300)
    }, [])
    const modules = React.useMemo(() => {
        return {
            toolbar: {
                container: [
                    'bold',
                    'italic',
                    'underline',
                    'strike',
                    'blockquote',
                    'link',
                    { color: palette },
                    { background: palette },
                    { align: [] },
                    ...(suggestions?.length! > 0 ? [{ suggestions }] : []),
                    'clean'
                ],
                handlers: {
                    suggestions: handleSmartyTagInsert
                }
            },
            history: {
                delay: 2000,
                maxStack: 500,
                userOnly: true
            },
            ...(suggestions?.length! > 0
                ? {
                      suggestion: {
                          source: (searchTerm: string, renderList: (list: string[]) => void) => {
                              if (!searchTerm) {
                                  renderList(suggestions)
                              } else {
                                  const matches = suggestions.filter((suggestion) =>
                                      suggestion.toLowerCase().includes(searchTerm.toLowerCase())
                                  )
                                  renderList(matches)
                              }
                          }
                      } as SuggestionOptions
                  }
                : {})
        }
    }, [suggestions, handleSmartyTagInsert])
    return (
        <div className={clsx(focused && 'focused', 'quill-container')}>
            <ReactQuill
                theme="snow"
                modules={modules}
                {...props}
                onFocus={handleFocus}
                onBlur={handleBlur}
                ref={ref}
            />
        </div>
    )
})

export default WysiwygEditor
