import React from 'react'
import { Container ,Row ,Col, Button ,Form} from 'react-bootstrap'
import { FaPlus} from "react-icons/fa";
import DropDownUI from './DropDownUI'

const LocationCreation = () => {
  return (
    <div>
        <Container>
            <Row>
                <Col lg='12' md='6' xs='6' className='align-self-center'>
                    <div className='bold py-3'> Location Creation</div>
                </Col>
                <Col lg='6' md='6' xs='6' className='d-lg-none d-xs-block'>
                    <div className='page-nav text-end py-3'>
                        <Button className='create-btn'> <FaPlus /></Button>
                    </div>
                </Col>
                <Col lg='3' md='6' xs='12' className='py-2'> 
                    <DropDownUI city={[]} className="select"/> 
                </Col>
                <Col lg='3' md='6' xs='12' className='py-2'> 
                    <div className='d-flex'>
                        
                        <DropDownUI city={[]} className="w-100"/> 
                        <span className='instant-add'><FaPlus /></span>
                    </div>
                </Col>
                <Col lg='3' md='6' xs='12' className='py-2'> 
                    <Form className='form'>
                        <Form.Group className="" controlId="formBasicEmail">
                            <input type="Location" placeholder="Location" className='form-cntrl w-100' />
                        </Form.Group>
                    </Form>
                </Col>
                <Col lg='3' md='6' xs='12' className='align-self-center d-none d-lg-block'>
                    <div className='text-center'>
                        <Button className='create-btn'> <FaPlus /></Button>
                    </div>
                </Col>
                <Col lg='12' md='12' xs='12'>
                    <div className='page-nav text-center py-3'>
                        <Button className='create-btn mx-3 '> Submit</Button>
                        <Button className='create-btn mx-3 '> Cancel</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default LocationCreation