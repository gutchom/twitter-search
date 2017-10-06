import React from 'react'
import Modal from 'app/components/Modal'
import Logger from 'app/stores/Logger'
import RevertItem from './RevertItem'
import { QueryCondition } from './QueryTerm'

export interface HistoryProps {
  history: QueryCondition[][]
  isOpen: boolean
  onCancel(): void
  onSubmit(query: QueryCondition[]): void
}

export interface HistoryState {
  positions: number[][]
}

// FIXME 項目選択時にスクロールが頭まで戻る
export default class Revert extends React.Component<HistoryProps, HistoryState> {
  logger = new Logger<number[][]>('history-selected', '1.0', { duration: 0 })

  state = {
    positions: ([[]] as number[][]),
  }

  constructor(props: HistoryProps) {
    super(props)

    this.logger.save([[]])
  }

  handleChange = (position: number[]) => {
    const filtered = this.state.positions
      .filter(selected => !(position[0] === selected[0] && position[1] === selected[1]))
    const positions = filtered.length < this.state.positions.length ? filtered : filtered.concat([position])

    this.logger.save(positions)
    this.setState({ positions })
  }

  handleUndo = () => {
    if (this.logger.canUndo) {
      this.logger.undo()
      this.setState({ positions: this.logger.load() })
    }
  }

  handleRedo = () => {
    if (this.logger.canRedo) {
      this.logger.redo()
      this.setState({ positions: this.logger.load() })
    }
  }

  handleSubmit = () => {
    const query = this.state.positions
      .slice(1)
      .sort((a, b) => a[1] - b[1])
      .sort((a, b) => a[0] - b[0])
      .map(pos => this.props.history[pos[0]][pos[1]])

    this.props.onSubmit(query)
    this.logger.empty().save([[]])
    this.setState({ positions: [[]] })
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen}
             onClose={this.props.onCancel}
             header={<h1><i className="fa fa-clock-o"/>履歴</h1>}
             footer={
               <div>
                 <button className={this.logger.canUndo ? 'enable' : ''} onClick={this.handleUndo}>
                   <i className="fa fa-undo"/>
                 </button>
                 <button className={this.logger.canRedo ? 'enable' : ''} onClick={this.handleRedo}>
                   <i className="fa fa-repeat"/>
                 </button>
                 <button className={'submit ' + (this.logger.canUndo ? 'enable' : '')} onClick={this.handleSubmit}>
                   決定
                 </button>
               </div>
             }>
        <ul className="history">
          {this.props.history.map((query, historyIndex) =>
            <li className="history--item" key={historyIndex}>
              <ul>
                {query.map((condition, queryIndex) =>
                  <RevertItem key={queryIndex}
                               checked={-1 !== this.state.positions.findIndex(position =>
                                 position[0] === historyIndex && position[1] === queryIndex)}
                               position={[historyIndex, queryIndex]}
                               condition={condition}
                               onChange={this.handleChange}/>
                )}
              </ul>
            </li>
          )}
        </ul>
      </Modal>
    )
  }
}
