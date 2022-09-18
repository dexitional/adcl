import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import Table from '../components/Table'
import Login from './login'

const StockLog: NextPage = () => {
  return (
     <Layout title="Stock Log">
        <Table
           header={
            [
             'SDK version',
             'Release channel'
            ]
        }>
            <span>44.0.0</span>
            <span>default</span>
            <span>kobby</span>
            <span>1.0.0</span>
            <span>1</span>
            <span>5837b81</span>
            <span>Ebenezer Ackah</span>
        </Table>
     </Layout>
  )
}

export default StockLog
