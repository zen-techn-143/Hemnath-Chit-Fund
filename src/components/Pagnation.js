import React from 'react'
import {Button} from 'react-bootstrap'
import { MdChevronRight,MdChevronLeft } from "react-icons/md";
import '../App.css'
const Pagnation = () => {
  return (
    <div>
        <div className='navbar'>
            <div className='ms-auto '>
              <span className='role '> Viewing <span className='fw-bolder' >1-10</span> of <span className='fw-bolder'> 26</span></span>
                <Button href="#home" className='page-nav-link'><MdChevronLeft /></Button>
                <Button href="#home"  className='page-nav-link'><MdChevronRight /></Button>
            </div>
        </div>
    </div>
  )
}

export default Pagnation