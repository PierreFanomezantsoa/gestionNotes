import React from 'react'

function Formulaire({ type, label, placeholder, fieldRef, hasError, options = [] }) {
  const classe = `form-control w-full px-4 py-2 
  text-700 dark:text-black  border rounded-lg
  border-1 border-gray-400 
  focus:border-purple-600 
 `;

  return (
    <div className='form-group mb-7'>
      <label className='block text-gray-700 text-sm font-bold mb-2'>{label} <span className='text-red-500'>*</span></label>
      {type === 'textarea' ? (
        <textarea className={classe} rows="3" placeholder={placeholder} {...fieldRef} />
      ) : type === 'select' ? (
        <select className={classe} {...fieldRef}>
          <option value="" disabled>{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input className={classe} type={type} placeholder={placeholder} {...fieldRef} />
      )}
      {hasError && <p className='text-red-500 text-2xs font-serif lowercase'>{`${label} et vide !`}</p>}
    </div>
  )
}

export default Formulaire;
