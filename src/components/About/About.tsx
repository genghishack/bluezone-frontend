import React from 'react';
import './About.scss';

const About = () => {
  return (
    <div className="About">
      <h1>About this project</h1>

      <p>
        Project Bluezone is an effort to visualize data about the U.S. government
        in an easily-digestible form, enabling organizing efforts with easy access
        to information on choke points and blockages within the system.
        In other words, to show where to move the levers so that organizers
        and volunteers can have the greatest effect across the entire country.
      </p>

      <h2>Goals</h2>

      <ul>
        <li>
          Using a map - based interface, display publicly-available data on various
          levels of government, including the U.S.Congress, Executive branch and the
          Judiciary.
        </li>

        <li>
          Display party affiliations and voting records of members of congress.
        </li>

        <li>
          Display, by color, party representation for states, congressional districts
          and the electoral college map, and show how representation has changed over
          time.
        </li>

        <li>
          Show, via a time scale, how various changes in redistricting in the
          congressional map have changed representation of voters in states where
          gerrymandering is present.
        </li>

        <li>
          Provide access to resources to facilitate organizational efforts, in order
          to further democratize our voting process and ensure that the will of the
          majority of voters is properly represented.
        </li>
      </ul>

      <h2>Progress</h2>

      <p>
        Project Bluezone is still in development.We are approaching a proof-of-concept
        that will enable us to build in greater functionality more rapidly.
      </p>

      <h3>Some immediate goals</h3>

      <ul>
        <li>
          Load geospatial data by year to show changes in the number and shapes 
          of congressional districts, each time they have been redistricted.
          Note that we are currently using a map of the congressional districts
          from 2018, while having the ability to select years going back to 1789.
          Future maps will accurately represent the number of states and congressional 
          districts that were part of the U.S. in any given year.
        </li>
        <li>
          More efficient data querying to increase performance and usability.
        </li>
      </ul>
      <h2>Kudos</h2>

      <p>
        This project builds on work by Joshua Tauberer(@govtrack/@larsa4d),
        Aaron P. Dennis (@azavea) and the many contributors to the @unitedstates
        public repository of data and tools on github.
      </p>

      <h2>Technical stuff</h2>

      <p>
        Project Bluezone is currently being built using Typescript, Postgres,
        Node.js, React and Mapbox GL.
      </p>
    </div>
  )
}

export default About;
