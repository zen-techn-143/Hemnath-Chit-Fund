import React from 'react'
import { FormSelect } from 'react-bootstrap'

const DropDownUI = (props) => {
  return (
    <div className='w-100'>
      <FormSelect className='form-select'>
        <option disabled> Choose City</option>
        {
          props.city.map((data) =>
            <option value={data.value}> {data.title}</option>
          )
        }
      </FormSelect>
    </div>
  )
}

export default DropDownUI
