import Quill from 'quill'

const Embed = Quill.import('blots/embed')

class SuggestionBlot extends Embed {
    static create(data: DOMStringMap) {
        const node = super.create()
        node.innerHTML = data.value
        node.dataset.value = data.value
        return node
    }

    static value(domNode: HTMLElement) {
        return domNode.dataset
    }
}

SuggestionBlot.blotName = 'suggestion'
SuggestionBlot.tagName = 'span'
SuggestionBlot.className = 'suggestion'

Quill.register(SuggestionBlot)
