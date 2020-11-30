import { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    breakTime: 5,
    sessionTime: 25,
    isRunning: false,
    isOnBreak: false,
    countDownTime: 60000 * 25,
    timerLabel: 'Session',
  };

  // Default time = 25 minutes
  defaultCountDownTime = 1500000;

  // Keeps track of time left and changes session when it hits zero
  countDown = () => {
    const clock = setInterval(() => {
      if (!this.state.isRunning) return clearInterval(clock);
      if (this.state.countDownTime > 3659000)
        this.setState({ countDownTime: 3659000 });

      const secondsLeft = this.state.countDownTime / 1000;
      this.setState({ countDownTime: this.state.countDownTime - 1000 });

      if (!this.state.isOnBreak && !secondsLeft) {
        this.setState({
          countDownTime: this.state.breakTime * 60 * 1000,
          isOnBreak: true,
          timerLabel: 'Break',
        });
      } else if (!secondsLeft) {
        this.soundAlarm();
        this.setState({
          countDownTime: this.state.sessionTime * 60 * 1000,
          isOnBreak: false,
          timerLabel: 'Session',
        });
      }
    }, 1000);
  };

  // Performs function associated with button clicked
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

  // Spinners for break time adjustment
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

  // Spinners for session time adjustment
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

  // Play/pause button for timer
  toggleStartStop = () => {
    this.setState({ isRunning: !this.state.isRunning });
    if (this.state.isRunning) {
      this.countDown();
    }
  };

  // Sets timer back to default, paused state
  resetTimer = () => {
    this.setState({
      isRunning: false,
      breakTime: 5,
      sessionTime: 25,
      isOnBreak: false,
      countDownTime: this.defaultCountDownTime,
      timerLabel: 'Session',
    });
    const audio = document.getElementById('beep');
    audio.pause();
    audio.currentTime = 0;
  };

  // Event listener for button clicks
  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  // Starts beeper alarm when break is over
  soundAlarm = () => {
    const sound = document.getElementById('beep');
    sound.play();
    setTimeout(() => {
      sound.pause();
    }, 3000);
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

// Break time adjustment component
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

// Session time adjustment component
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

// Time remaining section with play/pause and reset buttons
const Timer = ({ props: { isRunning, countDownTime, timerLabel } }) => {
  const time = new Date(+countDownTime);
  const minutes = time.getUTCHours() >= 1 ? 60 : time.getUTCMinutes();
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
