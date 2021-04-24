import Quill, { Sources, RangeStatic } from 'quill'
import './blots/suggestion'
import Delta from 'quill-delta'
import Keys from './constants'
import './quill.suggestion.scss'
import { getSuggestionCharIndex, hasValidChars, hasValidSuggestionCharIndex } from './utils'

export interface SuggestionOptions {
    source?: null | ((searchTerm: string, renderList: (list: string[]) => void) => void)
    onSelect?: (item: DOMStringMap, callback: (item: DOMStringMap) => void) => void
    suggestionDenotationChars?: string[]
    allowedChars?: RegExp
    minChars?: number
    maxChars?: number
    offsetTop?: number
    offsetLeft?: number
    isolateCharacter?: boolean
    fixSuggestionsToQuill?: boolean
    defaultMenuOrientation?: 'top' | 'bottom'
    blotName?: string
    dataAttributes?: string[]
    onOpen?: () => void
    onClose?: () => void
    listItemClass?: string
    suggestionContainerClass?: string
    suggestionListClass?: string
    spaceAfterInsert?: boolean
}

class Suggestion {
    isOpen: boolean
    itemIndex: number
    suggestionCharPos: number | null
    cursorPos: number | null
    values: string[]
    suspendMouseEnter: boolean
    quill: Quill
    options: SuggestionOptions

    suggestionContainer: HTMLDivElement
    suggestionList: HTMLUListElement

    constructor(quill: Quill, options?: SuggestionOptions) {
        this.isOpen = false
        this.itemIndex = 0
        this.suggestionCharPos = null
        this.cursorPos = null
        this.values = []
        this.suspendMouseEnter = false

        this.quill = quill

        this.options = {
            source: null,
            onSelect(item, insertItem) {
                insertItem(item)
            },
            suggestionDenotationChars: ['{{'],
            allowedChars: /^[A-Za-z.]*$/,
            minChars: 0,
            maxChars: 31,
            offsetTop: 2,
            offsetLeft: 0,
            isolateCharacter: false,
            fixSuggestionsToQuill: false,
            defaultMenuOrientation: 'bottom',
            blotName: 'suggestion',
            dataAttributes: ['id', 'value'],
            onOpen() {
                return true
            },
            onClose() {
                return true
            },
            listItemClass: 'ql-suggestion-list-item',
            suggestionContainerClass: 'ql-suggestion-list-container',
            suggestionListClass: 'ql-suggestion-list',
            spaceAfterInsert: true,
            ...(options ?? {})
        }

        this.suggestionContainer = document.createElement('div')
        this.suggestionContainer.className = this.options.suggestionContainerClass
            ? this.options.suggestionContainerClass
            : ''
        this.suggestionContainer.style.cssText = 'display: none; position: absolute;'
        this.suggestionContainer.onmousemove = this.onContainerMouseMove.bind(this)

        if (this.options.fixSuggestionsToQuill) {
            this.suggestionContainer.style.width = 'auto'
        }

        this.suggestionList = document.createElement('ul')
        this.suggestionList.className = this.options.suggestionListClass
            ? this.options.suggestionListClass
            : ''
        this.suggestionContainer.appendChild(this.suggestionList)

        const _quill: any = this.quill
        _quill.container.appendChild(this.suggestionContainer)
        _quill.on('text-change', this.onTextChange.bind(this))
        _quill.on('selection-change', this.onSelectionChange.bind(this))

        _quill.keyboard.addBinding(
            {
                key: Keys.TAB
            },
            this.selectHandler.bind(this)
        )
        _quill.keyboard.bindings[Keys.TAB].unshift(_quill.keyboard.bindings[Keys.TAB].pop())

        _quill.keyboard.addBinding(
            {
                key: Keys.ENTER
            },
            this.selectHandler.bind(this)
        )
        _quill.keyboard.bindings[Keys.ENTER].unshift(_quill.keyboard.bindings[Keys.ENTER].pop())

        _quill.keyboard.addBinding(
            {
                key: Keys.ESCAPE
            },
            this.escapeHandler.bind(this)
        )

        _quill.keyboard.addBinding(
            {
                key: Keys.UP
            },
            this.upHandler.bind(this)
        )
        _quill.keyboard.bindings[Keys.UP].unshift(_quill.keyboard.bindings[Keys.UP].pop())

        _quill.keyboard.addBinding(
            {
                key: Keys.DOWN
            },
            this.downHandler.bind(this)
        )
        _quill.keyboard.bindings[Keys.DOWN].unshift(_quill.keyboard.bindings[Keys.DOWN].pop())

        _quill.keyboard.addBinding(
            {
                key: Keys.BACKSPACE
            },
            this.backspaceHandler.bind(this)
        )
        _quill.keyboard.bindings[Keys.BACKSPACE].unshift(
            _quill.keyboard.bindings[Keys.BACKSPACE].pop()
        )

        _quill.keyboard.addBinding(
            {
                key: Keys.DELETE
            },
            this.deleteHandler.bind(this)
        )
        _quill.keyboard.bindings[Keys.DELETE].unshift(_quill.keyboard.bindings[Keys.DELETE].pop())
    }

