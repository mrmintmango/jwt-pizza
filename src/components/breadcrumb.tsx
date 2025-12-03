import React from 'react';
import { NavLink } from 'react-router-dom';
import { HouseIcon, GreaterThanIcon } from '../icons';

interface Props {
  location: string;
}

export default function Breadcrumb(props: Props) {
  let currentPath = '';
  
  // Security: Sanitize path segments to prevent XSS and path traversal
  const sanitizePath = (pathSegment: string): string => {
    // Remove any path traversal attempts and special characters
    return pathSegment.replace(/\.\./g, '').replace(/[<>"']/g, '').trim();
  };
  
  const paths = props.location.split('/').map((path) => {
    const sanitizedPath = sanitizePath(path);
    currentPath += '/' + sanitizedPath;
    return (
      <li key={sanitizedPath} className="inline-flex items-center text-sm font-semibold text-gray-800 truncate" aria-current="page">
        <GreaterThanIcon />

        <NavLink className="flex items-center text-sm text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600" to={currentPath}>
          {sanitizedPath}
        </NavLink>
      </li>
    );
  });
  return (
    <ol className="flex items-center whitespace-nowrap py-2 px-4 bg-gray-300">
      <li className="inline-flex items-center">
        <NavLink className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600" to="/">
          <span className="mx-1">
            <HouseIcon />
          </span>
          home
        </NavLink>
      </li>
      {location && paths}
    </ol>
  );
}
