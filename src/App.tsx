import './App.css'

import useRoutesElement from './routes/userRoutesElement'

function App() {
  const routes = useRoutesElement()

  return <>{routes}</>
}

export default App