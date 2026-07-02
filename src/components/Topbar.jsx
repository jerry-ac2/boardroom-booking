import React from 'react'
import { Link } from 'react-router-dom'

export default function Topbar(){
  return (
    <div className="topbar clearfix">
      <div className="custom-container topbar-inner">
        <ul className="topbar-items">
          <li className="nav-item">
            <div className="nav-item-inner">
              <div className="header-topbar-text-1">Welcome to The Federal Airports Authority of Nigeria.</div>
            </div>
          </li>
        </ul>

        <ul className="topbar-items nav pull-right">
          <li className="nav-item">
            <div className="nav-item-inner">
              <div className="custom-address-image">
                <a href="https://www.pebec.gov.ng/reportgov-ng" target="_blank" rel="noreferrer">
                  <img src="/dist/assets/FAAN_logo-removebg-preview.png" alt="pebec" />
                </a>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-item-inner">
              <div className="header-phone"><a href="tel:+2349150728136">+2349150728136</a></div>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-item-inner">
              <div className="header-email"><a href="mailto:contact@faan.gov.ng">contact@faan.gov.ng</a></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
