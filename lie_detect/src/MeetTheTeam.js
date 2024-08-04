import React, { useEffect } from 'react';
import './MeetTheTeam.css'; // Import CSS for this component

const MeetTheTeam = () => {
  useEffect(() => {
    // Add dark mode class to the body when component mounts
    document.body.classList.add('dark-mode');

    // Remove dark mode class when component unmounts
    return () => {
      document.body.classList.remove('dark-mode');
    };
  }, []);

  return (
    <section id="meet-the-team" className="meet-the-team">
      <div className="container">
        <h2 className="meet-the-team-title">Meet the Team</h2>
        <div className="team-members">
          {/* Add your team members here */}
          <div className="team-member">
            <img src={require("./assets/IMG_0776.jpg")} alt="Hazel Yu" className="team-member-photo" />
            <h3>Hazel Yu</h3>
            <p className="team-member-title">Project Manager & UI Developer</p> {/* Apply the new class */}
          </div>
          <div className="team-member">
            <img src={require("./assets/IMG_8934.jpeg")} alt="Tyler Du" className="team-member-photo" />
            <h3>Tyler Du</h3>
            <p className="team-member-title">Development Operators</p> {/* Apply the new class */}
          </div>
          <div className="team-member">
            <img src={require("./assets/IMG_7842_copy_2.jpg")} alt="Ritika Brahmadesam" className="team-member-photo" />
            <h3>Ritika Brahmadesam</h3>
            <p className="team-member-title">Development Operators</p> {/* Apply the new class */}
          </div>
          <div className="team-member">
            <img src={require("./assets/IMG_3173.jpeg")} alt="Arnav Mukherjee" className="team-member-photo" />
            <h3>Arnav Mukherjee</h3>
            <p className="team-member-title">UI Developer</p> {/* Apply the new class */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetTheTeam;

