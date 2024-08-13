import React from 'react'
import Navbar from './Navbar'
import ProjectList from './ProjectList'
import './index.scss'
const HomeLayout = () => {
  return (
    <div>
        <Navbar></Navbar>
        <ProjectList></ProjectList>
    </div>
  )
}

export default HomeLayout