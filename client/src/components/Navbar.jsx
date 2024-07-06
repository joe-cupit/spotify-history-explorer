import "./Navbar.css";

import { Link, useMatch, useResolvedPath } from "react-router-dom"


export function Navbar() {

    return (
      <nav className="nav">
        <span className="nav-left">
          <Link to={'/'} className="nav-title">Spotify History</Link>
          <ul>
            <CustomLink to={'/artists'}>Artists</CustomLink>
            <CustomLink to={'/tracks'}>Tracks</CustomLink>
            <CustomLink to={'/albums'}>Albums</CustomLink>
            <CustomLink to={'/shows'}>Shows</CustomLink>
          </ul>
        </span>

        <span className="nav-right">
          <input type="search" placeholder="Search" />
          <button>Search</button>
        </span>
      </nav>
    )
}


function CustomLink( {to , children, ...props } ) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch( {path: resolvedPath.pathname} );

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>{children}</Link>
    </li>
  )
}
