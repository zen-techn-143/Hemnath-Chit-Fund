import React from 'react'
import { Container,Row,Col } from 'react-bootstrap'
import { FaAngleRight, } from "react-icons/fa";
const MobileView = ({sno,name,subname,dataflow}) => {
  return (
    <div className='regular'>
        <Container>
            <Row>
                <Col lg='12' md='12' xs='12' className='px-0'>
                <div className='py-1'>
                    <div className='bg-light'>
                        <div className='user-data'>
                            <div className='sno'>{sno}</div>
                            <div className='user-name'>
                                <div>{name}</div>
                                {subname? <span className='role'> {subname}</span> : "" }
                            </div>
                            { dataflow ? <div className='data-flow'>{dataflow}</div> : ""}
                            <div className='action-button'><a href="#action" className='action'><FaAngleRight /></a></div>
                        </div>
                    </div>
                </div>
            </Col>
            </Row>
        </Container>
    </div>
  )
}

export default MobileView