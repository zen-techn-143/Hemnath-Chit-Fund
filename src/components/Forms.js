import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TextInputForm = ({
  placeholder,
  name,
  type,
  suffix_icon,
  prefix_icon,
  labelname,
  value,
  onChange,
  onKeyDown,
  autoFocus,
  disabled,
  onBlur,
}) => {
  return (
    <>
      <div className="pb-2">{labelname ? <label>{labelname}</label> : ""}</div>
      <div className="form-icon">
        <Form.Group className="">
          {prefix_icon ? (
            <span className="prefix-icon">{prefix_icon}</span>
          ) : (
            ""
          )}
          <input
            type={type}
            placeholder={placeholder}
            name={name}
            className={`form-cntrl w-100 
                        ${
                          prefix_icon && suffix_icon
                            ? "form-control-padboth"
                            : prefix_icon
                            ? "form-control-padleft"
                            : suffix_icon
                            ? "form-control-padright"
                            : ""
                        }`}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
            onBlur={onBlur}
            disabled={disabled}
          />
          {suffix_icon ? (
            <span className="suffix-icon">{suffix_icon}</span>
          ) : (
            ""
          )}
        </Form.Group>
      </div>
    </>
  );
};

const DropDown = ({ placeholder, optionlist, labelname }) => {
  return (
    <>
      <div className="pb-2">{labelname ? <label>{labelname}</label> : ""}</div>
      <div className="w-100 d-flex">
        <Select
          placeholder={placeholder}
          options={optionlist}
          labelField="title"
          valueField="value"
          multi
          className="w-100"
        ></Select>
        {/* <InstantCreate label={<BiPlus />} className='instant-add' onClick={console.log('I was triggered during render')}></InstantCreate> */}
      </div>
    </>
  );
};
const DropDownUI = ({
  optionlist = [],
  className,
  name,
  labelname,
  placeholder,
  value,
  onChange,
  modeltitle = "create",
}) => {
  const handleChange = (selectedOption) => {
    const selectedValue = selectedOption.value;
    if (selectedValue !== value) {
      onChange({
        ...value,
        [name]: selectedValue,
      });
    }
  };

  // Find the selected option based on the current value
  const selectedOption = optionlist.find((option) => option.label === value);

  return (
    <>
      <div className="pb-2">{labelname ? <label>{labelname}</label> : ""}</div>

      <div className="w-100 d-flex">
        <Select
          placeholder={placeholder}
          options={optionlist}
          labelField="label"
          valueField="value"
          value={selectedOption} // Set the selected option
          onChange={handleChange}
          multi
          className="w-100"
        />
      </div>
    </>
  );
};

const Calender = ({ setLabel, calenderlabel, initialDate, disabled }) => {
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    if (initialDate) {
      setStartDate(new Date(initialDate));
    }
  }, [initialDate]);

  return (
    <>
      <div className="pb-2 px-3">
        <label>{calenderlabel}</label>
      </div>
      <DatePicker
        selected={startDate}
        onChange={(date) => {
          setStartDate(date);
          setLabel(date, "date");
        }}
        dateFormat="dd/MM/yyyy"
        className="w-100 form-cntrl"
        selectsStart
        startDate={startDate}
        disabled={disabled}
      />
    </>
  );
};
const TextArea = ({ placeholder, label, value, onChange }) => {
  return (
    <div className="form-group w-100">
      <div>
        <label className="form-label">{label}</label>
      </div>
      <textarea
        className="form-cntrl w-100"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></textarea>
    </div>
  );
};
const FileUpload = ({ label, OnChange }) => {
  return (
    <>
      <div>
        <label className="form-label">{label}</label>
      </div>
      <label className="file-input-label">
        <input type="file" onChange={OnChange} />
      </label>
    </>
  );
};
export { TextInputForm, DropDown, Calender, DropDownUI, TextArea, FileUpload };
