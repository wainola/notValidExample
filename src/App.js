import React, { useState, useContext, useEffect, useReducer } from 'react';
import './App.css';

const Context = React.createContext();

const Login = () => {
  const { state, setState } = useContext(Context);
  const handleSubmit = evt => {
    evt.preventDefault();
    setState({
      ...state,
      logged: true,
      mainView: true
    });
  };
  return (
    <div className="mainLogger">
      <form onSubmit={handleSubmit}>
        <label htmlFor="">User</label>
        <input type="text" />
        <label htmlFor="">Pass</label>
        <input type="text" />
        <button>Signin</button>
      </form>
    </div>
  );
};

const Service1 = () => {
  return (
    <div>
      <h2>Service 1</h2>
      <h4>Status health</h4>
    </div>
  );
};

const Service2 = () => {
  return (
    <div>
      <h2>Service 2</h2>
      <h4>Status health</h4>
    </div>
  );
};

const MainView = () => {
  const { stateSimulations, setSimulations } = useContext(Context);
  const reducer = (state, action) => {
    switch (action.type) {
      case 'fetchs1':
        return { ...state, s1: action.payload };
      case 'errors1':
        return { ...state, s1: action.payload };
      case 'fetchs2':
        return { ...state, s2: action.payload };
      case 'errors2':
        return { ...state, s2: action.payload };
    }
  };
  const initState = {
    s1: {},
    s2: {}
  };
  const [state, dispacher] = useReducer(reducer, initState);
  const { s1, s2 } = stateSimulations;

  const service1Request = status =>
    new Promise((resolve, reject) => {
      if (!status)
        reject({
          status: 503,
          message: 'Service Unavailable'
        });

      return resolve({
        status: 200,
        message: 'Ok'
      });
    });

  const service2Request = status =>
    new Promise((resolve, reject) => {
      if (!status)
        reject({
          status: 503,
          message: 'Service Unavailable'
        });

      return resolve({
        status: 200,
        message: 'Ok'
      });
    });

  const execR1 = async status => {
    try {
      const r1 = await service1Request(status);
      dispacher({
        type: 'fetchs1',
        payload: r1
      });
    } catch (error) {
      dispacher({
        type: 'errors1',
        payload: error
      });
    }
  };

  const execR2 = async status => {
    try {
      const r2 = await service2Request(status);
      dispacher({
        type: 'fetchs2',
        payload: r2
      });
    } catch (error) {
      dispacher({
        type: 'errors2',
        payload: error
      });
    }
  };

  useEffect(() => {
    execR1(s1);
    execR2(s2);
  }, [s1, s2]);

  return (
    <div>
      <div>
        {state.s1.status && state.s1.status !== 503 ? (
          <Service1 />
        ) : (
          <div>
            <h2>Service 1 Unavailable</h2>
          </div>
        )}
      </div>
      <div>
        {state.s2.status && state.s2.status !== 503 ? (
          <Service2 />
        ) : (
          <div>
            <h2>Service 2 Unavailable</h2>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [state, setState] = useState({
    logged: false,
    mainView: false,
    service1: false,
    service2: false,
    serviceHealth1: false,
    serviceHealth2: false
  });

  const [stateSimulations, setSimulations] = useState({
    s1: true,
    s2: true
  });

  const handleClickState = evt => {
    evt.preventDefault();
    const {
      target: { name }
    } = evt;

    setSimulations({
      ...stateSimulations,
      [name]: !stateSimulations[name]
    });
  };

  return (
    <Context.Provider value={{ stateSimulations, setSimulations, state, setState }}>
      <div>
        <div className="mainControls">
          <h2>Simulations</h2>
          <form action="">
            <button onClick={handleClickState} name="s1">
              Change state S1
            </button>
            <button onClick={handleClickState} name="s2">
              Change state s2
            </button>
          </form>
        </div>
        <div className="mainApp">
          {!state.logged && <Login />}
          {state.mainView && <MainView />}
        </div>
      </div>
    </Context.Provider>
  );
}

export default App;
