import React from 'react'

export interface HeaderProps {
  icon: string
  title: string
}

const Header: React.SFC<HeaderProps> = props => (
  <header>
    <h1><i className={`fa fa-${props.icon}`}/>{props.title}</h1>
    {window.account && <img className="user--icon" src={window.account.profile_image_url} />}
  </header>
)

export default Header
