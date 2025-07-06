import { Router } from 'next/router'
import React from 'react'

type WindowWithAnalytics = Window &
  typeof globalThis & {
    gtag: any
  }

export const useAnalytics = (trackingID) => {
  React.useEffect(() => {
    const handleRouteChange = (url) => {
      if (process.env.NODE_ENV === 'production') {
        ;(window as WindowWithAnalytics).gtag('config', trackingID, {
          page_location: url,
          page_title: document.title,
        })
      }
    }
    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => Router.events.off('routeChangeComplete', handleRouteChange)
  }, [])
}
