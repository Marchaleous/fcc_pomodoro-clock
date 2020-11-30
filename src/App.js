import { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    breakTime: 5,
    sessionTime: 25,
    isRunning: false,
    isOnBreak: false,
    isAlarming: false,
    countDownTime: 60 * 25 * 1000,
  };

  defaultCountDownTime = 25 * 60 * 1000;

  formatTime = unformattedTime => {
    const time = new Date(unformattedTime);
    const minutes = time.getUTCHours() >= 1 ? 60 : time.getUTCMinutes();
    const seconds = time.getUTCSeconds();

    const timeString =
      minutes.toString().padStart(2, '0') +
      ':' +
      seconds.toString().padStart(2, '0');

    return timeString;
  };

  countDown = () => {
    const clock = setInterval(() => {
      if (!this.state.isRunning) return clearInterval(clock);

      const timeString = this.formatTime(this.state.countDownTime);
      this.setState({ countDownTime: this.state.countDownTime - 1000 });

      if (!this.state.isOnBreak && timeString === '00:00') {
        this.setState({
          countDownTime: this.state.breakTime * 60 * 1000,
          isOnBreak: true,
        });
      } else if (timeString === '00:00') {
        this.setState({
          countDownTime: this.state.sessionTime * 60 * 1000,
          isOnBreak: false,
        });
        this.soundAlarm();
      }
    }, 1000);
  };

  handleClick = e => {
    e.target.blur();
    const [button, adjustment] = e.target.id.split('-');
    switch (button) {
      case 'break':
        if (adjustment === 'increment' || adjustment === 'decrement') {
          this.adjustBreakTime(adjustment);
        }
        break;
      case 'session':
        if (adjustment === 'increment' || adjustment === 'decrement') {
          this.adjustSessionTime(adjustment);
        }
        break;
      case 'start_stop':
        this.toggleStartStop();
        break;
      case 'reset':
        this.resetTimer();
        break;
      default:
        console.log('invalid button');
    }
  };

  adjustBreakTime = adjustment => {
    if (this.state.isRunning) return;
    this.setState({
      breakTime:
        adjustment === 'increment'
          ? this.state.breakTime + 1
          : this.state.breakTime - 1,
    });
    this.setState({
      breakTime:
        this.state.breakTime < 1
          ? 1
          : this.state.breakTime > 60
          ? 60
          : this.state.breakTime,
    });
  };

  adjustSessionTime = adjustment => {
    if (this.state.isRunning) return;
    this.setState({
      sessionTime:
        adjustment === 'increment'
          ? this.state.sessionTime + 1
          : this.state.sessionTime - 1,
    });
    this.setState({
      sessionTime:
        this.state.sessionTime < 1
          ? 1
          : this.state.sessionTime > 60
          ? 60
          : this.state.sessionTime,
      countDownTime: 60 * 1000 * this.state.sessionTime,
    });
  };

  toggleStartStop = () => {
    this.setState({ isRunning: !this.state.isRunning });
    if (this.state.isRunning) {
      this.countDown();
    }
  };

  resetTimer = () => {
    this.setState({
      isRunning: false,
      breakTime: 5,
      sessionTime: 25,
      isOnBreak: false,
      isAlarming: false,
      countDownTime: this.defaultCountDownTime,
    });
    document.getElementById('beep').pause();
  };

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  soundAlarm = () => {
    const sound = document.getElementById('beep');
    sound.play();
    setTimeout(() => sound.pause(), 2800);
  };

  render() {
    return (
      <div className='App'>
        <div className='container'>
          <div className='flex-row'>
            <Break breakTime={this.state.breakTime} />
            <Session sessionTime={this.state.sessionTime} />
          </div>
          <Timer props={this.state} />
        </div>
      </div>
    );
  }
}

const Break = ({ breakTime }) => {
  return (
    <div>
      <h1 id='break-label'>Break</h1>
      <div className='flex-row'>
        <button className='btn' id='break-decrement'>
          <i className='fas fa-chevron-down' id='break-decrement'></i>
        </button>
        <h1 id='break-length'>{breakTime}</h1>
        <button className='btn' id='break-increment'>
          <i className='fas fa-chevron-up' id='break-increment'></i>
        </button>
      </div>
    </div>
  );
};

const Session = ({ sessionTime }) => {
  return (
    <div>
      <h1 id='session-label'>Session</h1>
      <div className='flex-row'>
        <button className='btn' id='session-decrement'>
          <i className='fas fa-chevron-down' id='session-decrement'></i>
        </button>
        <h1 id='session-length'>{sessionTime}</h1>
        <button className='btn' id='session-increment'>
          <i className='fas fa-chevron-up' id='session-increment'></i>
        </button>
      </div>
    </div>
  );
};

const Timer = ({ props: { isRunning, isOnBreak, countDownTime } }) => {
  const timerLabel = !isOnBreak ? 'Session' : 'Break';

  const time = new Date(countDownTime);
  let minutes = time.getUTCHours() >= 1 ? 60 : time.getUTCMinutes();
  const seconds = time.getUTCSeconds();
  const timeString =
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0');

  return (
    <div className='timer-container'>
      <audio
        src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
        id='beep'
        loop
      ></audio>
      <h2 id='timer-label'>{timerLabel}</h2>
      <h1 id='time-left'>{timeString}</h1>
      <div className='btn-container'>
        <button id='start_stop'>
          <i
            className={isRunning ? 'fas fa-pause fa-2x' : 'fas fa-play fa-2x'}
            id='start_stop'
          ></i>
        </button>
        <button id='reset'>
          <i className='fas fa-redo-alt fa-2x' id='reset'></i>
        </button>
      </div>
    </div>
  );
};

export default App;
