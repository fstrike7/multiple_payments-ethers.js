import React from 'react'
import { Input } from '@chakra-ui/input'

function CustomInput(props) {
    return (
        <Input 
          type="text"
          name={props.name}
          placeholder={props.placeholder}
          required
        />
    )
}

export default CustomInput
