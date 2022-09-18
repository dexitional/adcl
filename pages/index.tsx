import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import Receipt from '../components/Receipt'
import Login from './login'

const Home: NextPage = () => {
  return <Login />
}

export default Home
