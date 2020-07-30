import Quill, { StringMap } from 'quill'
import 'quill/dist/quill.bubble.css'
import React from 'react'
import ReactQuill, { ReactQuillProps } from './ReactQuill'
import Suggestion, { SuggestionOptions } from './suggestion/quill.suggestion'
import './suggestion/quill.suggestion.css'
import './WysiwygEditor.scss'

import StyleAttributors from './attributors/StyleAttributors'
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

export const defaultModules: StringMap = {
    toolbar: [
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'link',
        { color: palette },
        { background: palette },
        { align: [] },
        'clean'
    ]
}

export interface WysiwygEditorProps extends ReactQuillProps {
    suggestions?: string[]
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = React.forwardRef<
    ReactQuill,
    WysiwygEditorProps
>(({ suggestions = [], ...props }, ref) => {
    const modules = React.useMemo(() => {
        return {
            ...defaultModules,
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
    }, [suggestions])
    return <ReactQuill theme="bubble" modules={modules} {...props} ref={ref} />
})

export default WysiwygEditor
