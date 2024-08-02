// MeetTheTeam.js
import React from 'react';
import './MeetTheTeam.css'; // Import CSS for this component

const MeetTheTeam = () => (
  <section id="meet-the-team" className="meet-the-team">
    <div className="container">
      <h2 className="meet-the-team-title">Meet the Team</h2>
      <div className="team-members">
        {/* Add your team members here */}
        <div className="team-member">
          <img src={require("./assets/IMG_0776.jpg")} alt="Hazel Yu" className="team-member-photo" />
          <h3>Hazel Yu</h3>
          <p>Project Manager</p>
        </div>
        <div className="team-member">
          <img src={require("./assets/IMG_8934.jpeg")} alt="Tyler Du" className="team-member-photo" />
          <h3>Tyler Du</h3>
          <p>Development Operators</p>
        </div>
        <div className="team-member">
          <img src={require("./assets/IMG_7842_copy_2.jpg")} alt="Team Member 3" className="team-member-photo" />
          <h3>Ritika Brahmadesam</h3>
          <p>Software Engineer</p>
        </div>
        <div className="team-member">
          <img src={require("./assets/IMG_3173.jpeg")} alt="Team Member 4" className="team-member-photo" />
          <h3>Arnav Mukherjee</h3>
          <p>UI Developer</p>
        </div>
      </div>
    </div>
  </section>
);

export default MeetTheTeam;

