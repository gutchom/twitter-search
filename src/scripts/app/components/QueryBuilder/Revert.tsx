import React from 'react'
import Modal from 'app/components/Modal'
import Logger from 'app/stores/Logger'
import RevertItem from './RevertItem'
import equal from 'app/lib/equal'
import classes from 'app/lib/classNames'
import { QueryCondition } from './QueryTerm'

type Position = number[]

export interface HistoryProps {
  history: QueryCondition[][]
  visible: boolean
  onCancel(): void
  onSubmit(query: QueryCondition[]): void
}

export interface HistoryState {
  selected: Position[]
}

export default class Revert extends React.Component<HistoryProps, HistoryState> {
  logger = new Logger<number[][]>('revert-selected', 1.0)
  positions: Position[]
  state = {
    selected: ([] as Position[]),
  }

  constructor(props: HistoryProps) {
    super(props)

    this.logger.save([])
  }

  componentWillReceiveProps(nextProps: HistoryProps) {
    if (nextProps.visible && !this.props.visible) {
      this.logger.empty().save([])
      this.setState({ selected: []})
    }

    this.positions = this.props.history
      .reduce((flatten: Position[], _, index0) => flatten.concat(_.map((_, index1) => [index0, index1])), [])
  }

  handleChange = (position: Position) => {
    const filtered = this.state.selected.filter(old => !equal(old, position))
    const selected = filtered.length < this.state.selected.length ? filtered : filtered.concat([position])

    this.logger.save(selected)
    this.setState({ selected })
  }

  handleUndo = () => {
    if (this.logger.canUndo) {
      this.setState({ selected: this.logger.undo() })
    }
  }

  handleRedo = () => {
    if (this.logger.canRedo) {
      this.setState({ selected: this.logger.redo() })
    }
  }

  handleSubmit = () => {
    if (this.state.selected.length > 0) {
      const query = this.state.selected
        .slice(0)
        .sort((a, b) => a[1] - b[1])
        .sort((a, b) => a[0] - b[0])
        .map(pos => this.props.history[pos[0]][pos[1]])

      this.setState({ selected: [] })
      this.logger.empty().save([])
      this.props.onSubmit(query)
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onClose={this.props.onCancel}
        header={<h1><i className="fa fa-clock-o"/>履歴</h1>}
        footer={(
          <div>
            <button className={classes({ enable: this.logger.canUndo })} onClick={this.handleUndo}>
              <i className="fa fa-undo"/>
            </button>
            <button className={classes({ enable: this.logger.canRedo })} onClick={this.handleRedo}>
              <i className="fa fa-repeat"/>
            </button>
            <button className={classes('submit', { enable: this.state.selected.length })} onClick={this.handleSubmit}>
              決定
            </button>
          </div>
        )}
      >
        <ul className="history">
          {this.props.history.map((query, index0) => (
            <li className="history--group" key={index0}>
              <ul>
                {query.map((condition, index1) => (
                  <RevertItem
                    key={index1}
                    checked={-1 !== this.state.selected.findIndex(selected => equal(selected, [index0, index1]))}
                    position={[index0, index1]}
                    condition={condition}
                    onChange={this.handleChange}
                  />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Modal>
    )
  }
}
