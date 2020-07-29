import React from 'react'
import WysiwygEditor from './lib/WysiwygEditor'

const suggestions = Object.keys({
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
}).map((sug) => `{{${sug}}}`)

const html = `
    <p></p>
    <table>
        <tr>
            <td>What</td>
            <td>:</td>
            <td>{{appointment.service.name}}</td>
        </tr>
        <tr>
            <td>When</td>
            <td>:</td>
            <td>{{appointment.startTime}}</td>
        </tr>
        <tr>
            <td>With</td>
            <td>:</td>
            <td>{{appointment.staff.name}}</td>
        </tr>
    </table>
    <p></p>
    <p></p>
    <p></p>
`

function App() {
    const [value, onChange] = React.useState(html)
    return (
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, padding: 160 }}>
            <WysiwygEditor suggestions={suggestions} value={value} onChange={onChange} />
        </div>
    )
}

export default App
