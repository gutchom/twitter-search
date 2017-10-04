import React from 'react'
import { Operator, QueryCondition, translate } from './QueryTerm'

const Condition: React.SFC<QueryCondition> = props => {
  return (
    <div className="condition">
      <p className="condition--operator">{translate.queryJa[Operator[props.queryOperator]]}</p>
      <p className="condition--keywords">{props.keywords.join(' ')}</p>
      <p className="condition--operator">{translate.keysJa[Operator[props.keywordOperator]]}</p>
    </div>
  )
}

export default Condition
