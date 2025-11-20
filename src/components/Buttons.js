import React from 'react'
import { Button } from 'react-bootstrap'
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { BiSolidCircle } from "react-icons/bi";
import './Button.css'
const ClickButton = ({ label, onClick }) => {
  return (
    <>
      <Button className='create-btn' onClick={onClick}>{label} </Button>
    </>
  )
}
const Delete = ({ label, onClick }) => {
  return (
    <>
      <Button className='delete' onClick={onClick}>{label} </Button>
    </>
  )
}
const Buttons = ({ lable, onClick }) => {
  return (
    <div className='add-new'><Button onClick={onClick}>{lable}</Button></div>
  )
}
const Close = ({ lable, onClick }) => {
  return (
    <div className='close'><Button onClick={onClick}>{lable}</Button></div>
  )
}
const Dltbtn = ({ lable, onClick }) => {
  return (
    <div className='dlt'><Button onClick={onClick}>{lable}</Button></div>
  )
}
const Sale = () => {
  return (
    <div className='sale'><BiSolidUpArrow /></div>
  )
}
const Purchase = () => {
  return (
    <div className='purchase'><BiSolidDownArrow /></div>
  )
}
const OpenStock = () => {
  return (
    <div className='openstock'><BiSolidCircle /></div>
  )
}
const PayIn = () => {
  return (
    <div className='pay-in'><BiSolidCircle /></div>
  )
}
const PayOut = () => {
  return (
    <div className='pay-out'><BiSolidCircle /></div>
  )
}
const DebitNote = () => {
  return (
    <div className='debit-note'><BiSolidCircle /></div>
  )
}
const CreditNote = () => {
  return (
    <div className='credit-note'><BiSolidCircle /></div>
  )
}
const AddMore = ({ lable, onClick }) => {
  return (
    <div className='add-more'><Button onClick={onClick}>{lable}</Button></div>
  )
}
const InstantCreate = ({ label, onClick }) => {
  return (
    <>
      <Button className='instant-add' onClick={onClick}>{label} </Button>
    </>
  )
}
export { ClickButton, Buttons, Sale, Purchase, OpenStock, Close, CreditNote, DebitNote, PayIn, PayOut, Dltbtn, AddMore, Delete, InstantCreate } 