import { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    countDownTime: 1500000,
    sessionTime: 25,
    breakTime: 5,
    isRunning: false,
    isOnBreak: false,
  };

  // Formats countdown timer in mm:ss
  timeString = () => {
    const time = new Date(this.state.countDownTime);
    const mm = time.getUTCHours() >= 1 ? 60 : time.getUTCMinutes();
    const ss = time.getUTCSeconds();
    return (
      mm.toString().padStart(2, '0') + ':' + ss.toString().padStart(2, '0')
    );
  };

  // Keeps track of time left and changes session when it hits zero
  countDown = () => {
    console.log(
      'B: ' + this.state.breakTime,
      'S: ' + this.state.sessionTime,
      'ms: ' + this.state.countDownTime / 60
    );
    const clock = setInterval(() => {
      if (!this.state.isRunning) return clearInterval(clock);

      if (!this.state.isOnBreak && !this.state.countDownTime) {
        this.setState({
          isOnBreak: true,
          countDownTime: this.state.breakTime * 60000,
        });
      } else if (!this.state.countDownTime) {
        this.soundAlarm();
        this.setState({
          isOnBreak: false,
          countDownTime: this.state.sessionTime * 60000,
        });
      } else this.setState({ countDownTime: this.state.countDownTime - 50 });
    }, 50);
  };

  // Performs function associated with button clicked
  handleClick = e => {
    const [button, adjustment] = e.target.id.split('-');
    switch (button) {
      case 'break':
      case 'session':
        if (adjustment === 'increment' || adjustment === 'decrement') {
          this.adjustTime(button, adjustment);
        }
        break;
      case 'start_stop':
        this.toggleStartStop();
        break;
      case 'reset':
        this.resetTimer();
        break;
      default:
    }
  };

  // Spinners for time adjustment
  adjustTime = (button, adjustment) => {
    const time = button === 'session' ? 'sessionTime' : 'breakTime';
    if (this.state.isRunning) return;
    this.setState({
      [time]:
        adjustment === 'increment'
          ? this.state[time] + 1
          : this.state[time] - 1,
    });
    this.setState({
      [time]:
        this.state[time] < 1
          ? 1
          : this.state[time] > 60
          ? 60
          : this.state[time],
      countDownTime: 60000 * this.state.sessionTime,
    });
  };

  // Play/pause button for timer
  toggleStartStop = () => {
    this.setState({ isRunning: !this.state.isRunning });
    if (this.state.isRunning) this.countDown();
  };

  // Sets timer back to default, paused state
  resetTimer = () => {
    const audio = document.getElementById('beep');
    audio.pause();
    audio.currentTime = 0;
    this.setState({
      countDownTime: 1500000,
      sessionTime: 25,
      breakTime: 5,
      isRunning: false,
      isOnBreak: false,
    });
  };

  // Starts beeper alarm when break is over
  soundAlarm = () => {
    const sound = document.getElementById('beep');
    sound.play();
    setTimeout(() => {
      sound.pause();
      sound.currentTime = 0;
    }, 3000);
  };

  // Event listener for button clicks
  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  render() {
    return (
      <div className='App'>
        <div className='container'>
          <div className='flex-row'>
            <Break breakTime={this.state.breakTime} />
            <Session sessionTime={this.state.sessionTime} />
          </div>
          <Timer props={this.state} timeString={this.timeString()} />
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
const Timer = ({ props: { isRunning, isOnBreak }, timeString }) => {
  return (
    <div className='timer-container'>
      <audio
        src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
        id='beep'
        loop
      ></audio>
      <h2 id='timer-label'>{isOnBreak ? 'Break' : 'Session'}</h2>
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
