import { Box, CssBaseline } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import { WysiwygState } from './lib/types'
import { createWysiwygState } from './lib/utils'
import WysiwygEditor from './lib/WysiwygEditor'

export const useLocalStorage = <T extends any = any>(
    key: string,
    defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = React.useState<T>(() => {
        const storedValue = window.localStorage.getItem(key)
        return storedValue !== null ? JSON.parse(storedValue) : defaultValue
    })
    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])
    return [value, setValue]
}

function App() {
    const [value, onChange] = useLocalStorage<WysiwygState>('wysiwyg-test-1', createWysiwygState())
    return (
        <ThemeProvider
            theme={createMuiTheme({ typography: { fontFamily: '"Poppins", sans-serif' } })}
        >
            <CssBaseline />
            <Box position="absolute" top={0} right={0} bottom={0} left={0} p={20}>
                <WysiwygEditor
                    suggestions={{
                        'appointment.date': 'Appointment Date',
                        'appointment.duration': 'Service Duration',
                        'appointment.paymentStatus': 'Payment Status',
                        'appointment.price.amount': 'Price',
                        'appointment.price.currency': 'Currency',
                        'appointment.service.name': 'Service Name',
                        'appointment.staff.email': ' Staff Email',
                        'appointment.staff.firstName': ' Staff FirstName',
                        'appointment.staff.lastName': ' Staff LastName',
                        'appointment.staff.phone': ' Staff Phone',
                        'appointment.startTime': 'StartTime',
                        'appointment.status': 'Appointment Status',
                        'business.address': 'Business Address',
                        'business.email': 'Business Email',
                        'business.location': 'Business Location',
                        'business.logo': 'Business Logo',
                        'business.name': 'Business Name',
                        'business.phone': 'Business Phone',
                        'customer.address': ' Customer Address',
                        'customer.email': ' Customer Email',
                        'customer.firstName': ' Customer FirstName',
                        'customer.lastName': ' Customer LastName',
                        'customer.phone': ' Customer Phone',
                        recipientName: 'recipient Name'
                    }}
                    value={value}
                    onChange={onChange}
                />
            </Box>
        </ThemeProvider>
    )
}

export default App
