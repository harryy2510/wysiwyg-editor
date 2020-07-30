import Quill from 'quill'
const Parchment = Quill.import('parchment')

class CustomStyleAttributor extends Parchment.StyleAttributor {
    value(domNode: HTMLElement) {
        return super.value(domNode)
    }
}

const allowedBlockStyles = [
    'font-size',
    'border-radius',
    'border',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left'
]

const allowedInlineStyles = ['height', 'width', 'vertical-align']
const StyleAttributors = [
    ...allowedBlockStyles.map(
        (key) =>
            // @ts-ignore
            new CustomStyleAttributor(`${key}`, key, {
                scope: Parchment.Scope.BLOCK
            })
    ),
    ...allowedInlineStyles.map(
        (key) =>
            // @ts-ignore
            new CustomStyleAttributor(`${key}`, key, {
                scope: Parchment.Scope.INLINE
            })
    )
]
export default StyleAttributors