    selectHandler() {
        if (this.isOpen) {
            this.selectItem()
            return false
        }
        return true
    }

    escapeHandler() {
        if (this.isOpen) {
            this.hideSuggestionList()
            return false
        }
        return true
    }

    upHandler() {
        if (this.isOpen) {
            this.prevItem()
            return false
        }
        return true
    }

    downHandler() {
        if (this.isOpen) {
            this.nextItem()
            return false
        }
        return true
    }

    backspaceHandler() {
        if (typeof this.cursorPos === 'number') {
            const [leaf, position] = this.quill.getLeaf(this.cursorPos)
            if (leaf.statics.blotName === 'suggestion' && position === 1) {
                leaf.remove()
                return false
            }
        }
        return true
    }

    deleteHandler() {
        if (typeof this.cursorPos === 'number') {
            const [leaf, position] = this.quill.getLeaf(this.cursorPos)
            if (leaf.statics.blotName === 'suggestion' && position === 0) {
                leaf.remove()
                return false
            }
        }
        return true
    }

    showSuggestionList() {
        this.suggestionContainer.style.visibility = 'hidden'
        this.suggestionContainer.style.display = ''
        this.setSuggestionContainerPosition()
        this.setIsOpen(true)
    }

    hideSuggestionList() {
        this.suggestionContainer.style.display = 'none'
        this.setIsOpen(false)
    }

    highlightItem() {
        const el = this.suggestionList.childNodes[this.itemIndex] as any
        for (let i = 0; i < this.suggestionList.childNodes.length; i += 1) {
            ;(this.suggestionList.childNodes[i] as any).classList.remove('selected')
        }
        el.classList.add('selected')
        el.scrollIntoView({
            block: 'nearest',
            inline: 'nearest'
        })
    }

    getItemData() {
        return (this.suggestionList.childNodes[this.itemIndex] as any).dataset
    }

    onContainerMouseMove() {
        this.suspendMouseEnter = false
    }

    selectItem() {
        const data = this.getItemData()
        this.options.onSelect?.(data, (asyncData) => {
            this.insertItem(asyncData)
        })
        this.hideSuggestionList()
    }

    insertItem(data: DOMStringMap | null) {
        const render = data
        if (render === null) {
            return
        }
        const prevSuggestionCharPos = this.suggestionCharPos!
        this.quill.deleteText(
            this.suggestionCharPos!,
            this.cursorPos! - this.suggestionCharPos!,
            'user'
        )
        this.quill.insertEmbed(prevSuggestionCharPos!, this.options.blotName!, render, 'user')
        if (this.options.spaceAfterInsert) {
            this.quill.insertText(prevSuggestionCharPos + 1, ' ', 'user')
            this.quill.setSelection(prevSuggestionCharPos + 2, 0, 'user')
        } else {
            this.quill.setSelection(prevSuggestionCharPos + 1, 0, 'user')
        }
        this.hideSuggestionList()
    }

    onItemMouseEnter(e: any) {
        if (this.suspendMouseEnter) {
            return
        }
        const index = Number(e.target!.dataset.index)
        if (!Number.isNaN(index) && index !== this.itemIndex) {
            this.itemIndex = index
            this.highlightItem()
        }
    }

    onItemClick(e: any) {
        e.preventDefault()
        e.stopImmediatePropagation()
        this.itemIndex = e.currentTarget.dataset.index
        this.highlightItem()
        this.selectItem()
    }

    renderList(data: string[]) {
        if (data && data.length > 0) {
            this.values = data
            this.suggestionList.innerHTML = ''

            for (let i = 0; i < data.length; i += 1) {
                const li = document.createElement('li')
                li.className = this.options.listItemClass ? this.options.listItemClass : ''
                li.dataset.index = i.toString()
                li.innerHTML = data[i]
                li.onmouseenter = this.onItemMouseEnter.bind(this)
                li.onclick = this.onItemClick.bind(this)
                li.dataset.value = data[i]
                this.suggestionList.appendChild(li)
            }
            this.itemIndex = 0
            this.highlightItem()
            this.showSuggestionList()
        } else {
            this.hideSuggestionList()
        }
    }

    nextItem() {
        this.itemIndex = (this.itemIndex + 1) % this.values.length
        this.suspendMouseEnter = true
        this.highlightItem()
    }

    prevItem() {
        this.itemIndex = (this.itemIndex + this.values.length - 1) % this.values.length
        this.suspendMouseEnter = true
        this.highlightItem()
    }

    containerBottomIsNotVisible(topPos: number, containerPos: DOMRect) {
        const suggestionContainerBottom =
            topPos + this.suggestionContainer.offsetHeight + containerPos.top
        return suggestionContainerBottom > window.pageYOffset + window.innerHeight
    }

