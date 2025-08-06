import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; 2025 FujitsuIntern.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1"></span>
        <a href="https://www.fujitsu.com/global/about/csr/sdgs/#anc-01" target="_blank" rel="noopener noreferrer">
          Fujitsu SDGs
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
