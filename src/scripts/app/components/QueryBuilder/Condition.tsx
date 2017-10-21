import React from 'react'
import { QueryCondition, translate } from './QueryTerm'

const Condition: React.SFC<QueryCondition> = props => (
  <div className="condition">
    <p className="condition--keywords">{props.keywords.join(' ')}</p>
    <p className="condition--operator">{translate.ja[props.operator]}</p>
  </div>
)

export default Condition