    containerRightIsNotVisible(leftPos: number, containerPos: DOMRect) {
        if (this.options.fixSuggestionsToQuill) {
            return false
        }

        const rightPos = leftPos + this.suggestionContainer.offsetWidth + containerPos.left
        const browserWidth = window.pageXOffset + document.documentElement.clientWidth
        return rightPos > browserWidth
    }

    setIsOpen(isOpen: boolean) {
        if (this.isOpen !== isOpen) {
            if (isOpen) {
                this.options.onOpen?.()
            } else {
                this.options.onClose?.()
            }
            this.isOpen = isOpen
        }
    }

    setSuggestionContainerPosition() {
        const containerPos = (this.quill as any).container.getBoundingClientRect()
        const suggestionCharPos = this.quill.getBounds(this.suggestionCharPos!)
        const containerHeight = this.suggestionContainer.offsetHeight

        let topPos = this.options.offsetTop!
        let leftPos = this.options.offsetLeft!

        // handle horizontal positioning
        if (this.options.fixSuggestionsToQuill) {
            const rightPos = 0
            this.suggestionContainer.style.right = `${rightPos}px`
        } else {
            leftPos += suggestionCharPos.left
        }

        if (this.containerRightIsNotVisible(leftPos, containerPos)) {
            const containerWidth = this.suggestionContainer.offsetWidth + this.options.offsetLeft!
            const quillWidth = containerPos.width
            leftPos = quillWidth - containerWidth
        }

        if (this.options.defaultMenuOrientation === 'top') {
            if (this.options.fixSuggestionsToQuill) {
                topPos = -1 * (containerHeight + this.options.offsetTop!)
            } else {
                topPos = suggestionCharPos.top - (containerHeight + this.options.offsetTop!)
            }
            if (topPos + containerPos.top <= 0) {
                let overSuggestionCharPos = this.options.offsetTop!

                if (this.options.fixSuggestionsToQuill) {
                    overSuggestionCharPos += containerPos.height
                } else {
                    overSuggestionCharPos += suggestionCharPos.bottom
                }

                topPos = overSuggestionCharPos
            }
        } else {
            if (this.options.fixSuggestionsToQuill) {
                topPos += containerPos.height
            } else {
                topPos += suggestionCharPos.bottom
            }

            if (this.containerBottomIsNotVisible(topPos, containerPos)) {
                let overSuggestionCharPos = this.options.offsetTop! * -1

                if (!this.options.fixSuggestionsToQuill) {
                    overSuggestionCharPos += suggestionCharPos.top
                }

                topPos = overSuggestionCharPos - containerHeight
            }
        }

        if (topPos >= 0) {
            this.options.suggestionContainerClass!.split(' ').forEach((className) => {
                this.suggestionContainer.classList.add(`${className}-bottom`)
                this.suggestionContainer.classList.remove(`${className}-top`)
            })
        } else {
            this.options.suggestionContainerClass!.split(' ').forEach((className) => {
                this.suggestionContainer.classList.add(`${className}-top`)
                this.suggestionContainer.classList.remove(`${className}-bottom`)
            })
        }

        this.suggestionContainer.style.top = `${topPos}px`
        this.suggestionContainer.style.left = `${leftPos}px`

        this.suggestionContainer.style.visibility = 'visible'
    }

    getTextBeforeCursor() {
        const startPos = Math.max(0, this.cursorPos! - this.options.maxChars!)
        return this.quill.getText(startPos, this.cursorPos! - startPos)
    }

    onSomethingChange() {
        const range = this.quill.getSelection()
        if (range == null) return

        this.cursorPos = range.index
        const textBeforeCursor = this.getTextBeforeCursor()
        const { suggestionChar, suggestionCharIndex } = getSuggestionCharIndex(
            textBeforeCursor,
            this.options.suggestionDenotationChars!
        )

        if (
            hasValidSuggestionCharIndex(
                suggestionCharIndex,
                textBeforeCursor,
                this.options.isolateCharacter!
            )
        ) {
            const suggestionCharPos =
                this.cursorPos - (textBeforeCursor.length - suggestionCharIndex)
            this.suggestionCharPos = suggestionCharPos
            const textAfter = textBeforeCursor.substring(
                suggestionCharIndex + suggestionChar!.length
            )
            if (
                textAfter.length >= this.options.minChars! &&
                hasValidChars(textAfter, this.options.allowedChars!)
            ) {
                this.options.source?.(textAfter, this.renderList.bind(this))
            } else {
                this.hideSuggestionList()
            }
        } else {
            this.hideSuggestionList()
        }
    }

    onTextChange(delta: Delta, oldContents: Delta, source: Sources) {
        if (source === 'user') {
            this.onSomethingChange()
        }
    }

    onSelectionChange(range: RangeStatic) {
        if (range && range.length === 0) {
            this.onSomethingChange()
        } else {
            this.hideSuggestionList()
        }
    }
}

export default Suggestion
