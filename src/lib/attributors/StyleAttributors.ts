import Quill from 'quill'
const Parchment = Quill.import('parchment')

class CustomStyleAttributor extends Parchment.StyleAttributor {
    value(domNode: HTMLElement) {
        return super.value(domNode)
    }
}

const allowedStyles = [
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
const StyleAttributors = allowedStyles.reduce<CustomStyleAttributor[]>(
    (result, key) => [
        ...result,
        // @ts-ignore
        new CustomStyleAttributor(`${key}`, key, {
            scope: Parchment.Scope.BLOCK
        })
    ],
    []
)
export default StyleAttributors
