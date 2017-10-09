import React from 'react'
import Modal from 'app/components/Modal'
import Logger from 'app/stores/Logger'
import RevertItem from './RevertItem'
import { QueryCondition } from './QueryTerm'

export interface HistoryProps {
  history: QueryCondition[][]
  visible: boolean
  onCancel(): void
  onSubmit(query: QueryCondition[]): void
}

export interface HistoryState {
  cursor: number
  selected: number[][]
}

export default class Revert extends React.Component<HistoryProps, HistoryState> {
  logger = new Logger<number[][]>('revert-selected', '1.0', { duration: 0 })
  positions: number[][]

  state = {
    cursor: -1,
    selected: ([[]] as number[][]),
  }

  constructor(props: HistoryProps) {
    super(props)

    this.logger.save([[]])
  }

  get cursor(): number { return this.state.cursor }

  set cursor(next: number) {
    const length = this.positions.length
    const cursor = next >= length ? length - 1 : next >= 0 ? next : 0

    this.setState({ cursor })
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  componentWillReceiveProps(nextProps: HistoryProps) {
    if (nextProps.visible && !this.props.visible) {
      this.logger.empty().save([[]])
      this.setState({ cursor: -1, selected: [[]]})
      document.addEventListener('keydown', this.handleKeyDown)
    }
    if (!nextProps.visible && this.props.visible) {
      document.removeEventListener('keydown', this.handleKeyDown)
    }

    this.positions = this.props.history
      .reduce((flatten: number[][], _, index0) => flatten.concat(_.map((_, index1) => [index0, index1])), [])
  }

  handleKeyDown = (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case 13: // Enter
        this.handleSubmit()
        break

      case 27: // Escape
        this.props.onCancel()
        break

      case 32: // Space
        this.cursor >= 0 && this.handleChange(this.positions[this.cursor])
        break

      case 37: // ArrowLeft
        this.handleUndo()
        break

      case 38: // ArrowUp
        this.cursor--
        break

      case 39: // ArrowRight
        this.handleRedo()
        break

      case 40: // ArrowDown
        this.cursor++
        break

      default:
        break
    }
  }

  handleChange = (position: number[]) => {
    const filtered = this.state.selected.filter(old => !(position[0] === old[0] && position[1] === old[1]))
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
    if (this.state.selected.length > 1) {
      const query = this.state.selected
        .slice(1)
        .sort((a, b) => a[1] - b[1])
        .sort((a, b) => a[0] - b[0])
        .map(pos => this.props.history[pos[0]][pos[1]])

      this.setState({ cursor: -1, selected: [[]] })
      this.logger.empty().save([[]])
      this.props.onSubmit(query)
    }
  }

  render() {
    return (
      <Modal visible={this.props.visible}
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
                 <button className={'submit ' + (this.state.selected.length > 1 ? 'enable' : '')}
                         onClick={this.handleSubmit}>決定</button>
               </div>
             }>
        <ul className="history">
          {this.props.history.map((query, index0) =>
            <li className="history--item" key={index0}>
              <ul>
                {query.map((condition, index1) =>
                  <RevertItem key={index1}
                              checked={-1 !== this.state.selected.findIndex(selected =>
                                selected[0] === index0 && selected[1] === index1)}
                              focusing={-1 !== this.cursor &&
                                this.positions[this.cursor][0] === index0 && this.positions[this.cursor][1] === index1}
                              position={[index0, index1]}
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
