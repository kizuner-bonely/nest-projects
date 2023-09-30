import { Link, Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <div>
        <Link to="/aaa" children="to aaa" />
      </div>
      <div>
        <Link to="/bbb" children="to bbb" />
      </div>
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default App
