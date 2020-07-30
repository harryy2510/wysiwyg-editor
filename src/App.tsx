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
    <p>Appointment confirmation for <span class="suggestion" data-value="{{customer.firstName}}">{{customer.firstName}}</span>  <span class="suggestion" data-value="{{customer.lastName}}">{{customer.lastName}}</span></p>
    <p></p>
    <table>
        <tr>
            <td>What</td>
            <td>:</td>
            <td><span class="suggestion" data-value="{{appointment.service.name}}">{{appointment.service.name}}</span></td>
        </tr>
        <tr>
            <td>When</td>
            <td>:</td>
            <td><span class="suggestion" data-value="{{appointment.startTime}}">{{appointment.startTime}}</span></td>
        </tr>
        <tr>
            <td>With</td>
            <td>:</td>
            <td><span class="suggestion" data-value="{{appointment.staff.name}}">{{appointment.staff.name}}</span></td>
        </tr>
    </table>
    <p></p>
    <p></p>
    <p>If you require further assistance with your booking or have any questions, you can reach us at:</p>
    <p></p>
    <table>
        <tr>
            <td>Business address</td>
            <td>:</td>
            <td><span class="suggestion" data-value="{{business.address}}">{{business.address}}</span></td>
        </tr>
        <tr>
            <td>Business email</td>
            <td>:</td>
            <td><span class="suggestion" data-value="{{business.email}}">{{business.email}}</span></td>
        </tr>
        <tr>
            <td>Business phone</td>
            <td>:</td>
            <td><span class="suggestion" data-value="{{business.phone}}">{{business.phone}}</span></td>
        </tr>
    </table>
`

function App() {
    const [value, onChange] = React.useState(html)
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                padding: `80px 0`
            }}
        >
            <div style={{ border: `1px solid rgba(0,0,0,0.12)`, maxWidth: 600, margin: 'auto' }}>
                <WysiwygEditor suggestions={suggestions} value={value} onChange={onChange} />
            </div>
        </div>
    )
}

export default App
