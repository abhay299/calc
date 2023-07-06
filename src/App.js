/* eslint-disable default-case */
import { useReducer } from 'react';
import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {
  switch(type) {

    case ACTIONS.ADD_DIGIT:
      if (state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (state.currentOperand === Number.POSITIVE_INFINITY) return {};
      if ( payload.digit === "0" && state.currentOperand === "0") return state
      if (payload.digit === "." && state.currentOperand?.includes(".")) return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null){
        return state
      }
      if (state.currentOperand == null) {
        return{
          ...state,
          operation: payload.operation,
        }
      }
      if (state.previousOperand == null) {
        return {
        ...state,
        operation: payload.operation,
        previousOperand: state.currentOperand,
        currentOperand: null,
        }
      }

    return {
      ...state,
      previousOperand: evaluate(state),
      operation: payload.operation,
      currentOperand: null,
      }

    case ACTIONS.CLEAR:
      return {}
    
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite){
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) {
        return state
      }
      if (state.currentOperand === 1) {
        return { ...state, currentOperand: null}
      }

      return{
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

    case ACTIONS.EVALUATE:
      if ( state.operation == null || state.previousOperand == null || state.currentOperand == null ){
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
  }
}

const Integer_Formatter = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
    if (operand == null) return
    const [integer, decimal] = operand.split('.')
    if (decimal == null) return Integer_Formatter.format(integer)
    return `${Integer_Formatter.format(integer)}.${decimal}`
}

function evaluate({ currentOperand, previousOperand, operation}) {
    const prev = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)
    if (isNaN(prev) || isNaN(current)) return ""
    let computation = ""
    switch (operation) {
      case "+":
        computation = prev + current
        break
      case "-":
        computation = prev - current
        break
      case "*":
        computation = prev * current
        break
      case "÷":
        computation = prev / current
        break
    }
    return computation.toString()
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})
  
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
    <button className='span-two' 
      onClick={() => dispatch({type: ACTIONS.CLEAR})}
    >AC</button>
    {/* <button>÷</button> */}
    <button 
      onClick={ () => dispatch({type: ACTIONS.DELETE_DIGIT})}
    >DEL</button>
    <OperationButton operation = "÷" dispatch={dispatch}></OperationButton>
    <DigitButton digit = "1" dispatch={dispatch}></DigitButton>
    <DigitButton digit = "2" dispatch={dispatch}></DigitButton>
    <DigitButton digit = "3" dispatch={dispatch}></DigitButton>
    <OperationButton operation = "*" dispatch={dispatch}></OperationButton>
    <DigitButton digit = "4" dispatch={dispatch}></DigitButton>
    <DigitButton digit = "5" dispatch={dispatch}></DigitButton>
    <DigitButton digit = "6" dispatch={dispatch}></DigitButton>
    <OperationButton operation = "+" dispatch={dispatch}></OperationButton>
    <DigitButton digit = "7" dispatch={dispatch}></DigitButton>
    <DigitButton digit = "8" dispatch={dispatch}></DigitButton>
    <DigitButton digit = "9" dispatch={dispatch}></DigitButton>
    <OperationButton operation = "-" dispatch={dispatch}/>
    <DigitButton digit = "." dispatch={dispatch}/>
    <DigitButton digit = "0" dispatch={dispatch}/>

    <button className='span-two' 
      onClick={() => dispatch({ type: ACTIONS.EVALUATE})}
    >=</button>
    {/* <button>1</button>
    <button>2</button>
    <button>3</button>
    <button>4</button>
    <button>+</button>
    <button>5</button>
    <button>6</button>
    <button>*</button>
    <button>7</button>
    <button>8</button>
    <button>9</button>
    <button>-</button>
    <button>.</button>
    <button>0</button> */}
    
    </div>
  );
}

export default App;
