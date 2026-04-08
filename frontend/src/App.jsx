import './App.scss'
import { Header } from '@components/Header'
import { Home, Categories, Login, Register, Profil } from '@pages'
import { Footer } from '@components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Toaster } from './components/Toaster'

import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export const App = () => {

  const { i18n } = useTranslation()

  useEffect(() => {

    document.documentElement.lang = i18n.language

  }, [i18n.language])

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="*" element={<p>404 not found</p>} />
        </Routes>
        <Toaster />
        <Footer />
      </BrowserRouter >
    </>
  )
}
