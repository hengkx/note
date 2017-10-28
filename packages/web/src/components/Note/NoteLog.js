import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import difflib from 'jsdifflib';
import './less/noteLog.less';

class NoteLog extends React.Component {
  static propTypes = {
    getLogList: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    getLogListResult: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      logs: []
    };
  }

  componentDidMount() {
    this.props.getLogList({ id: this.props.id });
  }
  componentWillReceiveProps(nextProps) {
    const { getLogListResult } = nextProps;
    if (getLogListResult !== this.props.getLogListResult) {
      this.setState({ logs: getLogListResult.data });
    }
  }
  handleSelected = (log) => {
    const compare = difflib(log.old.content, log.new.content);
    console.log(compare);
    this.setState({ selectedLog: log, compare });
  }
  renderCompare = () => {
    const { result, baseTextLines, newTextLines } = this.state.compare;
    return result.map((item) => {
      const [type, ob, oe, nb, ne] = item;
      const eles = [];
      if (type === 'replace') {
        for (let i = ob; i < oe; i += 1) {
          eles.push(
            <tr className="remove" key={`o${i}`}>
              <td className="line-number">{i + 1}</td>
              <td className="line-number" />
              <td className="con">{baseTextLines[i]}</td>
            </tr>
          );
        }
        for (let i = nb; i < ne; i += 1) {
          eles.push(
            <tr className="add" key={`n${i}`}>
              <td className="line-number" />
              <td className="line-number">{i + 1}</td>
              <td className="con">{newTextLines[i]}</td>
            </tr>
          );
        }
      } else if (type === 'insert') {
        for (let i = nb; i < ne; i += 1) {
          eles.push(
            <tr className="add" key={`n${i}`}>
              <td className="line-number" />
              <td className="line-number">{i + 1}</td>
              <td className="con">{newTextLines[i]}</td>
            </tr>
          );
        }
      } else if (type === 'equal') {
        for (let i = nb; i < ne; i += 1) {
          eles.push(
            <tr className="equal" key={`n${i}`}>
              <td className="line-number">{i + 1}</td>
              <td className="line-number">{i + 1}</td>
              <td className="con">{newTextLines[i]}</td>
            </tr>
          );
        }
      }
      return eles;
    });
  }
  render() {
    const { logs, selectedLog } = this.state;
    return (
      <div className="log">
        <ul className="nav">
          {logs.map(log => (
            <li key={log.id}>
              <a href="javascript:;" onClick={() => { this.handleSelected(log); }}>{moment.unix(log.created_at).format('YYYY-MM-DD HH:mm:ss')}</a>
            </li>
          ))}
        </ul>
        {selectedLog &&
          <div className="compare">
            <table>
              <tbody>
                {this.renderCompare()}
              </tbody>
            </table>
          </div>
        }
      </div>
    );
  }
}

export default NoteLog;
